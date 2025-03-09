# Claude's Memory File

## Nuxt Component Namespacing

**IMPORTANT**: In Nuxt, component files are auto-imported based on their directory structure using this pattern:

1. A component at `components/MyComponent.vue` is available as `<MyComponent />`
2. A component at `components/Folder/Component.vue` is available as `<FolderComponent />`

To avoid namespace collisions:
- Use directory names for category/grouping: `Badge/Card.vue` → `<BadgeCard />`
- Never place components in directories with the same name: `Badge/Badge.vue` would cause a `BadgeBadge` collision
- No need to manually import Vue components - they're automatically available in templates

## Project-Specific Patterns

- Badge components follow the `Badge/[Name].vue` pattern:
  - `Badge/Card.vue` → `<BadgeCard />`
  - `Badge/Form.vue` → `<BadgeForm />`
  - `Badge/List.vue` → `<BadgeList />`

Never manually import components in templates - rely on Nuxt's auto-imports.