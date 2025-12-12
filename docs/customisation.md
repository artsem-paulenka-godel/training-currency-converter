# GitHub Copilot and VS Code: Customization and Workflow Guide

---

## 1. Adding and Managing Context

### What to do:

- Add context through:
  - Files, folders, code lines, images, and links.
  - Special commands: `@workspace`, `#fileName`.
  - Use `#selection` for focused work on highlighted text.
- Pull elements without screenshots using **Simple Browser** (HTML, CSS, JS).
- Start a new chat session periodically to clear old context.

### Why it matters:

- Context directly impacts the quality of Copilot’s responses.
- Proper context management reduces the risk of missing critical details.

### Best practices:

- Add context manually for maximum control.
- Explicitly specify which files are important.
- For complex tasks, use Simple Browser for visual context.

**Example prompt:**

```
@workspace #selection
Explain the logic of this function and suggest optimization.
```

---

## 2. Working with Large Files and Long Operations

### What to do:

- Split large files into blocks of ~200 lines and label them: [Block 1/5].
- Use **Continue** when generation is interrupted.
- Ask Copilot to create a to-do list at the start of the session.
- Maintain a temporary log file (`copilot_session.log`) for context recovery.

### Why it matters:

- Large files can exceed token limits.
- Logs help restore progress after interruptions.

### Best practices:

- Add clear markers between blocks.
- Ensure each block includes references to previous ones.

---

## 3. Change Management and Safe Rollback

### What to do:

- Use **Undo** in Copilot for quick rollbacks.
- Review changes with `git diff`.
- Stage verified files before committing.
- Commit after major iterations or changes.

### Why it matters:

- Undo prevents wasted time on incorrect generations.
- Git ensures version safety and traceability.

### Best practices:

- Automate commit message generation with Copilot.
- Commit after every significant change.

---

## 4. Copilot Limitations and Issues

### What to do:

- Explicitly highlight critical parts of the context.
- Verify which files are included in the context.
- Refresh sessions periodically to clear state.

### Why it matters:

- Context prioritization can be unpredictable.
- `#selection` may exclude the rest of the file from analysis.

### Best practices:

- Use `#selection` only for local tasks.
- For global changes, rely on `@workspace`.

**Workarounds Table:**
| Limitation | How to overcome |
|------------|-----------------|
| Token limit | Split into blocks |
| Unpredictable prioritization | Explicit context instructions |

---

## 5. Inline Mode and Keyboard Shortcuts

### What to do:

- Memorize key shortcuts:

| Action            | Shortcut         |
| ----------------- | ---------------- |
| Inline command    | Ctrl + I         |
| Open Copilot Chat | Shift + Ctrl + I |
| Exit inline mode  | ESC              |
| Accept suggestion | Tab              |

- Use slash commands:
  - `/explain` — explain code
  - `/refactor` — suggest improvements
  - `/test` — create tests
  - `/fix` — fix errors

### Why it matters:

- Shortcuts speed up workflow.
- Slash commands provide quick access to essential actions.

### Best practices:

- Customize commands via VS Code snippets.

---

## 6. Working with Translation

### What to do:

- Use DeepL or VS Code’s built-in translator for long texts.
- Keep prompts in one language.
- Avoid mixing languages in a single prompt.

### Why it matters:

- Mixed languages reduce generation accuracy.

### Best practices:

- For code-related tasks, Russian prompts are fine—Copilot understands them.

---

## 7. Instructions and Automation

### What to do:

- Set **custom instructions** in `.github/copilot-instructions.md` to enforce project standards
- Create reusable **prompt templates** in `.github/prompts/` folder
- Design **custom agents** in `.github/agents/` for specialized workflows
- Add **file-specific instructions** in `.github/instructions/` (e.g., `nextjs.instructions.md`)
- Configure ToolSet (up to 128 tools per request) for agent-driven tasks
- Automate GitHub tasks (issues, PRs, workflows)

### Why it matters:

- Instructions enforce coding standards and architectural patterns
- Agents accelerate repetitive tasks (bug fixing, feature implementation)
- Prompt templates ensure consistency across team
- File-specific instructions apply framework best practices automatically

### Best practices:

- **Central instructions file**: `.github/copilot-instructions.md` for project-wide rules
- **Prompt templates**: Create `.prompt.md` files for common workflows (see our `bug-fixing.prompt.md`, `introduction.prompt.md`)
- **Custom agents**: Define `.agent.md` files with specific tool configurations (see our `beast.agent.md` with 20+ tools)
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
```

**2. Prompt Templates** (`.github/prompts/`):

- `bug-fixing.prompt.md` - Systematic bug diagnosis and fix workflow
- `introduction.prompt.md` - Project onboarding for new contributors
- **Source**: Custom-created with GitHub Copilot by analyzing this project's requirements, architecture and patterns

**3. Custom Agents** (`.github/agents/`):

- `beast.agent.md` - Agent mode with 20+ tools for autonomous problem-solving
  - Includes: codebase search, test execution, terminal commands, web fetch
  - Configured with `mode: agent` for multi-step autonomous work
  - **Source**: [Beast Mode](https://github.com/github/awesome-copilot/blob/main/agents/4.1-Beast.agent.md)

**4. File-Specific Instructions** (`.github/instructions/`):

- `nextjs.instructions.md` - Next.js 14 App Router best practices
  - Applied to all files via glob pattern `**`
  - Enforces Server/Client Component patterns
  - **Source**: [GitHub Awesome Copilot](https://github.com/github/awesome-copilot/blob/main/instructions/nextjs.instructions.md)

---
