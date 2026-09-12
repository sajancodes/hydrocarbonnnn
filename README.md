# HoloHydro - Interactive 3D Holographic Molecular Simulator

An interactive 3D hydrocarbon visualization, synthesis, and IUPAC learning platform powered by WebGL, Three.js, MediaPipe hand-tracking sensors, and Google Gemini.

---

## 🚀 Deploying to Vercel

This repository is pre-configured and 100% ready for zero-config Vercel deployment.

### Method 1: Import via Vercel Dashboard (Recommended)

1. Push this project to your **GitHub** / **GitLab** / **Bitbucket** repository.
2. Go to [vercel.com/new](https://vercel.com/new) and click **Import** next to your repository.
3. Vercel will automatically detect the settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `vite build` (or leave default `npm run build`)
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Optional but recommended)* Your Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/).
   *(Note: If omitted, the app will automatically fall back to the PubChem 3D database and the offline procedural IUPAC generator).*
5. Click **Deploy**.

---

### Method 2: Deploy using Vercel CLI

```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

When prompted by the CLI, accept the default values.

---

## ⚙️ Configuration Files Included for Vercel

- **`vercel.json`**:
  - Configures the build output directory (`dist`)
  - Sets up routing rewrites so client-side navigation and SPA reloading work seamlessly
  - Routes `/api/*` requests to Vercel Serverless Functions
- **`/api` directory**:
  - `/api/generate-molecule.ts`: Serverless API route to generate 3D conformers for any IUPAC or chemical name.
  - `/api/generate-questions.ts`: Serverless API route for adaptive curriculum questions.
  - `/api/health.ts`: Health check endpoint.
- **Dual-Platform Architecture**:
  - Works on **Vercel** via Serverless Functions (`/api/*`) and Edge CDN static hosting.
  - Also works on **Docker / Cloud Run / Google AI Studio** via `server.ts` Express server.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run full-stack dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```
