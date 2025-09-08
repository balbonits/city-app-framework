# CLI Usage Reference

Complete command-line interface documentation for `create-city-app`.

## Basic Syntax

```bash
create-city-app [project-name] [options]
```

## Commands

### Interactive Mode
```bash
create-city-app my-project
```
Launches interactive prompts to configure your project step by step.

### Non-Interactive Mode
```bash
create-city-app my-project --template=blog --yes
```
Generates project with default options, no prompts.

## Options

### `--template=<type>`
Choose the project template:
- `blog` - Full-featured blog/CMS with Redux + Material UI
- `minimal` - Basic React + TypeScript setup

```bash
# Blog template (recommended for demos)
create-city-app my-blog --template=blog

# Minimal template (clean slate)
create-city-app my-app --template=minimal
```

### `--yes` or `-y`
Skip all prompts and use default options:

```bash
create-city-app quick-blog --template=blog --yes
```

**Defaults when using `--yes`:**
- Framework: React
- State Management: Redux Toolkit
- UI Framework: Material UI
- AI Context: Enabled
- Commission on Audits: Enabled

### `--force` or `-f`
Overwrite existing directories:

```bash
# For existing project directories
create-city-app existing-project --template=blog --force

# For current directory (preserves .git)
create-city-app . --template=blog --force
```

**Force behavior:**
- **Named directory**: Removes entire directory, recreates fresh
- **Current directory (`.`)**: Removes all non-git files, preserves `.git/`

## Examples

### Quick Blog Generation
```bash
create-city-app portfolio-blog --template=blog --yes
```

### Interview Demo Setup
```bash
create-city-app interview-demo --template=blog --yes --force
cd interview-demo
npm install
npm run dev
npm run ai:start
```

### Minimal Project
```bash
create-city-app simple-app --template=minimal --yes
```

### Interactive Setup
```bash
create-city-app my-project
# Follows guided prompts for:
# - Template selection
# - State management choice
# - UI framework preference
# - Additional options
```

### Generate in Current Directory
```bash
# Clone your repo first
git clone https://github.com/username/my-blog-repo
cd my-blog-repo

# Generate into existing repo (preserves .git)
create-city-app . --template=blog --yes --force
```

## Interactive Prompts

When running without `--yes`, you'll be prompted for:

1. **Template Choice**
   - Blog/CMS (Redux + Material UI)
   - Minimal (Basic setup)

2. **State Management** (Blog template only)
   - Redux Toolkit (recommended)
   - Zustand (lightweight)

3. **UI Framework** (Blog template only)
   - Material UI (professional)
   - Tailwind CSS (utility-first)

## Generated Scripts

Every project includes npm scripts:

### Core Development
```bash
npm run dev          # Vite dev server (http://localhost:3000)
npm run build        # Production build
npm run preview      # Preview production build
npm test             # Run Vitest tests
```

### Code Quality
```bash
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run type-check   # TypeScript validation
```

### AI Development
```bash
npm run ai:start     # Launch Claude Code with context
npm run ai:context   # Show AI context status
npm run dev:ai       # Dev server + AI (if Claude Code installed)
```

## Error Handling

### Directory Exists
```bash
❌ Directory my-project already exists.
💡 Use --force or -f to overwrite
```

**Solution**: Add `--force` flag or choose different name.

### Non-Empty Directory
```bash
⚠️  Directory is not empty. Non-git files found: package.json, src, ...
❌ Cannot generate into non-empty directory.
💡 Use --force or -f to overwrite existing files
```

**Solution**: Add `--force` flag to clean directory (preserves .git).

### Missing Template
```bash
❌ Unknown template: custom
Available templates: blog, minimal
```

**Solution**: Use valid template name.

## Advanced Usage

### Custom Project Structure
```bash
# Generate then customize
create-city-app my-project --template=minimal --yes
cd my-project

# Add your own configurations
# Modify generated files as needed
```

### Multiple Projects
```bash
# Generate multiple variations
create-city-app blog-v1 --template=blog --yes
create-city-app blog-v2 --template=blog --yes
create-city-app minimal-test --template=minimal --yes
```

### Testing Different Options
```bash
# Test blog template
create-city-app test-blog --template=blog --yes
cd test-blog && npm install && npm run dev

# Test minimal template
create-city-app test-minimal --template=minimal --yes
cd test-minimal && npm install && npm run dev
```

## Troubleshooting

### Command Not Found
```bash
# Check if CLI is properly linked
which create-city-app

# Re-link if needed
cd /path/to/create-city-app
npm link
```

### Generation Fails
```bash
# Check Node.js version (needs 18+)
node --version

# Check npm permissions
npm config get prefix
```

### Missing Dependencies
```bash
# After generation, always run:
cd your-project
npm install
```

## Version Information

```bash
# Check CLI version
create-city-app --version

# Check help
create-city-app --help
```

---

*For more advanced usage patterns, see [[Template System]] and [[Architecture]] documentation.*