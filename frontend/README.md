# 🎨 Frontend - Gizmet.dev

> **Modern React Application**  
> A beautiful, responsive frontend built with React 19, Tailwind CSS, and Radix UI components.

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **Yarn** package manager

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Build for production
yarn build

# Run tests
yarn test
```

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `yarn start` | Runs the app in development mode at [http://localhost:3000](http://localhost:3000) |
| `yarn build` | Builds the app for production to the `build` folder |
| `yarn test` | Launches the test runner in interactive watch mode |

---

## 🎨 UI Components

This project uses a comprehensive set of UI components built with **Radix UI** and styled with **Tailwind CSS**:

### 📦 Available Components
- **Layout**: Card, Separator, Aspect Ratio
- **Navigation**: Navigation Menu, Breadcrumb, Pagination
- **Forms**: Input, Textarea, Select, Checkbox, Radio Group, Switch
- **Feedback**: Alert, Toast, Progress, Skeleton
- **Overlay**: Dialog, Sheet, Popover, Tooltip, Hover Card
- **Data Display**: Table, Badge, Avatar, Calendar
- **Interactive**: Button, Toggle, Slider, Command
- **Layout**: Accordion, Collapsible, Tabs, Resizable Panels

### 🎯 Component Features
- **Accessible** - Built on Radix UI primitives
- **Customizable** - Easy to theme and modify
- **Type-safe** - Full TypeScript support
- **Responsive** - Mobile-first design approach
- **Consistent** - Unified design system

---

## 🎨 Styling

### Tailwind CSS Configuration
- **Custom colors** and design tokens
- **Responsive breakpoints** for all screen sizes
- **Dark mode** support (when enabled)
- **Custom animations** and transitions
- **Component-specific** utility classes

### Design System
```css
/* Primary Colors */
--primary: 222.2 84% 4.9%;
--primary-foreground: 210 40% 98%;

/* Secondary Colors */
--secondary: 210 40% 96%;
--secondary-foreground: 222.2 84% 4.9%;

/* Accent Colors */
--accent: 210 40% 96%;
--accent-foreground: 222.2 84% 4.9%;
```

---

## 📁 Project Structure

```
frontend/
├── 📁 public/                  # Static assets
│   └── 📄 index.html          # HTML template
├── 📁 src/
│   ├── 📁 components/         # React components
│   │   └── 📁 ui/            # Reusable UI components
│   │       ├── 📄 button.jsx
│   │       ├── 📄 card.jsx
│   │       ├── 📄 input.jsx
│   │       └── ...            # 30+ UI components
│   ├── 📁 hooks/             # Custom React hooks
│   │   └── 📄 use-toast.js
│   ├── 📁 lib/               # Utility functions
│   │   └── 📄 utils.js
│   ├── 📄 App.js             # Main App component
│   ├── 📄 App.css            # Global styles
│   ├── 📄 index.js           # Entry point
│   └── 📄 index.css          # Global CSS
├── 📄 package.json           # Dependencies
├── 📄 tailwind.config.js     # Tailwind configuration
├── 📄 craco.config.js        # CRACO configuration
└── 📄 postcss.config.js      # PostCSS configuration
```

---

## 🔧 Configuration

### CRACO Configuration
The project uses **CRACO** (Create React App Configuration Override) to customize the webpack configuration:

```javascript
// craco.config.js
module.exports = {
  // Custom webpack configuration
  // Health check endpoints
  // Visual edits support
};
```

### Tailwind Configuration
Custom Tailwind configuration with:
- **Custom color palette**
- **Extended spacing scale**
- **Custom animations**
- **Component-specific utilities**

---

## 🚀 Performance

### Build Optimization
- **Code splitting** for optimal loading
- **Tree shaking** to remove unused code
- **Minification** and compression
- **Asset optimization** for images and fonts

### Bundle Analysis
```bash
# Analyze bundle size
yarn build --analyze
```

**Current bundle sizes:**
- JavaScript: ~74.5 kB (gzipped)
- CSS: ~8.94 kB (gzipped)

---

## 🧪 Testing

### Test Setup
- **Jest** for unit testing
- **React Testing Library** for component testing
- **Custom test utilities** for common patterns

### Running Tests
```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test --coverage
```

---

## 🌐 Browser Support

- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)

---

## 📦 Dependencies

### Core Dependencies
- **React 19** - UI library
- **React DOM 19** - DOM rendering
- **React Router DOM 7** - Client-side routing

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Class Variance Authority** - Component variants

### Development
- **CRACO 7.1.0** - CRA configuration override
- **PostCSS 8.4.49** - CSS processing
- **Autoprefixer 10.4.20** - CSS vendor prefixes

---

## 🚀 Deployment

The frontend is automatically deployed to **GitHub Pages** when changes are pushed to the main branch.

**Deployment process:**
1. Build the production bundle
2. Copy files to root directory
3. Commit and push to GitHub
4. GitHub Pages serves the static files

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

---

## 📄 License

This project is part of the Gizmet.dev portfolio and is available under the [MIT License](../../LICENSE).

---

<div align="center">

**Built with ❤️ using React, Tailwind CSS, and Radix UI**

[🌐 Live Site](https://gizmet.dev) • [📚 Documentation](../../README.md) • [🐛 Report Bug](https://github.com/Gizmet/gizmet.dev/issues)

</div>