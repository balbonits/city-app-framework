# City App Framework: MVP Questionnaire System

## Overview

The City App Framework MVP uses a streamlined questionnaire approach that balances simplicity with power. Drawing inspiration from `create-next-app` and `create-vite`, we ask 8 focused questions to scaffold projects quickly while providing comprehensive Claude Code integration for AI-driven development.

## MVP Philosophy: Vite/Next.js Simplicity + AI Context Excellence

Based on research into how vibe coders work with AI tools, our MVP combines proven CLI patterns with the AI context setup that developers actually need.

## MVP Approach: Speed + Quality

### **Why 8 Questions Instead of 25?**
- **Next.js/Vite Success**: Proven 6-8 question pattern works
- **Vibe Coder Needs**: Quick setup, immediate productivity
- **AI Context Focus**: Rich context more valuable than extensive customization
- **Smart Defaults**: Sensible choices reduce decision fatigue

### **MVP Benefits**:
- **<2 Minute Setup**: From command to working project
- **AI-Ready**: Comprehensive Claude Code context from day one
- **Quality Defaults**: TypeScript strict mode, testing, accessibility
- **Extensible**: Advanced customization through future questionnaire mode

## MVP Questionnaire: 8 Focused Questions

### **Core Questions (Next.js/Vite Pattern)**

1. **Project Name**: `my-app` with npm name validation
2. **TypeScript**: `Yes/No` (default: Yes)
3. **Framework**: `React` (MVP scope)
4. **State Management**: `Zustand/Redux Toolkit/Context API` (default: Zustand)
5. **Styling**: `Tailwind CSS` (default: Yes)
6. **AI Context**: `Claude Code setup` (default: Yes, recommended)
7. **Commission on Audits**: `Quality monitoring` (default: Yes)
8. **Template**: `Minimal/Dashboard/E-commerce/Blog` (default: Minimal)

### **Smart Defaults Philosophy**
- **TypeScript**: Strict mode enabled (better AI validation)
- **Zustand**: Lightweight, TypeScript-first state management
- **Tailwind**: Utility classes perfect for AI generation
- **Testing**: Vitest + React Testing Library
- **Build Tool**: Vite (fast HMR for AI development)
- **Quality Gates**: ESLint, Prettier, accessibility checks

## State Management Integration

### **Q4: State Management Choice**
```typescript
// CLI Prompt
? Which state management would you like? 
  ● Zustand (Lightweight, TypeScript-first, simple API)
  ○ Redux Toolkit (Predictable, DevTools, time-travel debugging)  
  ○ Context API (Built-in React, component tree focused)

// Generated Structure for Zustand:
src/
├── store/
│   ├── index.ts           # Main store configuration
│   ├── auth.ts            # Authentication state
│   ├── ui.ts              # UI state (theme, modals)
│   └── types.ts           # Store type definitions

// Generated for Redux Toolkit:
src/
├── store/
│   ├── index.ts           # Store configuration
│   ├── slices/
│   │   ├── authSlice.ts   # Authentication slice
│   │   └── uiSlice.ts     # UI state slice
│   └── types.ts           # Redux type definitions

// Generated for Context API:
src/
├── context/
│   ├── AuthContext.tsx    # Authentication context
│   ├── UIContext.tsx      # UI state context
│   └── index.ts           # Context exports
```

### **Template Integration**
State management templates are automatically customized based on:
- **Template Choice**: Dashboard includes auth state, E-commerce adds cart state
- **Persistence**: LocalStorage integration for user preferences
- **DevTools**: Redux DevTools or Zustand DevTools based on choice

## MVP Generation Process

### **Input: 8 Focused Questions**
User completes streamlined questionnaire in <2 minutes, following Next.js/Vite patterns.

### **Processing: Smart Template Selection**
The framework uses answers to:
- Select base template (Minimal, Dashboard, E-commerce, Blog)
- Configure state management layer (Zustand, Redux, Context)
- Set up styling system (Tailwind CSS configuration)
- Generate Claude Code context files
- Configure quality gates and auditing

### **Output: AI-Ready City App**
Generated project includes:

1. **Optimal Architecture Blueprint**
   - Complete technical architecture documentation
   - Decision rationale and trade-offs explained
   - Integration patterns and best practices

2. **Custom Folder Structure**
   - City structure adapted to project needs
   - State management organized per user preferences
   - Feature organization matching project domain

3. **Configured Templates & Patterns**
   - Components optimized for chosen tech stack
   - State management patterns pre-configured
   - API and routing templates customized
   - Testing setup matching strategy preferences

4. **Development Tool Configuration**
   - All dev tools pre-configured and integrated
   - Scripts and workflows set up
   - Quality gates and automation configured
   - CI/CD pipeline templates prepared

5. **Rich Documentation & Context**
   - Project-specific documentation generated
   - AI context files customized for project
   - Architecture decisions documented
   - Onboarding guides for team members

6. **AI Collaboration Setup**
   - Context optimized for ongoing AI assistance
   - Project-specific AI prompts and workflows
   - Commission on Audits configured for project needs
   - Template system ready for future features

## CLI Integration Workflow

### **Project Creation Flow (MVP)**
```bash
npx create-city-app my-project

? What is your project named? › my-app
? Would you like to use TypeScript? › Yes
? Which framework would you like to use? › React
? Which state management would you like? › Zustand
? Would you like to use Tailwind CSS? › Yes  
? Would you like AI context setup? (recommended) › Yes
? Would you like Commission on Audits? › Yes
? Choose a starting template:
  › Minimal (blank slate)
  › Dashboard (admin panel)
  › E-commerce (shop)
  › Blog (CMS)
```

### **MVP Experience Features**
- **Fast Flow**: 8 questions, 2 minutes total
- **Smart Defaults**: `--yes` flag for all defaults
- **Validation**: NPM name validation, dependency checks
- **Progress Indicators**: Spinners and progress feedback
- **Claude Integration**: Immediate AI context setup

### **Generation & Quality Assurance**
- **Template Processing**: Multi-layer template inheritance
- **Context Generation**: Rich CLAUDE.md and .claude/ files
- **Quality Gates**: TypeScript strict mode, ESLint, Prettier
- **Dependency Installation**: Automatic npm/yarn installation
- **Git Initialization**: Ready for version control

## Benefits for Different User Types

### **Solo Developers**
- Get enterprise-level architecture without enterprise complexity
- AI collaboration helps make informed technical decisions
- Generated structure grows with project without major refactoring
- Commission on Audits provides ongoing quality assurance

### **Small Teams**
- Standardized architecture reduces onboarding time
- Documented decisions provide context for team members
- Consistent patterns across projects
- Quality gates ensure maintainability

### **Learning Developers**
- Educational experience learning about architectural options
- Understand trade-offs between different approaches
- Generated project serves as learning reference
- AI collaboration provides mentorship-like guidance

### **Experienced Developers**
- Rapid scaffolding for well-understood requirements
- Customize and override any generated patterns
- Focus on business logic rather than boilerplate setup
- Export questionnaire answers to replicate architecture

## Integration with Existing Framework Features

### **City Structure Templates**
Questionnaire answers drive template selection and customization from our comprehensive template library.

### **Commission on Audits**
Audit configuration automatically matches project requirements:
- Performance budgets based on platform targets
- Security requirements based on compliance needs
- Accessibility standards based on user requirements
- Quality gates based on team size and experience

### **AI Citizens System**
AI roles and workflows configured based on project needs:
- Development team size influences AI assistance level
- Project complexity determines AI citizen specializations
- Testing preferences configure QA Director behavior
- Performance requirements tune Performance Analyst

### **Multi-Platform Support**
Platform choices drive:
- Template selection (web vs mobile vs hybrid)
- Build tool configuration
- Testing strategy adaptation
- Deployment pipeline setup

## Extensibility & Evolution

### **Community Templates**
- Users can share questionnaire answer templates
- Popular answer combinations become preset options
- Community can contribute new questions and patterns

### **Framework Updates**
- New questions can be added without breaking existing projects
- Answer validation ensures forward compatibility
- Migration guides for architectural changes

### **Project Evolution**
- Re-run questionnaire to adapt existing projects
- Generate migration guides for architectural changes
- Validate current project against new best practices

## Example: Complete State Management Decision Tree

Based on questionnaire answers, the framework might generate:

```typescript
// For a moderate complexity React app with Zustand preference
// Generated in src/store/zustand/

// User answered: Moderate complexity, TypeScript-first, persistence needed
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        login: async (credentials) => {
          // Generated login logic based on auth strategy answers
        },
        logout: () => {
          // Generated logout logic
        }
      }),
      { name: 'auth-storage' } // Persistence based on Q9 answers
    ),
    { name: 'AuthStore' }
  )
);

// Plus corresponding types, hooks, and integration patterns
// All customized based on questionnaire responses
```

## MVP Success Metrics

### **User Experience**
- **Setup Time**: <2 minutes from command to working project
- **First Success**: Project builds and runs on first try
- **AI Productivity**: Claude Code immediately productive with context
- **Learning Curve**: Minimal - follows Next.js/Vite patterns

### **Framework Quality**
- **Generation Success**: 100% working projects on first generation
- **Code Quality**: All generated code passes linting and type checking
- **Template Adoption**: Usage distribution across templates
- **Customization**: How often users modify generated structure

### **AI Integration**
- **Context Effectiveness**: Claude Code understanding and productivity
- **Development Speed**: Time from idea to working feature
- **Quality Maintenance**: AI-assisted quality gates and auditing

## Future Evolution: Advanced Questionnaire Mode

### **Post-MVP: Comprehensive Mode**
Once MVP is validated, we can add an advanced mode with:
- **Comprehensive Questionnaire**: 25+ questions for complex projects
- **Architecture Planning**: Deep customization options
- **AI Collaboration**: Extended AI planning discussions
- **Custom Templates**: User-defined project structures

### **CLI Integration**
```bash
npx create-city-app my-project --mode=advanced

? Would you like to complete the comprehensive architecture questionnaire?
  ● Yes (25+ questions, full customization)
  ○ Use quick mode (8 questions, smart defaults)
```

This allows us to:
1. **Validate MVP**: Simple, fast, AI-focused approach
2. **Gather Feedback**: Understanding user needs and pain points  
3. **Evolve Gradually**: Add complexity only where it adds value
4. **Maintain Focus**: Keep the core experience simple and effective

---

*The questionnaire system transforms the City App Framework from an opinionated tool into an adaptive partner that builds exactly what each project needs while maintaining quality, consistency, and best practices.* 🏙️📋✨