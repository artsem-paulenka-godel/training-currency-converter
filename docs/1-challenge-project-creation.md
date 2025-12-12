# Project Creation with AI 🟢 Beginner

**Objective**: Learn to build complete projects from scratch using well-structured AI prompts.

---

## 📖 Background

This Currency Converter was built entirely with AI assistance using a single comprehensive prompt. A good project-creation prompt includes these sections:

| Section | Purpose |
|---------|---------|
| **Goal** | One-line project description |
| **Tech Stack** | Frameworks, languages, tools |
| **Project Structure** | Folders and file organization |
| **Features** | Core functionality breakdown |
| **Error Handling** | How to handle edge cases |
| **Deliverables** | Expected output files |

### Key Principles

1. **Be Specific** — Include exact file paths, frameworks, and patterns
2. **Group Related Items** — Organize features into logical sections
3. **Specify Edge Cases** — Tell AI how to handle errors and failures
4. **Request Documentation** — Always ask for README and setup instructions
5. **Define Structure First** — Project organization prevents chaos

### Example Prompt

```
Create a complete Currency Converter App from scratch using Next.js and TypeScript.

### Technical Requirements
- Next.js (App Router) with latest version
- TypeScript for type safety
- Tailwind CSS for styling
- Responsive design (mobile and desktop)

### Project Structure
- /app - Next.js App Router structure
- /app/api/rates/route.ts - API endpoint for exchange rates
- /utils/ folder for helper functions
- /types/ folder for TypeScript interfaces

### Core Features
1. API Integration
   - Fetch exchange rates from multiple sources with fallbacks
   - Implement 1-hour caching

2. User Interface
   - Amount input with validation
   - Source/target currency dropdowns
   - Swap button between dropdowns
   - Automatic conversion on input change

3. Advanced Features
   - URL query parameter persistence
   - Conversion history (last 10)

### Error Handling
- Client input validation with user feedback
- API error handling with fallback sources
- Timeout handling for slow connections

### Deliverables
- Complete application code
- README.md with setup instructions
- CHANGELOG.md for version history
```

---

## 🎯 Your Task

Create your own project from scratch using AI assistance:

### Step 1: Define Your Project

1. Choose a project idea (e.g., todo app, weather dashboard, quiz game)
2. Write a one-line goal description

### Step 2: Create a Comprehensive Prompt

1. Define the tech stack
2. Specify the project structure (folders, files)
3. List all features organized by category
4. Include error handling requirements
5. Request documentation deliverables

### Step 3: Generate and Verify

1. Submit your prompt to Copilot
2. Review the generated code structure
3. Run the project and test all features
4. Iterate on the prompt if needed

---

## ✅ Success Criteria

- [ ] Project runs with `npm install && npm run dev`
- [ ] All specified features work
- [ ] Code follows requested patterns
- [ ] Documentation is complete

---

[← Back to Challenges](challenges.md)
