# Installation Guide

## Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm** or **yarn**: Package manager
- **Git**: For version control
- **Claude Code**: For AI-assisted development (optional but recommended)

## Installation Methods

### Method 1: NPM Global Install (Recommended)

```bash
# When published to npm
npm install -g create-city-app

# Verify installation
create-city-app --version
```

### Method 2: Local Development Setup

```bash
# Clone the CLI repository
git clone https://github.com/your-username/create-city-app
cd create-city-app

# Install dependencies
npm install

# Build the CLI
npm run build

# Link for local testing
npm link

# Verify it works
create-city-app --version
```

### Method 3: Direct Usage (No Installation)

```bash
# Use npx to run without installing
npx create-city-app my-project --template=blog
```

## Claude Code Setup (Recommended)

The City App Framework is optimized for AI-assisted development with Claude Code:

```bash
# Install Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version
```

## Verification

Test your installation by generating a sample project:

```bash
# Generate a test project
create-city-app test-project --template=minimal --yes

# Navigate and test
cd test-project
npm install
npm run build

# Should build successfully
echo "✅ Installation verified!"
```

## Troubleshooting

### Command Not Found

If `create-city-app` is not found after global installation:

```bash
# Check npm global bin directory
npm bin -g

# Add to PATH if needed (add to ~/.zshrc or ~/.bashrc)
export PATH="$(npm bin -g):$PATH"
```

### Permission Issues (macOS/Linux)

```bash
# Fix npm permissions
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

### Windows Issues

```bash
# Use PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Next Steps

Once installed, see the [[Quick Start]] guide to create your first City App project!

## System Requirements

- **Disk Space**: ~100MB for CLI, ~500MB per generated project
- **Memory**: 4GB RAM minimum for development
- **Operating Systems**: macOS, Windows, Linux

---

*Need help? Check our [[Troubleshooting]] guide or open an issue on GitHub.*