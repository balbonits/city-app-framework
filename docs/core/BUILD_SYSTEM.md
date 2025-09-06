# City App Framework: Build System Architecture

## Overview

The City App Framework build system is designed for efficient CLI development, npm publishing, and template management. It handles TypeScript compilation, template bundling, executable creation, and comprehensive testing of the entire framework.

## Build System Philosophy

### **CLI-First Architecture**
- **TypeScript Source**: Full development in TypeScript for type safety
- **JavaScript Distribution**: Compiled to Node.js-compatible JavaScript
- **Template Bundling**: All templates included in distributable package
- **Cross-Platform**: Works on macOS, Windows, and Linux

### **Development Workflow**
- **Hot Reload**: `tsx watch` for rapid CLI development
- **Template Testing**: Live template generation during development
- **End-to-End Validation**: Full CLI workflow testing
- **Quality Gates**: Linting, type checking, and validation

## Build Architecture

### **Directory Structure**
```
city-app-framework/
├── src/                    # TypeScript source code
│   ├── index.ts           # Main CLI entry point
│   ├── commands/          # CLI command handlers
│   ├── prompts/           # Interactive prompt system
│   ├── generator/         # Project generation engine
│   ├── templates/         # Template processing
│   └── utils/             # Shared utilities
├── templates/             # Template source files
│   ├── base/             # Base template (shared)
│   ├── minimal/          # Minimal template
│   ├── dashboard/        # Dashboard template
│   ├── ecommerce/        # E-commerce template
│   └── blog/             # Blog template
├── bin/                   # Executable entry points
│   └── create-city-app.js # Node.js executable script
├── dist/                  # Build output (generated)
│   ├── src/              # Compiled JavaScript
│   ├── templates/        # Copied templates
│   └── bin/              # Executable files
├── scripts/               # Build and development scripts
│   ├── build.ts          # Main build script
│   ├── dev.ts            # Development server
│   └── test-cli.ts       # CLI testing script
└── test/                  # Test suites
    ├── unit/             # Unit tests
    ├── integration/      # Integration tests
    └── e2e/              # End-to-end CLI tests
```

## Core Build Components

### **1. Build Pipeline (`scripts/build.ts`)**
```typescript
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

export async function buildFramework() {
  console.log('🏗️  Building City App Framework...\n');
  
  // 1. Clean previous build
  await cleanDistDirectory();
  
  // 2. Compile TypeScript to JavaScript
  await compileTypeScript();
  
  // 3. Copy template files to dist
  await copyTemplates();
  
  // 4. Process package.json for distribution
  await processPackageJson();
  
  // 5. Create executable bin scripts
  await createBinScripts();
  
  // 6. Validate build output
  await validateBuild();
  
  console.log('✅ Build completed successfully!\n');
}

async function cleanDistDirectory() {
  console.log('🧹 Cleaning dist directory...');
  await fs.remove('./dist');
  await fs.ensureDir('./dist');
}

async function compileTypeScript() {
  console.log('🔧 Compiling TypeScript...');
  execSync('tsc --project tsconfig.build.json', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
}

async function copyTemplates() {
  console.log('📁 Copying template files...');
  await fs.copy('./templates', './dist/templates', {
    filter: (src) => {
      // Skip .DS_Store and other system files
      return !path.basename(src).startsWith('.');
    }
  });
}

async function processPackageJson() {
  console.log('📦 Processing package.json...');
  const sourcePackage = await fs.readJson('./package.json');
  
  // Remove dev dependencies and scripts for distribution
  const distPackage = {
    ...sourcePackage,
    main: './src/index.js',
    bin: {
      'create-city-app': './bin/create-city-app.js'
    },
    files: [
      'src/',
      'templates/',
      'bin/',
      'README.md',
      'LICENSE'
    ],
    devDependencies: undefined,
    scripts: {
      // Keep only essential scripts
      test: sourcePackage.scripts.test
    }
  };
  
  await fs.writeJson('./dist/package.json', distPackage, { spaces: 2 });
}

async function createBinScripts() {
  console.log('🔗 Creating executable scripts...');
  
  const binScript = `#!/usr/bin/env node
require('../src/index.js');
`;
  
  await fs.ensureDir('./dist/bin');
  await fs.writeFile('./dist/bin/create-city-app.js', binScript);
  
  // Make executable on Unix systems
  if (process.platform !== 'win32') {
    await fs.chmod('./dist/bin/create-city-app.js', '755');
  }
}

async function validateBuild() {
  console.log('✅ Validating build output...');
  
  // Check required files exist
  const requiredFiles = [
    './dist/src/index.js',
    './dist/bin/create-city-app.js',
    './dist/package.json',
    './dist/templates/base'
  ];
  
  for (const file of requiredFiles) {
    if (!await fs.pathExists(file)) {
      throw new Error(`Missing required file: ${file}`);
    }
  }
  
  // Test basic CLI functionality
  execSync('node ./dist/bin/create-city-app.js --version', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
}
```

### **2. Development Server (`scripts/dev.ts`)**
```typescript
import { spawn } from 'child_process';
import chokidar from 'chokidar';
import path from 'path';

export function startDevServer() {
  console.log('🚀 Starting City App Framework development server...\n');
  
  // Start TypeScript compilation in watch mode
  const tscWatch = spawn('tsc', ['--watch', '--project', 'tsconfig.json'], {
    stdio: 'inherit',
    shell: true
  });
  
  // Watch template files for changes
  const templateWatcher = chokidar.watch('./templates/**/*', {
    ignored: /(^|[\/\\])\../, // Ignore dotfiles
    persistent: true
  });
  
  templateWatcher.on('change', (changedPath) => {
    console.log(`📝 Template changed: ${path.relative(process.cwd(), changedPath)}`);
    console.log('   Restart CLI test to see changes.\n');
  });
  
  // Handle cleanup on exit
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping development server...');
    tscWatch.kill();
    templateWatcher.close();
    process.exit(0);
  });
  
  console.log('👀 Watching for changes...');
  console.log('🧪 Run `npm run test:cli` to test CLI with live changes\n');
}
```

### **3. CLI Testing Script (`scripts/test-cli.ts`)**
```typescript
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { randomBytes } from 'crypto';

export async function testCLI() {
  const testDir = path.join(process.cwd(), 'temp-test-projects');
  const testProjectName = `test-app-${randomBytes(4).toString('hex')}`;
  const testProjectPath = path.join(testDir, testProjectName);
  
  console.log(`🧪 Testing CLI with project: ${testProjectName}\n`);
  
  try {
    // Ensure test directory exists
    await fs.ensureDir(testDir);
    
    // Test CLI with various configurations
    await testMinimalTemplate(testProjectPath);
    await testDashboardTemplate(testProjectPath);
    await testStateManagementOptions(testProjectPath);
    
    console.log('✅ All CLI tests passed!\n');
    
  } catch (error) {
    console.error('❌ CLI test failed:', error);
    process.exit(1);
  } finally {
    // Cleanup
    if (await fs.pathExists(testProjectPath)) {
      await fs.remove(testProjectPath);
    }
  }
}

async function testMinimalTemplate(basePath: string) {
  console.log('📦 Testing minimal template...');
  
  const projectPath = `${basePath}-minimal`;
  
  // Generate project with minimal template
  execSync(`tsx src/index.ts ${projectPath} --template=minimal --yes`, {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  // Validate generated structure
  await validateProjectStructure(projectPath, 'minimal');
  
  // Test that project builds
  execSync('npm install && npm run build', {
    stdio: 'inherit',
    cwd: projectPath
  });
  
  await fs.remove(projectPath);
}

async function testDashboardTemplate(basePath: string) {
  console.log('📊 Testing dashboard template...');
  
  const projectPath = `${basePath}-dashboard`;
  
  // Generate project with dashboard template
  execSync(`tsx src/index.ts ${projectPath} --template=dashboard --state=zustand --yes`, {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  // Validate generated structure
  await validateProjectStructure(projectPath, 'dashboard');
  
  // Test that project builds and tests pass
  execSync('npm install && npm run build && npm test', {
    stdio: 'inherit',
    cwd: projectPath
  });
  
  await fs.remove(projectPath);
}

async function testStateManagementOptions(basePath: string) {
  console.log('🏪 Testing state management options...');
  
  const stateOptions = ['zustand', 'redux', 'context'];
  
  for (const state of stateOptions) {
    const projectPath = `${basePath}-${state}`;
    
    execSync(`tsx src/index.ts ${projectPath} --state=${state} --yes`, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    // Validate state management specific structure
    await validateStateManagement(projectPath, state);
    
    await fs.remove(projectPath);
  }
}

async function validateProjectStructure(projectPath: string, template: string) {
  const requiredFiles = [
    'package.json',
    'CLAUDE.md',
    '.claude/commands/',
    'src/',
    'tsconfig.json',
    'vite.config.ts'
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(projectPath, file);
    if (!await fs.pathExists(filePath)) {
      throw new Error(`Missing required file: ${file} in template ${template}`);
    }
  }
}

async function validateStateManagement(projectPath: string, stateType: string) {
  let expectedFiles: string[] = [];
  
  switch (stateType) {
    case 'zustand':
      expectedFiles = ['src/store/index.ts', 'src/store/auth.ts'];
      break;
    case 'redux':
      expectedFiles = ['src/store/index.ts', 'src/store/slices/'];
      break;
    case 'context':
      expectedFiles = ['src/context/AuthContext.tsx', 'src/context/index.ts'];
      break;
  }
  
  for (const file of expectedFiles) {
    const filePath = path.join(projectPath, file);
    if (!await fs.pathExists(filePath)) {
      throw new Error(`Missing state management file: ${file} for ${stateType}`);
    }
  }
}
```

## Build Configurations

### **TypeScript Configuration (`tsconfig.build.json`)**
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist/src",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "src/**/*.test.ts",
    "src/**/*.spec.ts",
    "test/",
    "templates/",
    "dist/"
  ]
}
```

### **Package.json Scripts**
```json
{
  "scripts": {
    "dev": "tsx scripts/dev.ts",
    "build": "tsx scripts/build.ts",
    "test": "vitest",
    "test:cli": "tsx scripts/test-cli.ts",
    "test:e2e": "tsx test/e2e/cli.test.ts",
    "lint": "eslint src/ --ext .ts,.tsx",
    "lint:fix": "eslint src/ --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "create-test-app": "tsx src/index.ts test-app --yes",
    "clean": "rimraf dist/",
    "prepack": "npm run build",
    "prepublish": "npm run build && npm run test"
  }
}
```

## Template Management System

### **Template Processing Engine**
```typescript
import fs from 'fs-extra';
import path from 'path';
import Handlebars from 'handlebars';

export class TemplateProcessor {
  constructor(private templatesDir: string) {}
  
  async processTemplate(
    templateName: string, 
    targetDir: string, 
    variables: Record<string, any>
  ) {
    const templateDir = path.join(this.templatesDir, templateName);
    
    // Process template hierarchy
    await this.processBaseTemplate(targetDir, variables);
    await this.processSpecificTemplate(templateDir, targetDir, variables);
    await this.processStateManagement(targetDir, variables);
  }
  
  private async processBaseTemplate(targetDir: string, variables: any) {
    const baseDir = path.join(this.templatesDir, 'base');
    await this.copyAndProcess(baseDir, targetDir, variables);
  }
  
  private async processSpecificTemplate(templateDir: string, targetDir: string, variables: any) {
    if (await fs.pathExists(templateDir)) {
      await this.copyAndProcess(templateDir, targetDir, variables, true);
    }
  }
  
  private async processStateManagement(targetDir: string, variables: any) {
    const stateDir = path.join(this.templatesDir, 'state', variables.stateManagement);
    if (await fs.pathExists(stateDir)) {
      await this.copyAndProcess(stateDir, targetDir, variables, true);
    }
  }
  
  private async copyAndProcess(
    sourceDir: string, 
    targetDir: string, 
    variables: any,
    merge = false
  ) {
    const files = await fs.readdir(sourceDir, { withFileTypes: true });
    
    for (const file of files) {
      const sourcePath = path.join(sourceDir, file.name);
      const targetPath = path.join(targetDir, file.name);
      
      if (file.isDirectory()) {
        await fs.ensureDir(targetPath);
        await this.copyAndProcess(sourcePath, targetPath, variables, merge);
      } else {
        // Skip if file exists and not merging
        if (!merge && await fs.pathExists(targetPath)) {
          continue;
        }
        
        await this.processFile(sourcePath, targetPath, variables);
      }
    }
  }
  
  private async processFile(sourcePath: string, targetPath: string, variables: any) {
    const content = await fs.readFile(sourcePath, 'utf8');
    
    // Process handlebars templates
    if (sourcePath.endsWith('.hbs')) {
      const template = Handlebars.compile(content);
      const processed = template(variables);
      const finalPath = targetPath.replace('.hbs', '');
      await fs.writeFile(finalPath, processed);
    } else {
      // Simple variable replacement
      const processed = this.replaceVariables(content, variables);
      await fs.writeFile(targetPath, processed);
    }
  }
  
  private replaceVariables(content: string, variables: any): string {
    return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match;
    });
  }
}
```

## Testing Strategy

### **Unit Tests**
- Template processing functions
- CLI argument parsing
- Project validation logic
- File generation utilities

### **Integration Tests**
- Complete template generation
- State management integration
- Claude Code context generation
- Package.json configuration

### **End-to-End Tests**
- Full CLI workflow from start to finish
- Generated project builds successfully
- Tests pass in generated projects
- AI context files are properly formatted

## Publishing Workflow

### **Pre-publish Checklist**
1. ✅ All tests passing
2. ✅ Build completes without errors
3. ✅ CLI generates working projects
4. ✅ Templates validate successfully
5. ✅ Version number updated
6. ✅ README and documentation updated

### **npm Publish Process**
```bash
# 1. Run full test suite
npm run test
npm run test:e2e

# 2. Build for distribution
npm run build

# 3. Validate build output
cd dist && npm pack --dry-run

# 4. Publish to npm
npm publish
```

## Development Workflow

### **Daily Development**
```bash
# Start development environment
npm run dev

# Test CLI changes
npm run test:cli

# Run specific template test
npm run create-test-app -- --template=dashboard
```

### **Quality Assurance**
```bash
# Type checking
npm run type-check

# Linting
npm run lint:fix

# Full test suite
npm test && npm run test:e2e
```

## Performance Considerations

### **Build Optimization**
- **Incremental Builds**: Only recompile changed TypeScript files
- **Template Caching**: Cache processed templates during development
- **Dependency Bundling**: Include only essential dependencies
- **Size Monitoring**: Track bundle size and template sizes

### **CLI Performance**
- **Lazy Loading**: Load templates and dependencies on demand
- **Progress Indicators**: Show progress during long operations
- **Error Recovery**: Graceful handling of network and file system errors
- **Memory Management**: Stream large files instead of loading into memory

---

*The build system ensures reliable, fast, and maintainable CLI development while providing comprehensive testing and quality assurance for the City App Framework.* 🏗️⚡