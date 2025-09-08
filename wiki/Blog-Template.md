# Blog Template Documentation

The Blog Template is the flagship template of City App Framework, designed specifically for demonstrating Redux Toolkit, Material UI, and professional React patterns - perfect for interviews and portfolio projects.

## 🎯 Overview

The Blog Template generates a complete blog/CMS application with:
- **Redux Toolkit** for state management
- **Material UI** for professional components
- **Complete CRUD operations** for blog posts
- **TypeScript** throughout
- **Rich AI context** for development
- **Interview-ready code structure**

## 🚀 Quick Generation

```bash
# Generate blog project
create-city-app my-blog --template=blog --yes

# Install and run
cd my-blog
npm install
npm run dev
```

## 📁 Generated Structure

```
my-blog/
├── src/
│   ├── components/           # React components
│   │   ├── BlogApp.tsx      # Main app component
│   │   ├── Header.tsx       # Navigation header
│   │   ├── PostList.tsx     # Blog post list
│   │   ├── PostEditor.tsx   # Create/edit posts
│   │   └── PostViewer.tsx   # Single post view
│   ├── store/               # Redux Toolkit setup
│   │   ├── index.ts         # Store configuration
│   │   └── slices/
│   │       ├── blogSlice.ts # Blog state management
│   │       └── uiSlice.ts   # UI state management
│   ├── hooks/
│   │   └── redux.ts         # Typed Redux hooks
│   ├── types/
│   │   └── blog.ts          # TypeScript definitions
│   ├── utils/
│   │   └── blog.ts          # Helper functions
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── .claude/                 # AI development context
├── scripts/
│   └── ai-setup.sh         # AI environment setup
├── CLAUDE.md               # Comprehensive AI context
└── package.json            # With AI-optimized scripts
```

## 🏗️ Architecture Deep Dive

### Redux Toolkit Implementation

#### Store Configuration
```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './slices/blogSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### Blog State Slice
```typescript
// src/store/slices/blogSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BlogPost, BlogState } from '../../types/blog';

const initialState: BlogState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<BlogPost[]>) => {
      state.posts = action.payload;
      state.loading = false;
    },
    addPost: (state, action: PayloadAction<BlogPost>) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<BlogPost>) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    // ... more reducers
  },
});

export const { setPosts, addPost, updatePost, deletePost } = blogSlice.actions;
export default blogSlice.reducer;
```

#### Typed Redux Hooks
```typescript
// src/hooks/redux.ts
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Material UI Integration

#### Theme Configuration
```typescript
// src/App.tsx
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <BlogApp />
      </BrowserRouter>
    </ThemeProvider>
  );
}
```

#### Component Examples
```typescript
// Professional Material UI usage
import { 
  Card, 
  CardContent, 
  Typography, 
  Button,
  Grid,
  Chip
} from '@mui/material';

const PostCard = ({ post }: { post: BlogPost }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {post.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {post.excerpt}
      </Typography>
      <Box sx={{ mt: 2, mb: 2 }}>
        {post.tags.map((tag) => (
          <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
        ))}
      </Box>
    </CardContent>
  </Card>
);
```

## ✨ Features Included

### CRUD Operations
- **Create**: Rich post editor with title, content, tags, categories
- **Read**: Post list with cards, individual post viewer
- **Update**: Edit existing posts with pre-populated forms
- **Delete**: Remove posts with confirmation dialog

### State Management Features
- **Blog Posts**: Complete post management
- **UI State**: Loading states, modals, snackbar notifications
- **Typed Hooks**: `useAppDispatch` and `useAppSelector`
- **Immutable Updates**: Redux Toolkit with Immer

### Material UI Components
- **AppBar**: Professional navigation header
- **Cards**: Post display with consistent styling
- **Forms**: Create/edit post forms with validation
- **Dialogs**: Confirmation dialogs for destructive actions
- **Snackbars**: User feedback notifications
- **Responsive Layout**: Mobile-first design

### TypeScript Integration
- **Strict Mode**: Full TypeScript strict mode enabled
- **Type Definitions**: Complete interfaces for all data structures
- **Typed Redux**: Fully typed store, actions, and selectors
- **Component Props**: All components properly typed

## 🎨 Customization Guide

### Adding New Post Fields
```typescript
// 1. Update types
interface BlogPost {
  // existing fields...
  subtitle?: string;
  featuredImage?: string;
}

// 2. Update Redux slice
const blogSlice = createSlice({
  // existing reducers handle new fields automatically
});

// 3. Update components
const PostEditor = () => {
  // Add form fields for new properties
  <TextField label="Subtitle" ... />
  <TextField label="Featured Image URL" ... />
};
```

### Customizing Theme
```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#your-color' },
    secondary: { main: '#your-secondary' },
  },
  typography: {
    h1: { fontSize: '2.5rem' },
    // customize typography
  },
  spacing: 8, // default spacing unit
});
```

### Adding New Redux State
```typescript
// 1. Create new slice
// src/store/slices/authSlice.ts
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// 2. Add to store
export const store = configureStore({
  reducer: {
    blog: blogReducer,
    ui: uiReducer,
    auth: authReducer, // Add new slice
  },
});
```

## 🧪 Testing Strategy

### Generated Tests
The template includes test setup for:
- **Component Testing**: React Testing Library
- **Redux Testing**: Store and slice testing
- **Utility Testing**: Helper function testing
- **Integration Testing**: Cross-component interactions

### Example Tests
```typescript
// Component test example
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import PostList from '../PostList';
import { store } from '../../store';

describe('PostList', () => {
  it('displays blog posts correctly', () => {
    render(
      <Provider store={store}>
        <PostList />
      </Provider>
    );
    
    expect(screen.getByText('Blog Posts')).toBeInTheDocument();
  });
});

// Redux test example
import { store } from '../../store';
import { addPost } from '../slices/blogSlice';

describe('blogSlice', () => {
  it('adds post to state correctly', () => {
    const newPost = { id: '1', title: 'Test', content: 'Content' };
    store.dispatch(addPost(newPost));
    
    const state = store.getState();
    expect(state.blog.posts).toHaveLength(1);
    expect(state.blog.posts[0]).toEqual(newPost);
  });
});
```

## 🎯 Interview Preparation

### Key Talking Points
1. **Redux Toolkit**: Modern Redux patterns, no boilerplate
2. **TypeScript**: Strict typing, interface design
3. **Material UI**: Professional component library usage
4. **State Management**: Normalized state, immutable updates
5. **Component Architecture**: Reusable, composable components

### Demo Flow
```bash
# 1. Generate project
create-city-app interview-demo --template=blog --yes

# 2. Install and run
cd interview-demo && npm install && npm run dev

# 3. Demonstrate features
# - Create a blog post
# - Edit existing post  
# - Show Redux DevTools
# - Explain component structure
# - Show TypeScript integration
```

### Code Review Points
- **Redux Toolkit patterns**: Slices, typed hooks, immutable updates
- **Material UI best practices**: Theme usage, responsive design
- **TypeScript implementation**: Interface design, strict typing
- **Component composition**: HOCs, render props, hooks
- **Testing approach**: Unit tests, integration tests

## 🚀 Production Readiness

### Performance Optimizations
- **Code Splitting**: Route-based splitting ready
- **Memoization**: React.memo for expensive components
- **Bundle Analysis**: webpack-bundle-analyzer included
- **Image Optimization**: Lazy loading patterns

### SEO Considerations
- **Meta Tags**: Ready for React Helmet integration
- **Structured Data**: Blog post schema markup ready
- **Sitemap Generation**: Framework for dynamic sitemaps
- **Server-Side Rendering**: Next.js migration path clear

### Deployment Options
- **Static Hosting**: Netlify, Vercel ready
- **Docker**: Containerization support
- **CI/CD**: GitHub Actions templates
- **CDN**: Asset optimization ready

## 🔧 Troubleshooting

### Common Issues

#### Redux DevTools Not Working
```typescript
// Ensure store configuration includes devtools
export const store = configureStore({
  reducer: { /* reducers */ },
  devTools: process.env.NODE_ENV !== 'production',
});
```

#### Material UI Styling Issues
```typescript
// Ensure ThemeProvider wraps application
<ThemeProvider theme={theme}>
  <CssBaseline />
  <App />
</ThemeProvider>
```

#### TypeScript Errors
```bash
# Check strict mode configuration
npm run type-check

# Common fixes
# - Add return types to functions
# - Define proper interfaces
# - Use type assertions carefully
```

---

*The Blog Template showcases professional React development patterns perfect for interviews and portfolio projects.* ✨📝