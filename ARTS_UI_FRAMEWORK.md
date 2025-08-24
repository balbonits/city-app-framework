# Arts UI Framework & Library

## Overview
Arts is the style library in the City App Framework, previously referred to as Blueprint/Canvas. It handles CSS and UI styling with Tailwind CSS, custom utilities, and themes. Focuses on mobile-first, responsive design for consistent, reusable UI across components.

## Purpose
Provides visual foundation for **Components**, ensuring adaptability to different devices and themes. Supports mobile-first UX/UI tenant, minimal dependencies.

## Conventions
- **Mobile-First**: Base styles for small screens (min-width: 0), scale up with media queries (e.g., sm:, md: in Tailwind).
- **Responsive Design**: Use fluid layouts (%, rem, vw), Tailwind utilities for breakpoints.
- **Themes**: Variable-based themes in `styles/themes/` (e.g., dark.css overrides --primary-color).
- **Custom Utilities**: Extend Tailwind in `styles/arts.css` with @layer components (e.g., .btnPrimary).
- **BEM Integration**: Use BEM for structure (e.g., nav-app-header), combined with Tailwind utilities.
- **Naming**: Classes follow BEM or `{type}{PascalCase}` (e.g., btnPrimary, cntContainer).
- **Testing**: Responsive tests in Storybook, Playwright for cross-browser.
- **Optimization**: Inline critical CSS, lazy-load non-critical styles, integrate with build tools (Vite/Webpack).
- **Documentation**: Detail in SPECS.md, COMPLIANCE.md; examples in Storybook.

## Setup
1. Install Tailwind: `npm install tailwindcss`.
2. Configure tailwind.config.js with custom themes.
3. Import in App.tsx: `import './styles/arts.css';`.

## Example: arts.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btnPrimary {
    @apply px-4 py-2 rounded text-[var(--text-color, white)] bg-[var(--primary-color, #007bff)] transition duration-300;
  }

  .cntContainer {
    @apply p-4 bg-[var(--background-color, #fff)] w-full sm:w-3/4 md:w-1/2;
  }

  .nav-app-header {
    @apply flex gap-4 p-4 sm:flex-row md:gap-6;
  }
}
```

## Example: Theme File (styles/themes/dark.css)
```css
:root {
  --primary-color: #1e40af;
  --background-color: #1f2937;
  --text-color: #f3f4f6;
}
```

## Example: Responsive Component
```tsx
import { useTheme } from '../../store/useThemeContext';

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  return <div className={`cntContainer ${theme}`}>{children}</div>;
};

export default Container;
```

## Compliance
- WCAG 2.1: Responsive layouts support screen readers, keyboard navigation.
- Document in COMPLIANCE.md.

## Refinements
- Add animations, viewports.
- Expand themes for custom user files.
- Integrate with optimization (lazy loading).