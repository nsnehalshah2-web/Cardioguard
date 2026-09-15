import hashlib
import logging
import os
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.password_reset import PasswordResetToken
from app.models.user import User
from app.schemas.auth import ForgotPasswordRequest, LoginRequest, ResetPasswordRequest, TokenResponse, UserCreate, UserResponse
from app.security import create_access_token, get_current_user, hash_password, verify_password
from app.services.email import send_password_reset_email

router = APIRouter()
logger = logging.getLogger(__name__)
RESET_TOKEN_MINUTES = 30


def hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def utc_datetime(value):
    return value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value.astimezone(timezone.utc)


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, db: Session = Depends(get_db)):
    if data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if len(data.password.encode("utf-8")) > 72:
        raise HTTPException(status_code=400, detail="Password must be 72 bytes or fewer")
    email = data.email.lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    user = User(name=data.name.strip(), email=email, password_hash=hash_password(data.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return TokenResponse(access_token=create_access_token(user.id), user=user)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower()).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email or password is incorrect")
    return TokenResponse(access_token=create_access_token(user.id), user=user)


@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower()).first()
    if user:
        raw_token = secrets.token_urlsafe(48)
        reset_token = PasswordResetToken(
            user_id=user.id,
            token_hash=hash_reset_token(raw_token),
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=RESET_TOKEN_MINUTES),
        )
        db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.used_at.is_(None),
        ).update({PasswordResetToken.used_at: datetime.now(timezone.utc)})
        db.add(reset_token)
        db.commit()
        frontend_url = os.getenv("FRONTEND_APP_URL", os.getenv("FRONTEND_URL", "http://127.0.0.1:5173")).rstrip("/")
        try:
            send_password_reset_email(user.email, f"{frontend_url}/reset-password?token={raw_token}")
        except Exception as error:
            db.delete(reset_token)
            db.commit()
            logger.error("Password reset email delivery failed: %s", error)
    return {"message": "If an account exists for that email, a password reset link has been sent."}


@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    if data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if len(data.password.encode("utf-8")) > 72:
        raise HTTPException(status_code=400, detail="Password must be 72 bytes or fewer")
    reset_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token_hash == hash_reset_token(data.token),
        PasswordResetToken.used_at.is_(None),
    ).first()
    now = datetime.now(timezone.utc)
    if not reset_token or utc_datetime(reset_token.expires_at) <= now:
        raise HTTPException(status_code=400, detail="This password reset link is invalid or expired")
    user = db.query(User).filter(User.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="This password reset link is invalid or expired")
    user.password_hash = hash_password(data.password)
    reset_token.used_at = now
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.id != reset_token.id,
        PasswordResetToken.used_at.is_(None),
    ).update({PasswordResetToken.used_at: now})
    db.commit()
    return {"message": "Your password has been reset. You can now sign in."}


@router.get("/me", response_model=UserResponse)
def me(user: User = Depends(get_current_user)):
    return user
