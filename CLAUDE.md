# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DOCU-FORGE landing page - a React-based single-page application for a documentary development system. The project uses Create React App (CRA) with CRACO for configuration overrides, Tailwind CSS for styling, and shadcn/ui components. Deployment is automated via GitHub Actions to GitHub Pages.

## Repository Structure

```
/
├── frontend/           # React application (main codebase)
│   ├── src/
│   │   ├── pages/     # Page components (LandingPage.jsx)
│   │   ├── components/ui/  # shadcn/ui components (Radix UI based)
│   │   ├── lib/       # Utility functions (Tailwind merge utilities)
│   │   └── hooks/     # Custom React hooks (toast)
│   ├── plugins/       # CRACO plugins (visual-edits, health-check)
│   ├── public/        # Static assets
│   └── build/         # Production build output (not committed)
├── backend/           # FastAPI server (currently unused in production)
├── .github/workflows/ # GitHub Actions CI/CD
└── static/            # Static assets served from root
```

## Development Commands

All commands must be run from the `frontend/` directory:

```bash
cd frontend

# Install dependencies (uses Yarn)
yarn install

# Start development server (http://localhost:3000)
yarn start

# Create production build (outputs to frontend/build/)
yarn build

# Run tests
yarn test
```

**Important**: This project uses Yarn as the package manager. Package manager is locked via `packageManager` field in package.json to Yarn 1.22.22.

## Build System

### CRACO Configuration

The project uses CRACO (Create React App Configuration Override) to customize CRA without ejecting. Key customizations in `frontend/craco.config.js`:

- **Path aliases**: `@/` maps to `src/` for cleaner imports
- **Webpack watch optimizations**: Excludes node_modules, .git, build, dist, coverage, and public directories
- **Optional plugins**: Visual editing and health check plugins (disabled by default)
- **Hot reload control**: Can be disabled via `DISABLE_HOT_RELOAD=true` environment variable

### Environment Variables

Optional features controlled by environment variables:
- `DISABLE_HOT_RELOAD=true` - Disables webpack hot reload
- `REACT_APP_ENABLE_VISUAL_EDITS=true` - Enables visual editing features
- `ENABLE_HEALTH_CHECK=true` - Enables health check endpoints

## Styling Architecture

### Tailwind CSS + shadcn/ui

The project uses Tailwind CSS v3 with the shadcn/ui component library:

- **Configuration**: `frontend/tailwind.config.js` defines the design system (colors, animations, border radius)
- **CSS Variables**: Design tokens are defined in `src/index.css` and `src/App.css` using HSL color space
- **Components**: All UI components in `src/components/ui/` are from shadcn/ui (based on Radix UI primitives)
- **Utility function**: `src/lib/utils.js` exports `cn()` for merging Tailwind classes with clsx and tailwind-merge

### Custom Styling

The landing page uses custom CSS in `src/App.css` with:
- Terminal-themed animations (typing effect, cursor blink)
- Grid backgrounds and gradient effects
- Responsive layouts using CSS Grid and Flexbox
- Custom color schemes defined via CSS variables

## Component Architecture

### Single Page Application

- **Router**: React Router v7 is configured but only serves the single LandingPage component
- **Main Component**: `src/pages/LandingPage.jsx` contains all landing page sections:
  - Hero section with animated terminal text
  - Problem/Solution split content
  - Capabilities grid (6 cards)
  - Social proof section
  - CTA section with contact info
  - Footer

### shadcn/ui Components

All components in `src/components/ui/` are pre-built shadcn components. To add new components, use:

```bash
# From frontend/ directory
npx shadcn@latest add [component-name]
```

Component configuration is stored in `frontend/components.json` (points to JSX style, using Tailwind).

## Deployment

### GitHub Actions Workflow

Automated deployment to GitHub Pages (`.github/workflows/deploy.yml`):

1. **Build job**:
   - Installs Node.js 18 with Yarn caching
   - Runs `yarn install --frozen-lockfile` in frontend/
   - Builds with `yarn build` (sets NODE_OPTIONS for 4GB memory, CI=false to ignore warnings)
   - Copies CNAME file to build directory
   - Uploads artifact from frontend/build/

2. **Deploy job**:
   - Deploys to GitHub Pages environment
   - Requires `contents: read`, `pages: write`, and `id-token: write` permissions

### Production Builds

When building for production:
- Output directory: `frontend/build/`
- The root `index.html`, `static/`, and `asset-manifest.json` are build outputs for GitHub Pages
- CNAME file at root configures custom domain

## Backend (Not in Production Use)

The `backend/` directory contains a FastAPI server with MongoDB integration, but it's not currently used in the deployed landing page. If backend development is needed:

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run server (requires .env with MONGO_URL and DB_NAME)
uvicorn server:app --reload
```

The backend provides:
- Status check endpoints at `/api/status` (GET/POST)
- MongoDB async client using Motor
- CORS middleware configured
- Pydantic models for validation

## Git Workflow

- **Main branch**: `main` (deployment target)
- **Deployment**: Automatic on push to main via GitHub Actions
- Recent history includes simplification to single-scroll landing page and workflow improvements

## Key Dependencies

Frontend:
- React 19.0.0 with React Router v7
- Radix UI primitives for accessible components
- Tailwind CSS 3.4+ with tailwindcss-animate
- Form handling: react-hook-form + zod + @hookform/resolvers
- Icons: lucide-react
- Carousel: embla-carousel-react
- Notifications: sonner (toast library)

Backend (if needed):
- FastAPI 0.110.1 with Uvicorn
- Motor 3.3.1 (async MongoDB client)
- Pydantic 2.6+ for validation

## Development Notes

### Path Aliasing

Import from `src/` using the `@/` alias:

```javascript
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
```

### Adding New Pages

To add new routes:
1. Create component in `src/pages/`
2. Add route in `src/App.js` within the `<Routes>` component
3. Update navigation if needed

### Modifying Styles

- **Global styles**: Edit `src/index.css` or `src/App.css`
- **Design tokens**: Modify CSS variables in `src/index.css` or Tailwind config
- **Component styles**: Use Tailwind utility classes or modify component CSS in App.css

### Custom Webpack Configuration

To modify webpack behavior:
1. Edit `frontend/craco.config.js`
2. Changes apply to both development and production builds
3. Restart dev server after configuration changes
