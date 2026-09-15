# CardioGuard

## GitHub Pages deployment

The React frontend deploys to GitHub Pages through `.github/workflows/deploy-pages.yml` on every push to `main`.

Before the first deployment, enable **Settings > Pages > Build and deployment > GitHub Actions** in the repository. The published site will be available at:

`https://tanishqtiwari1.github.io/Cardioguard/`

GitHub Pages does not run the FastAPI backend. Host `Backend/` on a Python service such as Render or Railway, then add a repository variable named `VITE_API_BASE_URL` containing the deployed API URL ending in `/api/v1`.

For local development, run `npm run dev` from the repository root. This starts the frontend and backend together.