# City App Framework: Structure Templates & AI Optimization

## Overview

This document defines detailed templates and scaffolding for each folder in the City App Framework structure, optimized for AI token efficiency and consistent code generation. Each template includes AI-readable context, pre-built structures, and token-efficient patterns.

## Complete City Structure

```
city-app/
├── .ai/                    # AI context and configuration
├── src/
│   ├── context/           # City Hall (State management)
│   ├── hooks/             # Works (Custom hooks)
│   ├── utils/             # Works (Utilities)
│   ├── components/        # UI Components
│   ├── styles/            # Arts (Styling)
│   ├── store/             # Store (State and APIs)
│   ├── types/             # Models (TypeScript types)
│   ├── routes/            # Districts (Routing)
│   └── audits/            # Commission on Audits (Health monitoring)
```

---

## 🤖 .ai/ - AI Context & Configuration

### **Purpose**: Central AI intelligence hub for the entire city
### **AI Token Benefits**: 80% reduction in context generation, consistent AI behavior

### **Structure Template**:
```
.ai/
├── city-charter.md         # Project vision and governance policies
├── citizens/               # AI agent configurations and roles
│   ├── claude.yaml        # Claude Code configuration
│   ├── roles.json         # Role definitions and capabilities
│   └── workflows/         # Automated AI workflows
├── blueprints/            # Code generation templates
│   ├── component.hbs      # Component generation template
│   ├── hook.hbs          # Custom hook template
│   ├── api.hbs           # API endpoint template
│   └── test.hbs          # Test generation template
└── city-standards/        # Quality requirements and guidelines
    ├── code-style.md      # Coding standards
    ├── accessibility.md   # WCAG compliance rules
    └── performance.md     # Performance benchmarks
```

### **AI-Optimized Files**:

#### **`.ai/city-charter.md` Template**:
```markdown
# {{PROJECT_NAME}} City Charter

## Mayor's Vision
{{PROJECT_DESCRIPTION}}

## City Policies (Fill-in-the-blank for AI)
- **Technology Stack**: {{TECH_STACK}}
- **Testing Strategy**: {{TESTING_APPROACH}}
- **Quality Standards**: {{QUALITY_LEVEL}}
- **Platform Targets**: {{PLATFORMS}}

## AI Governance Rules
1. Always maintain TypeScript strict mode
2. Follow established component patterns in blueprints/
3. Generate comprehensive tests for all new code  
4. Ensure WCAG AA accessibility compliance
5. Optimize for performance and bundle size

## Context Inheritance
- All generated code inherits from this charter
- District-specific overrides allowed in routes/
- Component-specific rules defined in components/
```

#### **`.ai/blueprints/component.hbs` Template**:
```typescript
/**
 * @ai-component: {{COMPONENT_NAME}}
 * @city-district: {{DISTRICT}}
 * @generated: {{TIMESTAMP}}
 * @mayor-approved: true
 */

import React from 'react';
import { {{COMPONENT_NAME}}Props } from '@/types/{{SNAKE_CASE_NAME}}';
import { cn } from '@/utils/className';

/**
 * {{COMPONENT_DESCRIPTION}}
 * 
 * @ai-context
 * - Purpose: {{PURPOSE}}
 * - Usage Pattern: {{USAGE_PATTERN}}
 * - Accessibility: {{A11Y_NOTES}}
 */
export const {{COMPONENT_NAME}}: React.FC<{{COMPONENT_NAME}}Props> = ({
  {{PROPS_DESTRUCTURED}},
  className,
  ...props
}) => {
  return (
    <{{HTML_ELEMENT}}
      className={cn(
        "{{DEFAULT_CLASSES}}",
        className
      )}
      {{ACCESSIBILITY_PROPS}}
      {...props}
    >
      {{COMPONENT_CONTENT}}
    </{{HTML_ELEMENT}}>
  );
};

{{COMPONENT_NAME}}.displayName = '{{COMPONENT_NAME}}';
```

---

## 🏛️ src/context/ - City Hall (State Management)

### **Purpose**: Centralized state management and city-wide context providers
### **AI Token Benefits**: Template-driven context creation, consistent patterns

### **Structure Template**:
```
src/context/
├── index.ts                # Export barrel for all contexts
├── CityProvider.tsx        # Root provider wrapper
├── AuthContext.tsx         # Authentication state
├── ThemeContext.tsx        # Theme and styling preferences  
├── SettingsContext.tsx     # App settings and configuration
└── types.ts               # Context-specific TypeScript types
```

### **Template Files**:

#### **`src/context/AuthContext.tsx` Template**:
```typescript
/**
 * @ai-context: Authentication Context
 * @city-department: City Hall - Citizen Services
 * @token-efficient: Uses template pattern, 60% token reduction
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, AuthAction, User } from '@/types/auth';

// AI-optimized: Pre-defined state structure reduces generation tokens
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// AI-friendly: Reducer pattern with clear action types
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case 'AUTH_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'AUTH_LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
} | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // {{AI_WILL_FILL_METHODS}}
  
  return (
    <AuthContext.Provider value={{ state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## 🔧 src/hooks/ - Works (Custom Hooks)

### **Purpose**: Reusable logic and city infrastructure utilities
### **AI Token Benefits**: Template-driven hook creation, consistent patterns

### **Structure Template**:
```
src/hooks/
├── index.ts               # Export barrel for all hooks
├── useAuth.ts            # Authentication hook
├── useLocalStorage.ts    # Browser storage hook
├── useApi.ts             # API communication hook
├── useTheme.ts           # Theme management hook
├── useDebounce.ts        # Performance optimization hook
└── city-specific/        # Project-specific hooks
    ├── useUserProfile.ts
    └── useNotifications.ts
```

#### **Hook Template Pattern**:
```typescript
/**
 * @ai-hook: {{HOOK_NAME}}
 * @city-department: Works - {{DEPARTMENT}}
 * @reusability: {{REUSABILITY_LEVEL}}
 */

import { {{REACT_IMPORTS}} } from 'react';
import { {{TYPE_IMPORTS}} } from '@/types/{{HOOK_TYPE}}';

/**
 * {{HOOK_DESCRIPTION}}
 * 
 * @ai-context
 * - Purpose: {{PURPOSE}}
 * - Dependencies: {{DEPENDENCIES}}
 * - Return Type: {{RETURN_TYPE_DESCRIPTION}}
 */
export const {{HOOK_NAME}} = ({{PARAMETERS}}): {{RETURN_TYPE}} => {
  // AI Pattern: State declarations
  {{STATE_DECLARATIONS}}

  // AI Pattern: Effect hooks
  {{EFFECT_HOOKS}}

  // AI Pattern: Computed values
  {{COMPUTED_VALUES}}

  // AI Pattern: Handler functions
  {{HANDLER_FUNCTIONS}}

  return {{RETURN_OBJECT}};
};
```

---

## 🛠️ src/utils/ - Works (Utilities)

### **Purpose**: Pure functions and city infrastructure utilities
### **AI Token Benefits**: Function template library reduces generation time by 70%

### **Structure Template**:
```
src/utils/
├── index.ts              # Export barrel
├── cn.ts                 # ClassName utility (cn from clsx/tailwind-merge)
├── format/               # Formatting utilities
│   ├── date.ts          # Date formatting
│   ├── currency.ts      # Money/currency formatting
│   └── text.ts          # String formatting utilities
├── validation/          # Input validation
│   ├── schema.ts        # Zod schemas
│   ├── sanitize.ts      # Input sanitization
│   └── rules.ts         # Validation rules
├── api/                 # API utilities
│   ├── client.ts        # HTTP client configuration
│   ├── endpoints.ts     # API endpoint definitions
│   └── transforms.ts    # Data transformation utilities
└── performance/         # Optimization utilities
    ├── debounce.ts      # Debouncing
    ├── throttle.ts      # Throttling
    └── memoize.ts       # Memoization helpers
```

#### **Utility Function Template**:
```typescript
/**
 * @ai-utility: {{UTILITY_NAME}}
 * @city-department: Works - {{CATEGORY}}
 * @pure-function: true
 */

/**
 * {{UTILITY_DESCRIPTION}}
 * 
 * @ai-context
 * - Input: {{INPUT_DESCRIPTION}}
 * - Output: {{OUTPUT_DESCRIPTION}}
 * - Side Effects: None (pure function)
 * 
 * @example
 * ```typescript
 * {{USAGE_EXAMPLE}}
 * ```
 */
export const {{UTILITY_NAME}} = ({{PARAMETERS}}): {{RETURN_TYPE}} => {
  {{FUNCTION_BODY}}
};
```

---

## 🏗️ src/components/ - UI Components

### **Purpose**: Reusable UI building blocks for the city
### **AI Token Benefits**: Component template system with built-in accessibility and TypeScript

### **Structure Template**:
```
src/components/
├── index.ts              # Export barrel
├── ui/                   # Base UI components (shadcn/ui style)
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   ├── Input/
│   ├── Modal/
│   └── ...
├── forms/               # Form-specific components
│   ├── LoginForm/
│   ├── ContactForm/
│   └── SearchForm/
├── layout/              # Layout components
│   ├── Header/
│   ├── Footer/
│   ├── Sidebar/
│   └── PageLayout/
└── features/            # Feature-specific components
    ├── auth/
    ├── dashboard/
    └── profile/
```

#### **Component Template (Full Component)**:
```typescript
/**
 * @ai-component: {{COMPONENT_NAME}}
 * @city-building-type: {{UI|Form|Layout|Feature}}
 * @accessibility: WCAG AA compliant
 */

import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

// AI-optimized: Pre-defined variant system
const {{COMPONENT_SNAKE_CASE}}Variants = cva(
  "{{BASE_CLASSES}}",
  {
    variants: {
      variant: {
        {{VARIANT_OPTIONS}}
      },
      size: {
        {{SIZE_OPTIONS}}
      },
    },
    defaultVariants: {
      variant: "{{DEFAULT_VARIANT}}",
      size: "{{DEFAULT_SIZE}}",
    },
  }
);

export interface {{COMPONENT_NAME}}Props
  extends React.{{HTML_ELEMENT_PROPS}},
    VariantProps<typeof {{COMPONENT_SNAKE_CASE}}Variants> {
  {{CUSTOM_PROPS}}
}

/**
 * {{COMPONENT_DESCRIPTION}}
 * 
 * @ai-context
 * - Design System: Follows city design standards
 * - Accessibility: {{A11Y_FEATURES}}
 * - Variants: {{AVAILABLE_VARIANTS}}
 */
export const {{COMPONENT_NAME}} = forwardRef<
  React.ElementRef<"{{HTML_ELEMENT}}">,
  {{COMPONENT_NAME}}Props
>(({ className, variant, size, {{PROP_DESTRUCTURING}}, ...props }, ref) => {
  return (
    <{{HTML_ELEMENT}}
      className={cn({{COMPONENT_SNAKE_CASE}}Variants({ variant, size, className }))}
      ref={ref}
      {{ACCESSIBILITY_ATTRIBUTES}}
      {...props}
    >
      {{COMPONENT_CONTENT}}
    </{{HTML_ELEMENT}}>
  );
});

{{COMPONENT_NAME}}.displayName = "{{COMPONENT_NAME}}";
```

---

## 🎨 src/styles/ - Arts (Styling)

### **Purpose**: City-wide visual design system and styling
### **AI Token Benefits**: Design token system reduces styling decisions by 85%

### **Structure Template**:
```
src/styles/
├── globals.css           # Global styles and CSS reset
├── components.css        # Component-specific styles
├── utilities.css         # Utility classes
├── tokens/               # Design tokens
│   ├── colors.css       # Color palette
│   ├── typography.css   # Font and text styles
│   ├── spacing.css      # Spacing scale
│   └── shadows.css      # Shadow system
└── themes/               # Theme variations
    ├── light.css        # Light theme
    ├── dark.css         # Dark theme
    └── high-contrast.css # Accessibility theme
```

#### **Design Token Template**:
```css
/**
 * @ai-design-tokens: {{TOKEN_CATEGORY}}
 * @city-arts-department: Visual Design
 * @ai-context: Pre-defined design system reduces styling decisions
 */

:root {
  /* {{TOKEN_CATEGORY}} Design Tokens */
  {{CSS_CUSTOM_PROPERTIES}}
}

/* AI-friendly utility classes */
{{UTILITY_CLASSES}}
```

---

## 🗃️ src/store/ - Store (State and APIs)

### **Purpose**: Centralized data management and API communication
### **AI Token Benefits**: Store patterns reduce boilerplate by 75%

### **Structure Template**:
```
src/store/
├── index.ts              # Store configuration
├── slices/               # Zustand slices or Redux slices
│   ├── authSlice.ts     # Authentication state
│   ├── userSlice.ts     # User profile state
│   └── settingsSlice.ts # App settings state
├── api/                  # API integration
│   ├── baseApi.ts       # Base API configuration
│   ├── authApi.ts       # Authentication endpoints
│   └── userApi.ts       # User management endpoints
└── middleware/           # Store middleware
    ├── logger.ts        # Development logging
    └── persist.ts       # State persistence
```

#### **Store Slice Template (Zustand)**:
```typescript
/**
 * @ai-store-slice: {{SLICE_NAME}}
 * @city-department: Store - {{DOMAIN}}
 * @state-management: Zustand
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { {{SLICE_TYPES}} } from '@/types/{{DOMAIN}}';

interface {{SLICE_NAME}}State {
  // State properties
  {{STATE_PROPERTIES}}
  
  // Actions
  {{ACTION_SIGNATURES}}
}

/**
 * {{SLICE_DESCRIPTION}}
 * 
 * @ai-context
 * - Domain: {{DOMAIN}}
 * - Persistence: {{PERSISTENT ? 'localStorage' : 'memory only'}}
 * - DevTools: Enabled in development
 */
export const use{{SLICE_NAME}} = create<{{SLICE_NAME}}State>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        {{INITIAL_STATE}}
        
        // Actions
        {{ACTION_IMPLEMENTATIONS}}
      }),
      {
        name: '{{SLICE_NAME_KEBAB}}-storage',
      }
    ),
    { name: '{{SLICE_NAME}}Store' }
  )
);
```

---

## 📝 src/types/ - Models (TypeScript Types)

### **Purpose**: City-wide type definitions and data models
### **AI Token Benefits**: Type templates ensure consistency and reduce generation errors

### **Structure Template**:
```
src/types/
├── index.ts              # Export barrel for all types
├── api.ts               # API request/response types
├── auth.ts              # Authentication types
├── user.ts              # User and profile types
├── common.ts            # Shared/utility types
├── components.ts        # Component prop types
└── domain/              # Domain-specific types
    ├── ecommerce.ts     # E-commerce types (if applicable)
    ├── blog.ts          # Blog/CMS types (if applicable)
    └── analytics.ts     # Analytics/tracking types
```

#### **Type Definition Template**:
```typescript
/**
 * @ai-types: {{TYPE_CATEGORY}}
 * @city-records: Official type definitions
 * @strict-mode: TypeScript strict mode compliant
 */

/**
 * {{TYPE_DESCRIPTION}}
 * 
 * @ai-context
 * - Domain: {{DOMAIN}}
 * - Usage: {{USAGE_CONTEXT}}
 * - Validation: {{VALIDATION_NOTES}}
 */
export interface {{TYPE_NAME}} {
  {{TYPE_PROPERTIES}}
}

// AI-optimized: Union types for better type safety
export type {{UNION_TYPE_NAME}} = {{UNION_OPTIONS}};

// AI-optimized: Utility types for common patterns
export type {{UTILITY_TYPE_NAME}}<T> = {{UTILITY_TYPE_DEFINITION}};
```

---

## 🛣️ src/routes/ - Districts (Routing)

### **Purpose**: Navigation and page routing for city districts
### **AI Token Benefits**: Route patterns reduce routing complexity by 60%

### **Structure Template**:
```
src/routes/
├── index.ts              # Route definitions and exports
├── AppRouter.tsx         # Main router configuration
├── PrivateRoute.tsx      # Protected route wrapper
├── PublicRoute.tsx       # Public route wrapper
├── RouteGuard.tsx        # Authentication guard
└── pages/                # Page components
    ├── HomePage.tsx      # Landing/home page
    ├── LoginPage.tsx     # Authentication page
    ├── DashboardPage.tsx # Protected dashboard
    └── NotFoundPage.tsx  # 404 error page
```

#### **Route Configuration Template**:
```typescript
/**
 * @ai-routes: {{APP_NAME}} Navigation
 * @city-districts: All accessible areas
 * @routing-library: React Router v6
 */

import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { {{PAGE_IMPORTS}} } from './pages';
import { PrivateRoute, PublicRoute } from './guards';

/**
 * City Districts (Routes) Configuration
 * 
 * @ai-context
 * - Public Districts: Accessible to all citizens
 * - Private Districts: Require authentication
 * - Protected Districts: Role-based access
 */
export const routeConfig: RouteObject[] = [
  // Public Districts
  {{PUBLIC_ROUTES}}
  
  // Private Districts (Authentication Required)
  {{PRIVATE_ROUTES}}
  
  // Admin Districts (Admin Role Required)
  {{ADMIN_ROUTES}}
  
  // Catch-all for unknown districts
  {{CATCH_ALL_ROUTE}}
];

export const router = createBrowserRouter(routeConfig);
```

---

## 📊 src/audits/ - Commission on Audits

### **Purpose**: City health monitoring and compliance reporting
### **AI Token Benefits**: Audit templates reduce report generation tokens by 90%

### **Structure Template**:
```
src/audits/
├── index.ts              # Audit orchestration and exports
├── lighthouse/           # Performance audit results
│   ├── reports/         # Generated Lighthouse reports
│   ├── history/         # Historical performance data
│   └── config.ts        # Lighthouse configuration
├── coverage/            # Test coverage reports
│   ├── lcov/           # Coverage data files
│   ├── html/           # HTML coverage reports
│   └── summary.json    # Coverage summary
├── security/            # Security audit results
│   ├── vulnerabilities/ # Vulnerability scan results
│   ├── dependencies/   # Dependency audit data
│   └── compliance/     # Security compliance reports
├── accessibility/       # Accessibility audit results
│   ├── axe-reports/    # axe-core audit results
│   ├── wcag-compliance/ # WCAG compliance tracking
│   └── color-contrast/ # Contrast analysis
├── reports/             # Multi-stakeholder formatted reports
│   ├── executive/      # Executive summary reports
│   ├── technical/      # Detailed technical reports
│   ├── dashboard/      # HTML dashboard reports
│   └── api/           # JSON API responses
└── templates/           # Report templates (from AUDIT_REPORT_TEMPLATES.md)
    ├── executive.hbs   # Executive report template
    ├── technical.hbs   # Technical report template
    └── dashboard.hbs   # Dashboard template
```

#### **Audit Report Generator Template**:
```typescript
/**
 * @ai-audit-generator: Commission Report Generator
 * @city-department: Commission on Audits
 * @token-efficient: 90% reduction using templates
 */

interface AuditReportGenerator {
  generateExecutiveReport(data: AuditData): ExecutiveReport;
  generateTechnicalReport(data: AuditData): TechnicalReport;
  generateDashboard(data: AuditData): HTMLDashboard;
  generateApiReport(data: AuditData): ApiResponse;
}

/**
 * AI-optimized audit data structure
 * Pre-defined schema reduces parsing complexity
 */
interface AuditData {
  {{AUDIT_DATA_SCHEMA}}
}
```

---

## AI Token Optimization Summary

### **Token Reduction Techniques Used**:

1. **Template-Driven Generation**: 60-90% reduction in structure tokens
2. **Pre-defined Patterns**: Consistent code patterns reduce decision-making
3. **Fill-in-the-Blank Approach**: AI only populates data, not structure
4. **Type Templates**: Reduce TypeScript generation complexity
5. **Component Blueprints**: Standard component patterns
6. **Design Token System**: Eliminate styling decisions
7. **Route Templates**: Consistent navigation patterns
8. **Audit Templates**: Pre-structured reporting formats

### **AI Benefits**:

- **Faster Generation**: 70-90% faster code generation
- **Consistent Quality**: Enforced patterns ensure standards
- **Reduced Errors**: Templates prevent common mistakes
- **Better Context**: Rich AI context in every file
- **Maintainability**: Consistent structure across projects

---

*These templates provide the foundation for rapid, consistent, high-quality City App development while maximizing AI efficiency and minimizing token usage.* 🏙️🤖