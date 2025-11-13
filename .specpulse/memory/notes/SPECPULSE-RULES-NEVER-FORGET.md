# SpecPulse Rules - NEVER FORGET

**Created:** 2025-11-12
**Purpose:** Permanent reminder to NEVER return to manual methods

---

## ✅ CORRECT SpecPulse Workflow

### 1. Feature Initialization
```bash
specpulse feature init <feature-name>
```
**CLI Does:**
- Creates `.specpulse/specs/###-feature-name/`
- Creates `.specpulse/plans/###-feature-name/`
- Creates `.specpulse/tasks/###-feature-name/`
- Updates `.specpulse/memory/context.md` (AUTOMATIC!)
- Creates Git branch

### 2. Specification Creation
```bash
specpulse spec create "<description>"
```
**CLI Does:**
- Creates empty `spec-001.md` template

**YOU Do:**
- Fill `spec-001.md` with detailed requirements

### 3. Plan Creation
```bash
specpulse plan create "<description>"
```
**CLI Does:**
- Creates empty `plan-001.md` template

**YOU Do:**
- Fill `plan-001.md` with implementation plan

### 4. Task Breakdown
```bash
specpulse task breakdown <plan-id>
```
**CLI Does:**
- Creates `task-001.md`, `task-002.md`, etc.

**YOU Do:**
- Fill task files with implementation steps

---

## ❌ NEVER DO THESE:

### 1. NEVER Edit These Files:
- ❌ `.specpulse/memory/context.md` (CLI manages!)
- ❌ `.specpulse/templates/` (CLI manages!)
- ❌ `.specpulse/INDEX.md` (DOESN'T EXIST IN SPECPULSE!)
- ❌ Any file in `.specpulse/` root (except memory/notes/)

### 2. NEVER Create These Files:
- ❌ `INDEX.md` (Not part of SpecPulse!)
- ❌ Manual spec/plan/task files outside numbered folders
- ❌ Any custom tracking files in `.specpulse/`

### 3. NEVER Use These Patterns:
- ❌ `Edit .specpulse/INDEX.md` (file shouldn't exist!)
- ❌ `Read .specpulse/memory/context.md` then edit it
- ❌ Manually create directories in `.specpulse/`

---

## ✅ YOU CAN Edit:

### Manual Editing Allowed:
- ✅ `specs/###-feature-name/spec-001.md` (content)
- ✅ `plans/###-feature-name/plan-001.md` (content)
- ✅ `tasks/###-feature-name/task-001.md` (content)
- ✅ `memory/notes/*.md` (your notes)

### CLI Manages:
- ✅ Directory structure
- ✅ `memory/context.md` (feature tracking)
- ✅ Template creation
- ✅ Metadata and IDs

---

## 📚 How SpecPulse Works

### CLI-First Architecture:
1. **CLI creates structure** (directories, templates)
2. **You fill content** (specs, plans, tasks)
3. **CLI tracks state** (context.md automatic)
4. **You never touch** (context.md, templates, root files)

### File Roles:
- **context.md**: Feature tracking (CLI manages)
  - Active feature info
  - Recent activity log
  - Progress percentages

- **spec-001.md**: Requirements (YOU write)
  - Overview, goals, requirements
  - User stories, acceptance criteria

- **plan-001.md**: Implementation (YOU write)
  - Architecture, tech stack
  - Testing strategy, deployment

- **task-001.md**: Steps (YOU write)
  - Detailed implementation steps
  - Dependencies, time estimates

---

## 🚫 What INDEX.md Was (WRONG!)

**INDEX.md was a MANUAL system** - not part of SpecPulse!

### What It Tried To Do:
- Track features manually
- Manually update progress
- Manually add deliverables
- Manually maintain status

### Why It's Wrong:
- SpecPulse CLI does all this automatically
- Creates duplicate tracking
- Causes inconsistencies
- Violates SpecPulse architecture

### What SpecPulse Uses Instead:
- `memory/context.md` (CLI automatic)
- `specpulse list-specs` (CLI command)
- `specpulse doctor` (CLI health check)

---

## ✅ Verification Commands

### Check SpecPulse Health:
```bash
specpulse doctor
# Should pass all 5 checks
```

### List All Specs:
```bash
specpulse list-specs
# Shows all spec files
```

### View Feature Context:
```bash
cat .specpulse/memory/context.md
# CLI-managed, READ ONLY
```

### Check Current Feature:
```bash
# SpecPulse auto-detects from:
# 1. memory/context.md
# 2. Git branch name
# 3. Most recent feature directory
```

---

## 🎯 Example: Feature 013 (Production Readiness)

### ✅ What Was Done CORRECTLY:
```bash
# 1. CLI init
specpulse feature init production-readiness-fixes
# Created: specs/013-production-readiness-fixes/
# Created: plans/013-production-readiness-fixes/
# Created: tasks/013-production-readiness-fixes/
# Updated: memory/context.md (automatic!)

# 2. Write spec content (manual)
# Edited: specs/013-production-readiness-fixes/spec-001.md
# Filled with 400+ lines of audit requirements
```

### ❌ What Was Done WRONG:
```bash
# Edited INDEX.md (3 times!)
Edit .specpulse/INDEX.md
# WRONG! This file shouldn't exist!

# Solution:
# Moved to: memory/notes/INDEX-backup-manual-method-2025-11-12.md
```

---

## 💡 Remember Forever:

1. **CLI FIRST** - Always start with `specpulse` commands
2. **YOU FILL** - Only edit spec/plan/task CONTENT
3. **NEVER TOUCH** - context.md, templates, INDEX.md
4. **TRUST CLI** - It manages structure automatically

---

## 📞 If You Forget:

**Question:** Should I edit INDEX.md?
**Answer:** NO! INDEX.md doesn't exist in SpecPulse!

**Question:** Should I update context.md?
**Answer:** NO! CLI manages it automatically!

**Question:** Where do I track features?
**Answer:** `specpulse list-specs` - CLI does it!

**Question:** What can I edit?
**Answer:** Only spec/plan/task CONTENT!

---

**NEVER FORGET AGAIN!** 🎯
