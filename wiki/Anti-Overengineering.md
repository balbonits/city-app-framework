# Anti-Overengineering Guidelines

The City App Framework includes explicit guidelines to prevent AI and developers from overcomplicating solutions. This document outlines the core principles that keep development focused and efficient.

## 🛑 The Overengineering Problem

### Common AI Overengineering Patterns
- Adding features not explicitly requested
- Creating abstractions before seeing repeated patterns
- Suggesting "improvements" without being asked
- Building generic solutions for specific problems
- Adding configuration options "for flexibility"
- Refactoring working code unnecessarily

### Impact on Projects
- **Increased Complexity**: Harder to understand and maintain
- **Longer Development**: Time spent on unnecessary features
- **Technical Debt**: Premature abstractions become burdens
- **Decision Paralysis**: Too many options confuse users
- **Maintenance Overhead**: More code means more bugs

## ✅ Anti-Overengineering Principles

### 1. Build Exactly What's Asked For
```typescript
// ❌ Overengineered: Generic form builder
interface FormBuilder<T> {
  fields: FormField<T>[];
  validation: ValidationConfig<T>;
  transforms: TransformPipeline<T>;
  // ... 50 more configuration options
}

// ✅ Right-sized: Specific login form
interface LoginForm {
  email: string;
  password: string;
}
```

### 2. Prefer Simple Solutions
```typescript
// ❌ Overengineered: Complex state management
const useAdvancedState = <T>(config: StateConfig<T>) => {
  // Complex hook with caching, persistence, validation, etc.
}

// ✅ Simple: Basic useState for immediate need
const [user, setUser] = useState<User | null>(null);
```

### 3. Abstract Only After 3+ Identical Patterns
```typescript
// ❌ Too early: First usage, already abstracted
const createDataHook = <T>(endpoint: string) => {
  // Generic data fetching abstraction
}

// ✅ Wait for pattern: After 3+ similar hooks
// Then consider abstraction
const useUsers = () => fetch('/users');
const usePosts = () => fetch('/posts'); 
const useComments = () => fetch('/comments');
// NOW consider: const useData = <T>(endpoint: string)
```

### 4. Stop at Working
```typescript
// ✅ It works, stop here
const formatDate = (date: string) => new Date(date).toLocaleDateString();

// ❌ Don't add unless requested
const formatDate = (
  date: string, 
  locale?: string, 
  options?: Intl.DateTimeFormatOptions,
  timezone?: string,
  fallback?: string
) => {
  // Now it's complicated for no reason
}
```

## 🎯 Framework Implementation

### Generated Project Guidelines

Every City App project includes anti-overengineering context:

#### CLAUDE.md Includes:
```markdown
### **CRITICAL: Anti-Overengineering Rules**
- **Build exactly what's asked for** - no additional features
- **Prefer simple solutions** - don't abstract until 3+ patterns
- **No premature optimization** - solve immediate problem first
- **Stop at working** - don't refactor without explicit request
- **One change at a time** - implement request, then stop
- **Ask before adding** - never add libraries/features without permission
```

#### .claude/commands/anti-overengineering.md:
```markdown
### ❌ DO NOT:
- Add features not explicitly requested
- Create abstractions before seeing 3+ identical patterns
- Suggest "improvements" unless asked
- Add dependencies without permission
- Refactor working code unless requested

### ✅ DO:
- Build exactly what was asked for
- Use simplest solution that works
- Ask permission before adding extras
- Focus on current feature first
- Stop when requirement is met
```

## 🚀 Practical Application

### Decision Framework

Before implementing any solution, ask:

1. **Specificity Check**: "Did they specifically ask for this?"
2. **Simplicity Check**: "Is this the simplest solution?"
3. **Scope Check**: "Am I adding complexity they didn't request?"
4. **Pattern Check**: "Have I seen this exact pattern 3+ times?"

### When Tempted to Over-Engineer

**STOP** → **ASK** → **IMPLEMENT**

```markdown
"I notice I could make this more flexible by adding [specific thing]. 
Would you like me to add that, or should I keep it simple for now?"
```

### Examples in Practice

#### Blog Post Creation
```typescript
// ❌ Overengineered: Generic content management system
interface ContentManager {
  createContent<T extends BaseContent>(
    type: ContentType,
    data: T,
    config: CreationConfig,
    hooks: ContentHooks<T>
  ): Promise<ManagedContent<T>>;
}

// ✅ Right-sized: Simple blog post creation
interface BlogPost {
  title: string;
  content: string;
  author: string;
}

const createPost = (post: BlogPost) => {
  dispatch(addPost(post));
};
```

#### Form Validation
```typescript
// ❌ Overengineered: Flexible validation framework
const useValidation = <T>(
  schema: ValidationSchema<T>,
  options: ValidationOptions,
  transforms: FieldTransforms<T>
) => {
  // Complex validation system
}

// ✅ Right-sized: Specific form validation
const validateLoginForm = (email: string, password: string) => {
  if (!email) return "Email required";
  if (!password) return "Password required";
  return null;
};
```

## 🎨 Template Design

### Blog Template Anti-Patterns Avoided

#### State Management
- **Avoided**: Complex state machine with all possible states
- **Implemented**: Simple Redux slices for blog and UI state

#### Components
- **Avoided**: Generic `<DataTable>` component with 50 props
- **Implemented**: Specific `<PostList>` component for blog posts

#### API Layer
- **Avoided**: Full GraphQL/REST abstraction layer
- **Implemented**: Simple Redux Toolkit Query for blog operations

### Minimal Template Philosophy

- **Avoided**: Full-featured component library setup
- **Implemented**: Basic React + TypeScript + minimal tooling
- **Avoided**: Complex build optimization from day one
- **Implemented**: Standard Vite setup with room to grow

## 📊 Success Metrics

### How to Measure Anti-Overengineering Success

#### Code Metrics
- **Lines of Code**: Should be proportional to features
- **File Count**: Avoid excessive file splitting
- **Dependencies**: Only add when specifically needed
- **Complexity**: Keep cyclomatic complexity reasonable

#### Development Metrics
- **Time to Feature**: How long from request to working implementation
- **Understanding Time**: How long for new developer to understand code
- **Change Velocity**: How easy it is to modify existing features

#### User Experience Metrics
- **Confusion Rate**: How often users ask "what does this do?"
- **Feature Adoption**: Are all features actually used?
- **Performance**: Simple code usually performs better

## 🛠️ Tools for Prevention

### Linting Rules
```json
{
  "rules": {
    "complexity": ["error", 10],
    "max-params": ["error", 3],
    "max-lines-per-function": ["error", 50]
  }
}
```

### Code Review Checklist
- [ ] Is this the simplest solution that works?
- [ ] Was this feature explicitly requested?
- [ ] Are we abstracting before seeing patterns?
- [ ] Could this be understood by a junior developer?
- [ ] Are we adding dependencies we don't need?

### Development Process
1. **Requirement Clarity**: Understand exact request
2. **Simple Implementation**: Build minimal working version
3. **Review & Validate**: Does it meet requirements?
4. **Stop**: Don't add unless requested
5. **Iterate**: Wait for next explicit request

## 💡 Teaching Moments

### Common Overengineering Temptations

#### "What if" Syndrome
```typescript
// ❌ "What if we need to sort by different fields?"
interface SortConfig {
  field: keyof BlogPost;
  direction: 'asc' | 'desc';
  transform?: (value: any) => any;
}

// ✅ They asked to sort by date
const sortByDate = (posts: BlogPost[]) => 
  [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
```

#### "Future Flexibility" Trap
```typescript
// ❌ "We might need different themes someday"
interface ThemeConfig {
  primary: ColorScheme;
  secondary: ColorScheme;
  variants: ThemeVariant[];
  customizations: CustomizationOptions;
}

// ✅ They want a blue theme
const theme = {
  primary: '#1976d2',
  secondary: '#dc004e'
};
```

## 🎓 Learning Resources

### Recommended Reading
- **YAGNI**: "You Aren't Gonna Need It" principle
- **KISS**: "Keep It Simple, Stupid" design principle
- **Rule of Three**: Abstract only after third repetition

### Anti-Patterns to Watch
- **Golden Hammer**: Using same solution for every problem
- **Feature Creep**: Continuously adding features
- **Architecture Astronauts**: Over-designing systems
- **Premature Generalization**: Creating abstractions too early

---

*Remember: The best code is code that solves the problem at hand, nothing more, nothing less.* 🎯✨