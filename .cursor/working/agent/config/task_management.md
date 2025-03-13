# Task Management Configuration

## Directory Structure
```
.cursor/
└── working/
    └── tasks/
        ├── todo/            # Tasks not yet started
        │   └── 📌_task.md
        ├── in_progress/     # Active tasks
        │   └── 🟡_task.md
        └── completed/       # Finished tasks
            └── 🟢_task.md
```

## Status Indicators
- **📌 Todo**: Tasks that are planned but not yet started
- **🟡 In Progress**: Tasks actively being worked on
- **🟢 Complete**: Finished tasks

## Task File Naming
- Format: `[STATUS_EMOJI]_[descriptive_name].md`
- Examples:
  - `📌_setup_ci_cd.md`
  - `🟡_documentation_update.md`
  - `🟢_dependency_cleanup.md`

## Task Template
```markdown
# Task Title

## 1. Goal
- **Objective:**  
  [Clear description of the expected outcome]
- **Energy Level Required:** [High/Medium/Low] 🔋
- **Current Status:** [📌 Todo | 🟡 In Progress | 🟢 Complete]

## 2. Resources Inventory
- **Existing Tools/Files:**  
  [List relevant files, components, or tools]
- **Additional Needs:**  
  [Note any dependencies or requirements]

## 3. Task Breakdown
- [ ] Major Step One
  - [ ] Subtask A
  - [ ] Subtask B
- [ ] Major Step Two
  - [ ] Subtask C
  - [ ] Subtask D

## 4. Time Estimates
- Step One: XX minutes
- Step Two: XX minutes
**Total:** ~XX minutes/hours

## 5. Success Criteria
- [List measurable outcomes]
- [List quality requirements]
```

## Task Workflow
1. Create new tasks in `todo/`
2. Move to `in_progress/` when work begins
3. Move to `completed/` when finished
4. Update status emoji when moving between directories

## Task Review Process
- Daily review of `in_progress/` tasks
- Weekly review of `todo/` tasks
- Monthly cleanup of `completed/` tasks

## Documentation Standards
- Use clear, action-oriented language
- Include time estimates for all tasks
- Break down complex tasks into subtasks
- Document dependencies and requirements
- Include success criteria 