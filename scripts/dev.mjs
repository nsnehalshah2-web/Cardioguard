import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import process from 'node:process';

const projectRoot = resolve(import.meta.dirname, '..');
const backendRoot = join(projectRoot, 'Backend');
const frontendRoot = join(projectRoot, 'Frontend');
const python = join(backendRoot, '.venv', 'bin', 'python');
const uvicorn = join(backendRoot, '.venv', 'bin', 'uvicorn');
const vite = join(frontendRoot, 'node_modules', '.bin', 'vite');

function run(command, args, options = {}) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, { stdio: 'inherit', ...options });
    child.once('error', rejectRun);
    child.once('exit', (code, signal) => {
      if (signal) rejectRun(new Error(`${command} stopped with ${signal}`));
      else if (code !== 0) rejectRun(new Error(`${command} exited with code ${code}`));
      else resolveRun();
    });
  });
}

async function ensureBackendEnvironment() {
  if (!existsSync(python)) {
    console.log('Creating Backend/.venv...');
    await run('python3', ['-m', 'venv', '.venv'], { cwd: backendRoot });
  }
  if (!existsSync(uvicorn)) {
    console.log('Installing backend requirements...');
    await run(python, ['-m', 'pip', 'install', '-r', 'requirements.txt'], { cwd: backendRoot });
  }
  if (process.platform === 'darwin') {
    try {
      await run('brew', ['list', 'libomp']);
    } catch {
      console.log('Installing macOS OpenMP runtime for XGBoost...');
      await run('brew', ['install', 'libomp']);
    }
  }
}

async function main() {
  await ensureBackendEnvironment();
  if (!existsSync(vite)) {
    console.log('Installing frontend dependencies...');
    await run('npm', ['install'], { cwd: frontendRoot });
  }

  const backend = spawn(uvicorn, ['app.main:app', '--host', '127.0.0.1', '--port', '8000'], {
    cwd: backendRoot,
    stdio: 'inherit',
  });
  const frontend = spawn(vite, ['--host', '127.0.0.1'], {
    cwd: frontendRoot,
    stdio: 'inherit',
  });

  const stop = () => {
    backend.kill('SIGTERM');
    frontend.kill('SIGTERM');
  };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
  backend.once('exit', (code) => { if (code && code !== 143) frontend.kill('SIGTERM'); });
  frontend.once('exit', (code) => { if (code && code !== 143) backend.kill('SIGTERM'); });
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});