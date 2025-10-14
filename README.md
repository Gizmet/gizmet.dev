# 🚀 Gizmet.dev

> **Personal Portfolio & Digital Playground**  
> A modern, full-stack web application showcasing my projects, skills, and creative endeavors.

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-gizmet.dev-00D4AA?style=for-the-badge&logo=vercel)](https://gizmet.dev)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)

---

## ✨ What's Inside

This repository contains a complete full-stack application built with modern technologies:

### 🎨 **Frontend** (`/frontend`)
- **React 19** with modern hooks and functional components
- **Tailwind CSS** for beautiful, responsive design
- **Radix UI** components for accessible, customizable UI elements
- **React Router** for seamless navigation
- **Custom UI components** built with shadcn/ui patterns

### ⚡ **Backend** (`/backend`)
- **FastAPI** for high-performance API endpoints
- **MongoDB** with Motor for async database operations
- **Pydantic** for data validation and serialization
- **CORS** enabled for cross-origin requests

### 🛠 **Development Tools**
- **CRACO** for Create React App customization
- **ESLint** for code quality
- **PostCSS** for CSS processing
- **Webpack** health monitoring

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.8+)
- **MongoDB** (local or cloud instance)
- **Yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gizmet/gizmet.dev.git
   cd gizmet.dev
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   yarn install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file in backend directory
   MONGO_URL=your_mongodb_connection_string
   DB_NAME=your_database_name
   CORS_ORIGINS=http://localhost:3000,https://gizmet.dev
   ```

### Development

**Start the frontend development server:**
```bash
cd frontend
yarn start
```
*Opens at http://localhost:3000*

**Start the backend API server:**
```bash
cd backend
python server.py
```
*Runs at http://localhost:8000*

**Build for production:**
```bash
cd frontend
yarn build
```

---

## 🏗️ Project Structure

```
gizmet.dev/
├── 📁 frontend/                 # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable UI components
│   │   │   └── 📁 ui/          # shadcn/ui components
│   │   ├── 📁 hooks/           # Custom React hooks
│   │   └── 📁 lib/             # Utility functions
│   ├── 📁 public/              # Static assets
│   └── 📄 package.json
├── 📁 backend/                 # FastAPI backend
│   ├── 📄 server.py            # Main API server
│   └── 📄 requirements.txt     # Python dependencies
├── 📁 tests/                   # Test files
└── 📄 README.md               # This file
```

---

## 🎯 Features

- **🎨 Modern UI/UX** - Clean, responsive design with smooth animations
- **⚡ Fast Performance** - Optimized builds and efficient rendering
- **📱 Mobile-First** - Responsive design that works on all devices
- **♿ Accessible** - Built with accessibility in mind using Radix UI
- **🔧 Developer Experience** - Hot reload, linting, and modern tooling
- **🚀 Production Ready** - Optimized builds and deployment configuration

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **Framer Motion** - Animation library

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Development
- **Yarn** - Package manager
- **CRACO** - Create React App Configuration Override
- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/` | Health check |
| `POST` | `/api/status` | Create status check |
| `GET` | `/api/status` | Get all status checks |

---

## 🚀 Deployment

The application is deployed on **GitHub Pages** with **Cloudflare** CDN for optimal performance.

**Automatic deployment:** Push to `main` branch triggers automatic deployment.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 📞 Contact

**Gizmet** - [@gizmet](https://github.com/Gizmet) - [gizmet.dev](https://gizmet.dev)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ and lots of ☕

</div>