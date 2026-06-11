---
name: usability-heuristics
description: Evaluate UI changes against Nielsen/Norman usability heuristics.
---

# usability-heuristics

## 10 Usability Heuristics (Nielsen)

1. **Visibility of system status** — keep users informed with timely feedback.
2. **Match between system and real world** — use familiar language and conventions.
3. **User control and freedom** — support undo/redo, easy exit points.
4. **Consistency and standards** — follow platform and internal conventions.
5. **Error prevention** — eliminate error-prone conditions; confirm before destructive actions.
6. **Recognition rather than recall** — make objects, actions, and options visible.
7. **Flexibility and efficiency of use** — accelerators for expert users.
8. **Aesthetic and minimalist design** — no irrelevant information.
9. **Help users recognize, diagnose, and recover from errors** — plain-language error messages.
10. **Help and documentation** — searchable, task-focused, concise.

## Severity Rating

| Rating | Meaning |
|--------|---------|
| 0 | Not a usability issue |
| 1 | Cosmetic — fix if time allows |
| 2 | Minor — low priority |
| 3 | Major — important to fix, blocks ship |
| 4 | Catastrophic — must fix before ship |

## Evaluation Method

For each changed screen, walk through every heuristic. Record findings as:
- `[heuristic #] [severity] [description]`

Severity 3+ blocks the Ship gate. Address before declaring done.
