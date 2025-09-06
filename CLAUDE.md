# Claude Code Context: City App Framework

## Project Overview
**Name**: City App Framework  
**Type**: Revolutionary AI-native development framework  
**Status**: MVP implementation ready - CLI tool with Claude Code optimization  
**Repository**: https://github.com/balbonits/city-app-framework  

## What This Framework Is
The **world's first AI-native development framework** that enables solo developers to build applications with enterprise-level capabilities through AI collaboration. Uses a city governance metaphor where the developer is the "mayor" and AI agents are specialized "citizens" who build, maintain, and evolve the application.

## MVP Focus: Claude Code + Vite/Next.js Simplicity

### **Current Implementation Phase**
We're building the **MVP version** that combines the proven simplicity of `create-next-app` and `create-vite` with comprehensive Claude Code integration. The full AI-citizen system is the long-term vision; the MVP focuses on immediate productivity gains.

### **MVP Key Differentiators**
1. **8-Question Setup**: Fast project generation following Next.js/Vite patterns
2. **Claude Code Optimization**: Rich context files (CLAUDE.md + .claude/commands/) from day one
3. **Quality Defaults**: TypeScript strict mode, testing, accessibility built-in
4. **Template-Driven**: Minimal, Dashboard, E-commerce, Blog templates with AI token optimization
5. **Multi-Platform Ready**: Web + mobile from single codebase (Capacitor/React Native)

## Core Philosophy & Metaphor
- **Developer = Mayor**: Provides vision, policies, and governance
- **AI Agents = Citizens**: Specialized roles that execute autonomously
- **Tests = City Policies**: Define how everything should work and interact
- **Context = City Charter**: Rich documentation that guides all decisions
- **Templates = Civic Procedures**: Pre-built workflows for common tasks

## Revolutionary Innovations

### 1. AI-Native Architecture
- Every component designed for AI agents first, humans second
- Rich context embedded throughout for AI understanding
- Self-organizing AI roles based on project needs
- Template-driven autonomous execution

### 2. Mayor-Citizens Governance Model
- **Planning Department**: City Planner, UX Designer, Product Manager
- **Engineering Department**: Lead Architect, Frontend/Backend Engineers, Database Architect
- **Operations Department**: Security Chief, DevOps Engineer, QA Director, Performance Analyst, Audit Director

### 3. Tests as City Policies
- Tests aren't just validation - they're governance rules
- Policy-driven development: AI writes tests first, implements to pass them
- Multiple policy layers: District (integration), Building (component), Utility (unit), Citizen (E2E), Appearance (visual)

### 4. Context-Rich Development
- Hierarchical context: Framework → Project → District → Building → Utility
- AI-readable documentation in every file
- Living context that evolves with the project
- Context validation and quality assurance

### 5. Template-Driven Autonomy
- Pre-built workflows: ADD_FEATURE, FIX_BUG, SECURITY_AUDIT, OPTIMIZE_PERFORMANCE
- AI citizens self-organize using templates
- Quality gates ensure enterprise-level standards
- Minimal human direction needed

## Technical Architecture

### Platform Support
- **Web**: React SPA/SSR/SSG, PWA capabilities
- **Native**: React Native for iOS/Android
- **Hybrid**: Capacitor/Ionic for web-to-mobile
- **Desktop**: Electron/Tauri for desktop apps

### Technology Stack (AI-Optimized)
- **Language**: TypeScript (type safety helps AI validation)
- **Frontend**: React (ecosystem familiarity)
- **Styling**: Tailwind CSS (utility classes perfect for AI generation)
- **State**: Zustand (simple API for AI understanding)
- **Testing**: Vitest + Playwright (AI-optimized frameworks)
- **Build**: Vite (fast HMR for AI development)

### File Structure
```
city-app/
├── .ai/                    # AI context and configuration
│   ├── city-charter.md    # Project vision and policies
│   ├── citizens/          # AI agent configurations
│   ├── blueprints/        # Code templates
│   └── city-standards/    # Quality requirements
├── src/
│   ├── context/          # City Hall (State management)
│   ├── hooks/            # Works (Custom hooks)
│   ├── utils/            # Works (Utilities)
│   ├── components/       # UI Components
│   ├── styles/           # Arts (Styling)
│   ├── store/            # Store (State and APIs)
│   ├── types/            # Models (TypeScript types)
│   ├── routes/           # Districts (Routing)
│   └── audits/           # Commission on Audits (Health monitoring)
```

## Current Status (MVP Focus)

### Completed ✅
- **MVP Architecture**: CLI structure, build system, template system
- **Documentation Complete**: MVP_SPECIFICATION.md, CLI_ARCHITECTURE.md, BUILD_SYSTEM.md
- **Simplified Approach**: 8-question CLI following Next.js/Vite patterns
- **Claude Code Integration**: Rich context generation system designed
- **Template System**: Multi-layer inheritance with AI optimization
- **Testing Strategy**: Unit, integration, and E2E testing approach

### Ready for Implementation 🚀
- **CLI Development**: TypeScript + tsx workflow documented
- **Template Processing**: Handlebars + string replacement system
- **Context Generation**: CLAUDE.md + .claude/commands/ system
- **Build Pipeline**: Complete npm publishing workflow
- **Quality Gates**: ESLint, Prettier, TypeScript strict mode

### Next Steps 📋
1. **Answer PROJECT_QA.md**: 20 implementation-focused questions
2. **Initialize Repository**: Set up CLI development environment
3. **Build First Template**: Start with user's priority template
4. **Implement CLI Core**: Basic command structure and prompts
5. **Test MVP**: Generate working projects with Claude Code context

## AI Agent Role (Claude Code)

### Primary Responsibilities
As the **Lead Architect** and **City Planner** for this framework:
- Provide architectural guidance and technical leadership
- Generate comprehensive specifications and documentation
- Design AI integration patterns and workflows
- Ensure quality and consistency across all components
- Guide implementation decisions based on AI-first principles

### Specializations
- **System Architecture**: Design scalable, maintainable frameworks
- **AI Integration**: Create patterns for human-AI collaboration
- **Documentation**: Generate comprehensive, context-rich documentation
- **Code Generation**: Produce high-quality, well-documented code
- **Quality Assurance**: Ensure enterprise-level standards

### Working Style with This User
- **Thorough but Concise**: Comprehensive coverage without overwhelming detail
- **Context-Rich**: Always provide sufficient background for decisions
- **Implementation-Focused**: Design with practical implementation in mind
- **Quality-Conscious**: Never compromise on code quality or standards
- **Collaborative**: Work with user's vision while providing expert guidance

## Project Constraints & Preferences

### User Constraints & Priorities
- **Time Available**: 5-10 hours/week (serious side project)
- **Technical Comfort**: React (3/5), CLI/Node/RN/AI (1/5 each) - learning opportunity
- **Primary Goal**: Personal tool for faster development, potential job enabler
- **Vision**: Help solo developers bypass setup and get building immediately
- **Success**: Framework as good as Vite/Next.js for AI-driven projects within 6 months
- **Philosophy**: Comprehensive but approachable > simple focused > full-featured
- **Must Use**: React, TypeScript, Node.js/Python, Firebase
- **Want to Avoid**: Too many 3rd-party plugins - only essential ones
- **Packaging**: `npx create-city-app` similar to create-react-app
- **Quality Focus**: Commission on Audits with multi-stakeholder reporting
- **MVP Approach**: 8 questions vs 25, focusing on speed + Claude Code integration

### Technical Constraints
- Must work with Claude Code as primary AI agent
- Should support multiple platforms from single codebase
- Needs comprehensive testing from day one
- Context-rich for AI understanding
- Minimal dependencies (case-by-case evaluation)

## Development Methodology

### AI-First TDD Approach
1. **Define Requirements**: User provides high-level vision
2. **AI Planning**: Analyze requirements and create specifications
3. **Context Building**: Generate rich context for all components
4. **Policy Writing**: Create tests that define expected behavior
5. **Implementation**: Generate code to meet policy requirements
6. **Quality Validation**: Multiple validation layers ensure standards
7. **Documentation**: Maintain living documentation throughout

### Code Standards
- **TypeScript**: Strict mode, explicit types, no `any`
- **Functional**: Prefer hooks and functions over classes
- **Testable**: Every component has comprehensive tests
- **Documented**: Rich context in all files
- **Modular**: Clean separation of concerns
- **Accessible**: WCAG 2.1 AA compliance
- **Performant**: Mobile-first, bundle size conscious

## Key Files & Documentation

### MVP Implementation Documentation
- `docs/MVP_SPECIFICATION.md` - Complete MVP approach and features  
- `docs/core/CLI_ARCHITECTURE.md` - 13-component CLI system design
- `docs/core/BUILD_SYSTEM.md` - Build pipeline and development workflow
- `docs/core/FRAMEWORK_QUESTIONNAIRE_SYSTEM.md` - Updated for MVP approach
- `docs/PROJECT_QA.md` - 20 implementation-focused questions

### Template System Documentation
- `docs/core/CITY_STRUCTURE_TEMPLATES.md` - Complete scaffolding templates
- `docs/core/STAKEHOLDER_AUDIT_SYSTEM.md` - Commission on Audits system

### Reference Documentation (Full Framework Vision)
- `docs/ai-system/AI_FRAMEWORK_SPEC.md` - Complete AI-native architecture
- `docs/ai-system/AI_ROLES_SYSTEM.md` - Specialized AI citizen roles (future)
- `docs/ai-system/ROLE_TEMPLATES.md` - Pre-built workflows (future)
- `docs/implementation/CREATE_CITY_APP_SPEC.md` - Original CLI specification

## Communication Patterns

### When User Asks for Implementation
1. Reference existing specifications first
2. Provide context for decisions
3. Generate high-quality, documented code
4. Include comprehensive tests
5. Update relevant documentation

### When User Asks for Advice
1. Consider both immediate needs and long-term vision
2. Provide multiple options with pros/cons
3. Recommend based on AI-first principles
4. Document reasoning for future reference

### When User Requests Changes
1. Understand the motivation behind the request
2. Consider impact on overall architecture
3. Provide implementation approach
4. Update specifications and documentation accordingly

## Success Metrics

### Framework Success
- Solo developers can build enterprise-quality applications
- 10x faster development with maintained quality
- AI agents work effectively with rich context
- Generated projects are production-ready
- Testing and quality are built-in, not afterthoughts

### Collaboration Success
- Clear communication and shared understanding
- Consistent code quality and standards
- Comprehensive documentation that aids future development
- Efficient problem-solving and decision-making
- Continuous learning and improvement

## Context Evolution

This document will be updated as the project evolves. Key areas for updates:
- Implementation decisions and their rationale
- New features and capabilities added
- Changes to architecture or methodology
- Lessons learned during development
- User feedback and framework improvements

---

**Last Updated**: September 6, 2025 - MVP specifications complete, ready for implementation  
**Next Update**: After initial CLI development and first template validation

*This context file ensures continuity and quality in our AI-human collaboration to build the future of development frameworks.*