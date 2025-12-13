# Copilot Best Practices 📖 Reference

A reference guide for effective AI-assisted development with GitHub Copilot.

---

## Table of Contents

- [Key Concepts](#key-concepts)
- [1. Adding and Managing Context](#1-adding-and-managing-context)
- [2. Working with Large Files and Long Operations](#2-working-with-large-files-and-long-operations)
- [3. Change Management and Safe Rollback](#3-change-management-and-safe-rollback)
- [4. Copilot Limitations and Issues](#4-copilot-limitations-and-issues)
- [5. Inline Mode and Keyboard Shortcuts](#5-inline-mode-and-keyboard-shortcuts)
- [6. Working with Translation](#6-working-with-translation)
- [7. Additional Copilot Features](#7-additional-copilot-features)

---

## Key Concepts

| Concept | Purpose |
|---------|---------|
| **Context** | Files/code you share with Copilot |
| **Instructions** | Project-specific rules for AI |
| **Agents** | Specialized AI behaviors |
| **Slash Commands** | Quick actions like `/explain`, `/test` |

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

- Context directly impacts the quality of Copilot's responses.
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

| Action | Shortcut |
|--------|----------|
| Inline command | Ctrl + I |
| Open Copilot Chat | Shift + Ctrl + I |
| Exit inline mode | ESC |
| Accept suggestion | Tab |

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

- Use DeepL or VS Code's built-in translator for long texts.
- Keep prompts in one language.
- Avoid mixing languages in a single prompt.

### Why it matters:

- Mixed languages reduce generation accuracy.

---

## 7. Advanced Copilot Capabilities

Beyond chat and code completion, Copilot offers powerful autonomous agents and tools:

### Copilot Coding Agent

**What it does:**
Copilot works independently in the background to complete development tasks. It can fix bugs, implement features, improve test coverage, and update documentation. The agent operates in a sandbox environment, makes changes, and opens a pull request for your review.

**When to use:**
- Assign straightforward bugs or feature requests from GitHub Issues
- Ask Copilot to fix specific problems via `@copilot` in PR comments
- Delegate repetitive tasks (documentation updates, test improvements)

**Example:**
```
Issue: "Add password validation to login form"
Assign to @copilot → Agent creates PR with validation logic and tests
```

### Copilot Code Review

**What it does:**
Copilot reviews pull requests and provides actionable feedback on code quality, security, and best practices. Can integrate with static analysis tools (CodeQL, ESLint, PMD) for high-signal findings.

**When to use:**
- Request reviews on pull requests (available in VS Code, GitHub.com, JetBrains IDEs)
- Set up automatic reviews for all new PRs in your repository
- Focus on security, performance, and code quality issues

**Example:**
```
Request review → Copilot analyzes code for vulnerabilities, duplicates, and improvements
```

### MCP (Model Context Protocol)

**What it does:**
Extends Copilot with custom tool integrations and external data sources. Allows Copilot to access specialized tools, APIs, or repositories beyond the current workspace.

**When to use:**
- Connect to external databases, APIs, or specialized tools
- Create custom integrations for specific workflows
- Extend Copilot coding agent with additional capabilities

**Example:**
```
MCP integration with Playwright: Copilot can run tests and see results during development
MCP integration with database tools: Copilot can query schemas for accurate migrations
```

### Vision/Image Analysis

**What it does:**
Copilot can analyze screenshots and images in chat conversations to understand UI bugs, design implementations, or error states visually.

**When to use:**
- Debugging UI issues (paste screenshot, ask "why is this button misaligned?")
- Design implementation (show mockup, ask Copilot to implement the layout)
- Error investigation (share error screenshots for context)

**Example:**
```
Paste screenshot of broken layout → Explain what's wrong
Copilot analyzes visual context and suggests CSS fixes
```

### Simple Browser

**What it does:**
Built-in VS Code tool that lets Copilot load and analyze live web pages, extracting HTML, CSS, and JavaScript without screenshots. Useful for understanding page structure and styling.

**When to use:**
- Analyzing live localhost pages during development (http://localhost:3000)
- Understanding third-party website structure for integration
- Extracting page content for analysis without manual copying

**Example:**
```
"Analyze the form structure on http://localhost:3000/login and suggest validation improvements"
Copilot extracts form HTML and can recommend changes without a screenshot
```

---

## Next Steps

Ready to practice? → [Copilot Customisation Challenge](2-challenge-customisation.md)

---

[← Back to Challenges](challenges.md)
