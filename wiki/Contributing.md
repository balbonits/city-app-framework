# Contributing to City App Framework

Welcome! We're excited to have you contribute to the world's first AI-native development framework. This guide will help you get started.

## 🎯 Ways to Contribute

### 1. Framework Core
- **CLI improvements**: Better prompts, error handling, performance
- **Template system**: New templates, template improvements
- **AI integration**: Enhanced Claude Code context, workflow commands
- **Documentation**: Guides, examples, API documentation

### 2. Templates
- **New templates**: Dashboard, E-commerce, Portfolio, etc.
- **Template enhancements**: Better components, patterns, styling
- **State management**: New state management integrations
- **UI frameworks**: Additional styling options

### 3. Community
- **Examples**: Real-world project showcases
- **Tutorials**: Step-by-step guides, video content
- **Bug reports**: Issues, edge cases, improvement suggestions
- **Discussions**: Best practices, use cases, feedback

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **Git**: For version control
- **TypeScript**: Familiarity with TypeScript development
- **React**: Understanding of modern React patterns

### Development Setup

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/city-app-framework
cd city-app-framework

# 3. Install dependencies
npm install

# 4. Set up CLI development
cd ../  # Go back to parent directory
git clone https://github.com/YOUR-USERNAME/create-city-app
cd create-city-app
npm install
npm run build
npm link

# 5. Test the development setup
create-city-app test-project --template=blog --yes
cd test-project
npm install
npm run dev
```

## 🏗️ Project Structure

### Framework Repository
```
city-app-framework/
├── docs/                 # Framework documentation
│   ├── MVP_SPECIFICATION.md
│   ├── CLI_ARCHITECTURE.md
│   └── core/
├── wiki/                 # GitHub wiki content
├── examples/            # Example projects
└── CLAUDE.md           # AI context for framework development
```

### CLI Repository
```
create-city-app/
├── src/                 # CLI source code
│   ├── index.ts        # Main entry point
│   ├── generator.ts    # Project generation
│   └── ...
├── templates/          # Template files
│   ├── base/          # Base template
│   ├── blog/          # Blog template
│   └── minimal/       # Minimal template
├── scripts/           # Build scripts
└── dist/             # Compiled output
```

## 🎨 Contributing to Templates

### Creating a New Template

1. **Plan the Template**
   ```markdown
   # Template Planning
   - **Name**: Dashboard Template
   - **Purpose**: Admin panel with charts and tables
   - **Tech Stack**: React + Redux + Material UI + Chart.js
   - **Key Features**: Analytics, user management, settings
   ```

2. **Create Template Structure**
   ```bash
   # In create-city-app repository
   mkdir templates/dashboard
   cd templates/dashboard
   
   # Create template files
   mkdir -p components pages store types utils
   ```

3. **Implement Components**
   ```typescript
   // templates/dashboard/components/Dashboard.tsx
   import React from 'react';
   import { Grid, Paper, Typography } from '@mui/material';
   import AnalyticsWidget from './AnalyticsWidget';
   import UserTable from './UserTable';
   
   const Dashboard: React.FC = () => {
     return (
       <Grid container spacing={3}>
         <Grid item xs={12} md={8}>
           <Paper sx={{ p: 2 }}>
             <AnalyticsWidget />
           </Paper>
         </Grid>
         <Grid item xs={12} md={4}>
           <Paper sx={{ p: 2 }}>
             <Typography variant="h6">Recent Users</Typography>
             <UserTable />
           </Paper>
         </Grid>
       </Grid>
     );
   };
   
   export default Dashboard;
   ```

4. **Add Generation Logic**
   ```typescript
   // In src/generator.ts
   async function generateDashboardTemplate(targetDir: string, config: TemplateConfig) {
     // Generate dashboard-specific components
     await generateDashboardComponents(targetDir, config);
     
     // Generate analytics store
     await generateAnalyticsStore(targetDir);
     
     // Generate chart configurations
     await generateChartConfigs(targetDir);
   }
   ```

5. **Update CLI Options**
   ```typescript
   // In src/index.ts
   interface ProjectOptions {
     template: 'blog' | 'minimal' | 'dashboard';
     // ... other options
   }
   
   // Update prompts
   const templateChoices = [
     { title: 'Blog/CMS (Redux + Material UI)', value: 'blog' },
     { title: 'Minimal (Basic setup)', value: 'minimal' },
     { title: 'Dashboard (Admin panel)', value: 'dashboard' }
   ];
   ```

### Template Guidelines

#### Code Quality
- **TypeScript**: Use strict typing throughout
- **Components**: Functional components with hooks
- **State Management**: Follow Redux Toolkit patterns
- **Styling**: Consistent Material UI usage
- **Testing**: Include test examples

#### AI Optimization
- **Rich Context**: Comprehensive CLAUDE.md content
- **Workflow Commands**: Template-specific .claude/commands/
- **Clear Structure**: Self-documenting code organization
- **Anti-Overengineering**: Built-in complexity prevention

#### Example Template Checklist
- [ ] All components have TypeScript interfaces
- [ ] Redux store properly configured
- [ ] Material UI theme integration
- [ ] Responsive design implementation
- [ ] CLAUDE.md with template-specific context
- [ ] .claude/commands/ with workflow guides
- [ ] Test examples for key components
- [ ] README with template-specific instructions

## 🧪 Testing Contributions

### CLI Testing
```bash
# Test CLI generation
npm run test:cli

# Test specific template
npm run build
create-city-app test-dashboard --template=dashboard --yes
cd test-dashboard
npm install
npm run build
npm test
```

### Generated Project Testing
```bash
# In generated project
npm run dev        # Should start without errors
npm run build      # Should build successfully
npm test          # Should pass all tests
npm run lint      # Should pass linting
npm run type-check # Should pass TypeScript checks
```

### AI Context Testing
```bash
# Test AI setup
npm run ai:start   # Should provide optimal prompt
npm run ai:context # Should show context status
```

## 📝 Code Standards

### TypeScript
```typescript
// ✅ Good: Explicit types, clear interfaces
interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  published: boolean;
}

const createPost = (post: Omit<BlogPost, 'id' | 'createdAt'>): BlogPost => {
  return {
    ...post,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
};

// ❌ Avoid: Any types, unclear interfaces
const createPost = (post: any) => {
  // Implementation
};
```

### React Components
```typescript
// ✅ Good: Functional components with proper typing
interface PostCardProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{post.title}</Typography>
        <Typography variant="body2">{post.content}</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => onEdit(post)}>Edit</Button>
        <Button onClick={() => onDelete(post.id)}>Delete</Button>
      </CardActions>
    </Card>
  );
};

// ❌ Avoid: Class components, poor prop typing
class PostCard extends React.Component<any> {
  // Implementation
}
```

### File Organization
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   └── feature/        # Feature-specific components
├── pages/              # Route components
├── store/              # State management
│   └── slices/        # Redux slices
├── hooks/             # Custom hooks
├── utils/             # Helper functions
└── types/             # Type definitions
```

## 🔍 Code Review Process

### Pull Request Guidelines

1. **Clear Description**
   ```markdown
   ## What This PR Does
   Adds Dashboard template with analytics widgets and user management
   
   ## Changes Made
   - Created dashboard template components
   - Added analytics Redux slice
   - Integrated Chart.js for data visualization
   - Added responsive layout for mobile
   
   ## Testing
   - [ ] Generated project builds successfully
   - [ ] All tests pass
   - [ ] AI context provides good guidance
   - [ ] Mobile responsive design works
   ```

2. **Small, Focused Changes**
   - One feature per PR
   - Maximum 400 lines changed
   - Clear commit messages
   - No unrelated changes

3. **Quality Checklist**
   - [ ] TypeScript strict mode passes
   - [ ] ESLint passes
   - [ ] Tests included for new features
   - [ ] Documentation updated
   - [ ] AI context updated if needed

### Review Process
1. **Automated Checks**: CI runs tests, linting, type checking
2. **Code Review**: Maintainer reviews code quality and architecture
3. **Testing**: Manual testing of generated projects
4. **AI Context Review**: Ensure AI optimization is maintained
5. **Merge**: Approved PRs merged to main branch

## 🏷️ Versioning

### Semantic Versioning
- **Major** (1.0.0): Breaking changes, new templates
- **Minor** (0.1.0): New features, template improvements
- **Patch** (0.0.1): Bug fixes, documentation updates

### Release Process
1. **Feature Development**: Work in feature branches
2. **Testing**: Comprehensive testing of new features
3. **Documentation**: Update wiki and README
4. **Release Notes**: Detailed changelog
5. **NPM Publishing**: Updated CLI package

## 🌟 Recognition

### Contributor Recognition
- **Contributors**: Listed in README and documentation
- **Major Contributors**: Special recognition in releases
- **Template Creators**: Attribution in template documentation
- **Community Heroes**: Recognition for helping others

### Contribution Types
- 💻 **Code**: Framework, CLI, templates
- 📖 **Documentation**: Guides, wiki, examples
- 🐛 **Bug Reports**: Issues, edge cases
- 💡 **Ideas**: Feature suggestions, improvements
- 🤝 **Support**: Helping other contributors

## 🎉 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: Questions, showcase, general discussion
- **Discord** (planned): Real-time chat with contributors
- **Email**: Direct contact for sensitive issues

### Mentorship
- **New Contributors**: Paired with experienced contributors
- **Template Creation**: Guidance on creating new templates
- **AI Integration**: Help with Claude Code optimization
- **Code Review**: Learning through review process

## 📚 Resources

### Learning Materials
- **React Documentation**: https://react.dev
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Redux Toolkit**: https://redux-toolkit.js.org/
- **Material UI**: https://mui.com/
- **Vite**: https://vitejs.dev/

### Framework Resources
- **Architecture Guide**: [[Architecture]]
- **Template System**: [[Template System]]
- **AI Integration**: [[Claude Code Setup]]
- **Examples**: See `/examples` directory

---

*Thank you for contributing to the future of AI-native development! Together we're building tools that help developers create amazing applications with AI assistance.* 🚀✨