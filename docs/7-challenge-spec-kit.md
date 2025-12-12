# Spec-Kit 🔴 Advanced

**Objective**: Use GitHub's Spec-Kit for spec-driven development with structured AI workflows.

> ⚠️ **Prerequisites**: Complete beginner and intermediate challenges first. Familiarity with Copilot custom instructions is required.

---

## 📖 Background

### What is [Spec-Kit](https://github.com/github/spec-kit)?

A toolkit for spec-driven development that helps you:
- Define project standards (constitution)
- Create specifications before coding
- Generate implementation plans and tasks
- Maintain consistency across features

### Prerequisites

- Python 3.8+ and Node.js 18+
- GitHub Copilot
- VS Code

### Installation

**1. Install UV (Python Package Manager)**

```bash
# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Mac/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**2. Install Specify CLI**

```bash
uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git
```

**3. Initialize in Project**

```bash
cd your-project
uvx --from git+https://github.com/github/spec-kit.git specify init .
```

### Slash Commands

| Command | Purpose |
|---------|---------|
| `/speckit.constitution` | Define project standards |
| `/speckit.specify` | Create feature specification |
| `/speckit.plan` | Generate implementation plan |
| `/speckit.tasks` | Break into actionable tasks |
| `/speckit.implement` | Execute implementation |
| `/speckit.clarify` | Ask clarifying questions |
| `/speckit.analyze` | Check artifact consistency |

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `specify` not found | Add UV tools to PATH: `uv tool update-shell` |
| Slash commands missing | Restart VS Code, check `.github/prompts/` exists |
| Permission errors (Windows) | `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` |

---

## 🎯 Your Task

### Step 1: Install Spec-Kit

1. Install UV package manager
2. Install Specify CLI
3. Initialize in this project

### Step 2: Create Constitution

Define project standards:

```
/speckit.constitution Create principles for code quality,
testing standards (80% coverage), and accessibility (WCAG 2.1 AA)
```

### Step 3: Create Feature Specification

Pick a new feature and create a spec:

```
/speckit.specify Add "Favorite Currencies" feature:
- Users can mark currencies as favorites
- Favorites appear at top of selectors
- Maximum 5 favorites
- Persist in localStorage
```

### Step 4: Generate Plan and Tasks

```
/speckit.plan specs/favorite-currencies.spec.md
```

```
/speckit.tasks specs/favorite-currencies.spec.md
```

### Step 5: Implement

```
/speckit.implement specs/favorite-currencies.tasks.md
```

---

## ✅ Success Criteria

- [ ] Spec-Kit installed and initialized
- [ ] Constitution file created
- [ ] Feature spec → plan → tasks workflow completed
- [ ] Feature implemented following generated tasks

---

[← Back to Challenges](challenges.md)
