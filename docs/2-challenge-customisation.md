# Copilot Customisation 🟢 Beginner

**Objective**: Create custom instructions, prompt templates, and agents to enhance Copilot for your project.

> 📖 **First, review the [Copilot Best Practices](copilot-reference.md)** for context management, shortcuts, and tips.

---

## 📖 Background

GitHub Copilot can be customized to understand your project's architecture, coding standards, and workflows. This is done through configuration files in the `.github/` folder:

- Set **custom instructions** in `.github/copilot-instructions.md` to enforce project standards
  - **OPTIONAL**: Use `AGENTS.md` at the root as an alternative (preferred by some agents like Claude, Gemini, Windsurf)
- Create reusable **prompt templates** in `.github/prompts/` folder
- Design **custom agents** in `.github/agents/` for specialized workflows
- Add **file-specific instructions** in `.github/instructions/` (e.g., `nextjs.instructions.md`)
- Configure ToolSet (up to 128 tools per request) for agent-driven tasks
- Automate GitHub tasks (issues, PRs, workflows)

### Why it matters:

- Instructions enforce coding standards and architectural patterns
- Custom Agents accelerate repetitive tasks (bug fixing, feature implementation)
- Prompt templates ensure consistency across team
- File-specific instructions apply framework best practices automatically

### Best practices:

- **Central instructions file**: `.github/copilot-instructions.md` for project-wide rules
  - **OPTIONAL**: Create `AGENTS.md` at the repository root as an alternative that works with multiple AI agents (Claude, Gemini, Cursor, Windsurf, etc.)
- **Prompt templates**: Create `.prompt.md` files for common workflows
- **Custom agents**: Define `.agent.md` files with specific tool configurations
- **Pattern documentation**: Include architecture patterns, testing conventions, and critical gotchas
- **Session management rules**: Always create todo lists, maintain context logs

### This Project's Implementation

**1. Custom Instructions** (`.github/copilot-instructions.md`):

```markdown
## Session Management

- Always create a to-do list at the start of each multi-step task
- Maintain a temporary log file (copilot_session.log)

## Core Architecture

- Custom Hooks: useExchangeRates + useConverter
- Component Composition: Small, focused components
- State Management: URL-first with useSearchParams
- API Layer: Multiple fallback sources with 1-hour caching

## Critical Patterns

- Co-located tests (.tsx + .test.tsx)
- URL state management pattern
- API error handling with fallbacks

## **Note**: You can use either approach:
> - **GitHub Copilot**: Place instructions in `.github/copilot-instructions.md`
> - **Multi-Agent Support** (OPTIONAL): Create `AGENTS.md` at repository root for broader AI agent compatibility (Claude, Gemini, Cursor IDE, Windsurf, etc.).
```

**2. Prompt Templates** (`.github/prompts/`):

- `bug-fixing.prompt.md` - Systematic bug diagnosis and fix workflow
- `introduction.prompt.md` - Project onboarding for new contributors

**3. Custom Agents** (`.github/agents/`):

- `beast.agent.md` - Agent mode with 20+ tools for autonomous problem-solving
  - Includes: codebase search, test execution, terminal commands, web fetch
  - **Source**: [Beast Mode 3.1](https://github.com/github/awesome-copilot/blob/main/agents/4.1-Beast.agent.md)

**4. File-Specific Instructions** (`.github/instructions/`):

- `nextjs.instructions.md` - Next.js 14 App Router best practices
  - Applied to all files via glob pattern `**`
  - Enforces Server/Client Component patterns
  - **Source**: [GitHub Awesome Copilot](https://github.com/github/awesome-copilot/blob/main/instructions/nextjs.instructions.md)

---

## 🎯 Your Task

Complete the following steps to customize Copilot for this project:

### Step 1: Create Custom Instructions

**Choose one of the following approaches:**

**Option A: GitHub Copilot (Primary)**
1. Create a file `.github/copilot-instructions.md`
2. Ask Copilot to help you draft custom instructions
3. Validate & add project-specific rules covering:
   - Session management (todo lists, logging)
   - Architecture patterns (hooks, components, state)
   - Testing conventions
   - Critical gotchas

**Option B: Multi-Agent Support (OPTIONAL)**
1. Create a file `AGENTS.md` at the repository root
2. Use the same content structure as Option A
3. This file will be automatically discovered by Claude, Gemini, Cursor, Windsurf, and other compatible agents

### Step 2: Create a Prompt Template

1. Create a folder `.github/prompts/` if it doesn't exist
2. Create a new prompt template file (e.g., `unitTest.prompt.md`)
3. Define a reusable prompt for a common task you perform

### Step 3: Create a Custom Agent

1. Create a folder `.github/agents/` if it doesn't exist
2. Create an agent file (e.g., `my-agent.agent.md`)
3. Configure the agent with specific tools and behaviors
4. Reference: [Beast Mode](https://github.com/github/awesome-copilot/blob/main/agents/4.1-Beast.agent.md)

### Step 4: Create File-Specific Instructions

1. Create a folder `.github/instructions/` if it doesn't exist
2. Create an instruction file for your framework (e.g., `nextjs.instructions.md`, `react.instructions.md`)
3. Add a glob pattern in the frontmatter to specify which files it applies to:
   ```markdown
   ---
   applyTo: "**/*.tsx"
   ---
   ```
4. Define framework-specific best practices and patterns
5. Reference: [GitHub Awesome Copilot Instructions](https://github.com/github/awesome-copilot/tree/main/instructions)

---

## ✅ Success Criteria

- [ ] Custom instructions created (either `.github/copilot-instructions.md` OR `AGENTS.md`)
- [ ] Copilot responds with project context awareness
- [ ] At least one prompt template created
- [ ] At least one custom agent created
- [ ] At least one file-specific instruction created

---

[← Back to Challenges](challenges.md)
