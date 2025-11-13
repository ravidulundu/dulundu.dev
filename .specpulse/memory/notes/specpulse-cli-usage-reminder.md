# SpecPulse CLI Usage - CRITICAL REMINDER

## ⚠️ ALWAYS USE SPECPULSE CLI - DO NOT MANUALLY CREATE FEATURES

**Created**: 2025-11-13
**Importance**: CRITICAL - User explicitly requested this multiple times
**Last Violation**: Feature 016 (manually created instead of using CLI)

## Correct Workflow

### Starting a New Feature
```bash
# 1. Initialize feature with AI command
specpulse sp-pulse "Feature Name Here"

# This will:
# - Auto-increment feature counter
# - Create proper directory structure
# - Track in SpecPulse system
# - Add to context
```

### Creating Documentation
```bash
# 2. Create specification
specpulse sp-spec "Feature description"

# 3. Create implementation plan
specpulse sp-plan

# 4. Break down into tasks
specpulse sp-task
```

### Continuing Existing Feature
```bash
specpulse feature continue <feature-id>
```

### Listing Features
```bash
specpulse feature list
```

## ❌ WRONG - What NOT to Do

```bash
# DON'T do manual operations:
echo "016" > .specpulse/feature_counter.txt  # ❌ WRONG
mkdir -p .specpulse/specs/016-...            # ❌ WRONG
# Using Write tool for markdown files         # ❌ WRONG
```

## Why This Matters

1. **Cost**: User mentioned "bir suru para kaybettiyorsun bana" (you're costing me a lot of money)
2. **Tracking**: SpecPulse CLI maintains proper feature tracking
3. **Consistency**: Ensures standardized workflow
4. **Context**: CLI updates context.md automatically

## User's Exact Words (Turkish)

> "surekli neden hatirlatmak zorundayim sana bunu unutmamani soylemistim yahu bir suru para kaybettiyorsun bana"
> (Translation: "why do I have to constantly remind you, I told you not to forget this, you're losing me a lot of money")

> "kesinlikle duzelt unutmaman icin hafizani kullan dostum senin hafiza dosyan var."
> (Translation: "definitely fix it, use your memory so you don't forget, you have a memory file.")

## Action Items for Future Features

1. **Before starting ANY new feature**: Check this file
2. **Use**: `specpulse sp-pulse "Feature Name"`
3. **Never**: Create directories/files manually
4. **Always**: Let SpecPulse CLI handle feature management

## Feature 016 Retrospective

**What Happened**: Manually created all documentation files
**Should Have Done**: Used `specpulse sp-pulse "Portfolio-First Redesign"`
**Impact**: Extra token usage, inconsistent tracking, frustrated user
**Lesson**: ALWAYS use CLI, no exceptions

---

**Note to Self (Claude)**: Read this file before starting ANY new feature. No excuses. The user has been very patient but explicitly said this wastes money. Use the CLI.
