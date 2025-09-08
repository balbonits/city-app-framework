# Wiki Setup Instructions

This directory contains all the GitHub wiki pages for the City App Framework. Here's how to set up and maintain the wiki.

## 📁 Wiki Structure

```
wiki/
├── Home.md                    # Wiki homepage
├── _Sidebar.md               # Wiki navigation sidebar
├── Installation.md           # Setup and installation
├── Quick-Start.md           # Getting started guide
├── CLI-Usage.md             # Command reference
├── City-Metaphor.md         # Framework philosophy
├── Anti-Overengineering.md  # Development guidelines
├── Blog-Template.md         # Blog template documentation
├── Claude-Code-Setup.md     # AI integration guide
├── Architecture.md          # Technical architecture
├── Contributing.md          # Contribution guidelines
└── README.md               # This file
```

## 🚀 Setting Up GitHub Wiki

### Method 1: GitHub Web Interface

1. **Enable Wiki** in your repository settings
2. **Create pages** using the GitHub web interface
3. **Copy content** from the markdown files in this directory
4. **Set up sidebar** by creating a `_Sidebar` page

### Method 2: Git Clone (Recommended)

```bash
# Clone the wiki repository
git clone https://github.com/YOUR-USERNAME/city-app-framework.wiki.git

# Copy all wiki files
cp /path/to/city-app-framework/wiki/*.md city-app-framework.wiki/

# Commit and push
cd city-app-framework.wiki
git add .
git commit -m "Initial wiki setup with comprehensive documentation"
git push origin master
```

### Method 3: Automated Script

```bash
#!/bin/bash
# setup-wiki.sh

REPO_NAME="city-app-framework"
USERNAME="YOUR-USERNAME"

# Clone wiki
git clone https://github.com/$USERNAME/$REPO_NAME.wiki.git
cd $REPO_NAME.wiki

# Copy wiki files (adjust path as needed)
cp ../wiki/*.md .

# Commit and push
git add .
git commit -m "Setup comprehensive wiki documentation"
git push origin master

echo "✅ Wiki setup complete!"
echo "Visit: https://github.com/$USERNAME/$REPO_NAME/wiki"
```

## 📝 Wiki Content Overview

### Core Pages

#### Home.md
- Framework overview and philosophy
- Quick start commands
- Navigation to other wiki sections
- Current status and roadmap

#### Installation.md
- Prerequisites and system requirements
- Installation methods (npm global, local dev, npx)
- Claude Code setup
- Troubleshooting installation issues

#### Quick-Start.md
- 5-minute getting started guide
- Template options and examples
- AI-assisted development setup
- Basic customization tips

#### CLI-Usage.md
- Complete command reference
- All CLI flags and options
- Usage examples and patterns
- Error handling and troubleshooting

### Framework Concepts

#### City-Metaphor.md
- Explanation of the city governance metaphor
- Developer as "mayor", AI as "citizens"
- How the metaphor improves development
- Practical examples of the metaphor in action

#### Anti-Overengineering.md
- Guidelines to prevent overengineering
- AI development rules and patterns
- Common overengineering pitfalls
- Decision frameworks for simple solutions

### Templates

#### Blog-Template.md
- Complete blog template documentation
- Redux Toolkit implementation details
- Material UI integration patterns
- Interview preparation guidance
- Customization examples

#### Additional Templates (Future)
- Minimal-Template.md
- Dashboard-Template.md
- E-commerce-Template.md
- Custom-Templates.md

### AI Integration

#### Claude-Code-Setup.md
- Claude Code installation and setup
- AI context optimization
- Development workflow with AI
- Best practices and productivity tips

#### AI-Integration.md (Future)
- Advanced AI workflows
- Context management strategies
- Multi-session development
- AI productivity metrics

### Technical

#### Architecture.md
- Complete technical architecture
- CLI design and implementation
- Template system mechanics
- AI integration architecture
- Performance considerations

#### Contributing.md
- Contribution guidelines and process
- Development setup instructions
- Code standards and review process
- Template creation guide

## 🔧 Maintaining the Wiki

### Regular Updates

Update wiki content when:
- **New features** are added to the CLI
- **New templates** are created
- **API changes** occur
- **Best practices** evolve
- **Community feedback** suggests improvements

### Content Quality

Ensure all pages have:
- **Clear headings** and structure
- **Code examples** with syntax highlighting
- **Step-by-step instructions** where applicable
- **Screenshots** for visual processes
- **Links** to related pages
- **Update dates** for freshness

### Wiki Maintenance Script

```bash
#!/bin/bash
# update-wiki.sh

# Update modification dates
for file in *.md; do
  echo "Updating $file..."
  # Add update date to files
  sed -i '' "s/Last Updated: .*/Last Updated: $(date '+%B %d, %Y')/" "$file"
done

# Check for broken links
echo "Checking for broken internal links..."
grep -n "\[\[.*\]\]" *.md | grep -v "Home\|Installation\|Quick-Start" | head -10

# Commit updates
git add .
git commit -m "Update wiki content - $(date '+%Y-%m-%d')"
git push origin master

echo "✅ Wiki updated successfully!"
```

## 📊 Wiki Analytics

Track wiki effectiveness by monitoring:
- **Page views**: Which pages are most accessed
- **Search terms**: What users are looking for
- **Feedback**: Issues and improvement suggestions
- **External links**: How people find the wiki

## 🎯 Best Practices

### Writing Style
- **Clear and concise**: Get to the point quickly
- **Beginner-friendly**: Assume no prior knowledge
- **Example-driven**: Show, don't just tell
- **Action-oriented**: Use imperative mood for instructions

### Code Examples
- **Complete examples**: Full working code snippets
- **Syntax highlighting**: Use language-specific highlighting
- **Context**: Explain what each example does
- **Tested**: Ensure all examples actually work

### Navigation
- **Consistent sidebar**: Keep navigation predictable
- **Cross-references**: Link related pages
- **Breadcrumbs**: Help users understand location
- **Search optimization**: Use keywords naturally

### Visual Design
- **Headers**: Clear hierarchy with H1, H2, H3
- **Lists**: Use bullet points and numbered lists
- **Tables**: Organize comparative information
- **Callouts**: Use blockquotes for important notes

## 🔄 Version Control

### Git Workflow
```bash
# Create feature branch for major wiki updates
git checkout -b wiki/new-template-docs

# Make changes
# ... edit files ...

# Commit with descriptive message
git add .
git commit -m "Add comprehensive dashboard template documentation"

# Push and create pull request
git push origin wiki/new-template-docs
# Create PR through GitHub interface
```

### Backup Strategy
- **Regular commits**: Commit changes frequently
- **Branch protection**: Protect master branch
- **Local backups**: Keep local copies of wiki content
- **Export options**: Periodic full wiki exports

## 🚀 Future Enhancements

### Planned Additions
- **Video tutorials**: Embedded or linked video content
- **Interactive examples**: CodeSandbox integrations
- **Community showcase**: User-generated content
- **FAQ section**: Common questions and answers
- **Glossary**: Technical terms and definitions

### Integration Ideas
- **CI/CD**: Automated wiki updates from code changes
- **Search**: Enhanced search capabilities
- **Analytics**: Better tracking of wiki usage
- **Contributions**: Community-contributed content

---

*This wiki serves as the comprehensive documentation hub for City App Framework, helping developers understand, use, and contribute to the framework effectively.* 📚✨