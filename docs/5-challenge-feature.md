# Feature Development 🟡 Intermediate

**Objective**: Practice gathering requirements from incomplete specs using AI clarification.

---

## 📖 Background

Real-world feature requests are often vague. AI can help you ask the right questions and create complete specifications before coding.

### Scenario

You receive a vague feature request:

> "Add Refresh Rates button to the currency converter."

## 🎯 Your Task

### Step 1: Start with Vague Request

1. Pick a feature idea (or use "Refresh Rates button")
2. Write a one-line vague request
3. Give it to Copilot

### Step 2: Answer AI's Questions

1. Let AI ask clarifying questions
2. Answer each question thoughtfully
3. Add constraints and edge cases

### Step 3: Generate Complete Spec

1. Ask AI to produce a complete specification(SRS)
2. Ensure it includes:
   - Acceptance criteria
   - Files to change
   - Test requirements

### Step 4: Implement the Feature

1. Follow the generated spec
2. Create/modify the required files
3. Add tests as specified

### Example AI Clarification Flow

**Prompt:**
```
I need to add a "Refresh Rates" button to the currency converter.
Ask me clarifying questions to understand the requirements.
```

**AI Questions:**
```
To create a complete specification, I need to clarify:

1. Where should the button be placed?
2. Should it show loading state while fetching?
3. What happens if the API call fails?
4. Should conversion recalculate after refresh?
5. Icon-only or with text label?
```

**Your Answers:**
```
1. After the second currency selector, same row
2. Yes, spinner and disable button
3. Show error message, keep previous rates
4. Yes, auto-recalculate
5. Icon-only, match SwapButton style
```

---

## ✅ Success Criteria

- [ ] Started with vague request
- [ ] AI asked clarifying questions
- [ ] Produced complete spec with acceptance criteria
- [ ] Implemented working feature
- [ ] Added tests

---

[← Back to Challenges](challenges.md)
