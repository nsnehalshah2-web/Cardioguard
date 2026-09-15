import os
import smtplib
from email.message import EmailMessage


def send_password_reset_email(recipient: str, reset_url: str) -> None:
    host = os.getenv("SMTP_HOST")
    username = os.getenv("SMTP_USERNAME")
    password = os.getenv("SMTP_PASSWORD")
    sender = os.getenv("SMTP_FROM")
    if not all((host, username, password, sender)):
        raise RuntimeError("Password reset email service is not configured")

    message = EmailMessage()
    message["Subject"] = "Reset your CardioGuard password"
    message["From"] = sender
    message["To"] = recipient
    message.set_content(
        "Use this link to reset your CardioGuard password:\n\n"
        f"{reset_url}\n\n"
        "This link expires in 30 minutes and can only be used once."
    )

    port = int(os.getenv("SMTP_PORT", "587"))
    with smtplib.SMTP(host, port, timeout=10) as smtp:
        if os.getenv("SMTP_USE_TLS", "true").lower() == "true":
            smtp.starttls()
        smtp.login(username, password)
        smtp.send_message(message)