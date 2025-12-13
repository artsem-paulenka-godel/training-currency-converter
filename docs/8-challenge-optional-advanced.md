# Optional Advanced Tasks 🔴 Advanced

**Objective**: Practice additional AI-assisted development scenarios beyond the core challenges.

> ⚠️ **Prerequisites**: Complete at least challenges 1-5 before attempting these tasks.

---

## 📖 Background

These are **optional, independent tasks** for developers who want to explore more Copilot use cases. Each task focuses on a different aspect of AI-assisted development. Complete them in any order.

---

## 🎯 Tasks

### Task 1: E2E Testing with Playwright

Write end-to-end tests for the Currency Converter using Playwright.

**What to do:**

1. Ask Copilot to set up Playwright in the project
2. Create E2E tests covering:
   - Basic currency conversion flow
   - Currency swap functionality
   - Conversion history (save, view, clear)
3. Run tests and fix any failures

> 💡 **Tip**: You can enhance this by using Playwright MCP (Model Context Protocol) to allow Copilot to execute and analyze test results directly during the development process.

**Example prompt:**

```
@workspace Help me set up Playwright for E2E testing and create tests 
for the currency conversion flow. The tests should cover entering an 
amount, selecting currencies, and verifying the conversion result.
```

---

### Task 2: Code Review with Copilot

Use Copilot to review existing code and suggest improvements.

**What to do:**

1. Select a component or hook (e.g., `useConverter.ts` or `ConverterForm.tsx`)
2. Ask Copilot to review for:
   - Code quality and best practices
   - Performance issues
   - Accessibility concerns
   - Error handling gaps
3. Implement the suggested improvements

**Example prompt:**

```
#file:useConverter.ts
Review this hook for code quality, performance issues, and potential 
improvements. Focus on error handling and edge cases.
```

---

### Task 3: Refactoring Legacy Code

Practice refactoring with AI assistance by improving code structure.

**What to do:**

1. Identify code that could be improved (e.g., `utils/currency.ts`)
2. Ask Copilot to suggest refactoring opportunities:
   - Extract reusable functions
   - Improve type safety
   - Simplify complex logic
   - Add better error messages
3. Refactor while maintaining all existing tests

**Example prompt:**

```
#file:currency.ts
Suggest refactoring opportunities for this file. Focus on extracting 
reusable functions and improving type safety. Ensure changes don't 
break existing tests.
```

---

### Task 4: Security Vulnerability Detection

Use Copilot to identify and fix potential security issues.

**What to do:**

1. Ask Copilot to scan the codebase for security concerns:
   - Input validation gaps
   - XSS vulnerabilities
   - Insecure data handling
   - API security issues
2. Implement fixes for any issues found
3. Add tests to verify the security improvements

**Example prompt:**

```
@workspace Analyze this project for potential security vulnerabilities. 
Check for input validation issues, XSS risks, and insecure data handling 
in both frontend components and API routes.
```

---

### Task 5: Documentation Generation

Generate comprehensive documentation using AI.

**What to do:**

1. Add JSDoc comments to key functions and components
2. Generate API documentation for the `/api/rates` endpoint
3. Create a component documentation file describing props and usage
4. Update README with any missing information

**Example prompt:**

```
#file:useExchangeRates.ts
Add comprehensive JSDoc comments to all exported functions and types. 
Include parameter descriptions, return values, and usage examples.
```

---

### Task 6: CI/CD Pipeline Creation with GitHub Actions

Set up a continuous integration pipeline using GitHub Actions.

**What to do:**

1. Ask Copilot to create a GitHub Actions workflow file
2. Configure the pipeline to:
   - Run on push and pull requests to main branch
   - Install dependencies
   - Run linting (`npm run lint`)
   - Run tests (`npm test`)
3. Add status badges to README.md
4. Test the pipeline by creating a PR

**Example prompt:**

```
@workspace Create a GitHub Actions workflow for CI/CD that runs lint 
and tests on every push and pull request to main. Use Node.js 18/20 
and include caching for npm dependencies.
```

**Expected file structure:**
```
.github/
  workflows/
    ci.yml
```

---

### Task 7: Database Integration & Migration

Add persistent storage with Prisma ORM for conversion history.

**What to do:**

1. Ask Copilot to set up Prisma with any Database (e.g., SQLite)
2. Create a schema for storing conversion history:
   - `id`, `fromCurrency`, `toCurrency`, `amount`, `result`, `rate`, `timestamp`
3. Generate and run migrations
4. Create API routes for CRUD operations
5. Update the `ConversionHistory` component to use the database

> 💡 **Tip**: MCP (Model Context Protocol) is available for different databases like PostgreSQL, MySQL, and other. These MCPs allow Copilot to connect directly to your database, execute queries, and get real data during development, making it easier to build and test database features. 

**Example prompt:**

```
@workspace Help me set up Prisma with any Database (e.g., SQLite) for this Next.js project. 
Create a schema for storing currency conversion history with fields: 
id, fromCurrency, toCurrency, amount, result, rate, and timestamp.
```

---

### Task 8: Accessibility (A11y) Audit

Perform a comprehensive accessibility audit and implement improvements.

**What to do:**

1. Ask Copilot to audit the app for WCAG 2.1 compliance
2. Check and fix:
   - Keyboard navigation (Tab order, focus management)
   - Screen reader support (ARIA labels, semantic HTML)
   - Color contrast ratios
   - Form accessibility (labels, error announcements)
3. Add skip links and focus indicators
4. Test with browser accessibility tools (Lighthouse, axe DevTools)
5. Create an accessibility testing checklist

**Example prompt:**

```
@workspace Perform an accessibility audit on this currency converter app. 
Check for WCAG 2.1 AA compliance issues including keyboard navigation, 
screen reader support, color contrast, and form accessibility. Provide 
specific fixes for any issues found.
```

**Key areas to check:**
- All interactive elements are keyboard accessible
- Form inputs have associated labels
- Error messages are announced to screen readers
- Sufficient color contrast (4.5:1 for normal text)
- Focus states are visible

---

## ✅ Success Criteria

Complete tasks:

- [ ] **E2E Testing**: Playwright is configured and at least 3 E2E tests pass
- [ ] **Code Review**: Reviewed at least one file and implemented improvements
- [ ] **Refactoring**: Refactored code while keeping all existing tests green
- [ ] **Security**: Identified and fixed at least one security concern
- [ ] **Documentation**: Added JSDoc to at least one file with 5+ functions
- [ ] **CI/CD Pipeline**: GitHub Actions workflow runs lint and tests successfully
- [ ] **Database Integration**: Prisma + SQLite configured with conversion history persistence
- [ ] **Accessibility**: Passed Lighthouse accessibility audit with score ≥ 90

---

## 💡 Tips

- These tasks are independent — start with whichever interests you most
- Use `@workspace` for project-wide analysis
- Use `#file:filename` for focused file-specific tasks
- Commit after each task to track your progress
- Compare your approach with AI suggestions, but use your judgment

---

[← Back to Challenges](challenges.md)
