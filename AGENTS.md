# AGENTS.md - Agentic Coding Guidelines

## Project Overview

Background Maker is a Tauri desktop application (React + TypeScript frontend, Rust backend) for creating custom desktop wallpapers with backgrounds, images, borders, and text overlays.

## Build/Lint/Test Commands

### Frontend (React + TypeScript + Vite)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint on frontend code |
| `npm run preview` | Preview production build locally |

### Tauri (Desktop App)

| Command | Description |
|---------|-------------|
| `npm run tauri:dev` | Run app in development mode |
| `npm run tauri:build` | Build production desktop app |

### Running a Single Test

This project currently has **no test framework** configured. If adding tests:
- Use Vitest (matches Vite ecosystem)
- Run a single test: `npx vitest run <file>`

### Rust Backend

```bash
cd src-tauri
cargo build     # Build Rust code
cargo check     # Type-check Rust code
cargo test      # Run Rust tests
```

---

## Code Style Guidelines

### General Principles

- **No comments** unless explicitly required by a reviewer
- **No unused variables** - TypeScript `noUnusedLocals` and `noUnusedParameters` are enabled
- **Strict TypeScript** - All strict checks enabled in tsconfig

### TypeScript

- Use `type` instead of `interface` for type aliases (required by `erasableSyntaxOnly`)
- Use explicit return types for exported functions
- Enable strict null checks - never use `null` or `undefined` unless necessary

```typescript
// Good
type WallpaperConfig = { ... }
interface UseImageTransformReturn { ... }

// Bad
interface Foo { ... }  // use type instead
```

### React

- Use function components with hooks
- Name custom hooks with `use` prefix
- Destructure props for readability

```typescript
// Good
export function ControlPanel({
  config,
  onConfigChange,
  onExport,
}: ControlPanelProps) {
  // ...
}
```

### Imports

Organize imports in this order:

1. External libraries (React, react-colorful, etc.)
2. Internal components/hooks
3. Types (use `import type`)
4. CSS/Styles

```typescript
import { useCallback, useState } from 'react';
import { WallpaperCanvas } from './components/WallpaperCanvas';
import { useImageTransform } from './hooks/useImageTransform';
import type { WallpaperConfig } from './types';
import './App.css';
```

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `WallpaperCanvas.tsx`, `ColorPicker.tsx` |
| Hooks | camelCase + use prefix | `useImageTransform.ts` |
| Utils | camelCase | `utils.ts` |
| Types | camelCase or PascalCase | `types.ts` |

### CSS/Class Names

- Use BEM-like naming with double underscores for block elements
- Prefix with component name

```css
.control-panel { }
.control-panel__header { }
.control-panel__body { }
.control-section__title { }
```

### Error Handling

- Use try/catch for async operations
- Provide user-friendly error messages in UI
- Log errors appropriately (project uses `log` crate in Rust)

### Naming Conventions

- Variables/functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase
- Files: kebab-case or PascalCase (for components)

---

## Git & Commit Conventions

### All commits MUST use Conventional Commits

Format: `<type>(<scope>): <description>`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Build, tooling, dependencies

**Examples:**
```
feat(canvas): add zoom functionality with scroll wheel
fix(export): handle missing image gracefully
docs(readme): update installation instructions
style(control-panel): simplify border radius input
refactor(types): consolidate screen size definitions
```

### Branch Naming

- Feature: `feature/<description>`
- Bugfix: `fix/<description>`
- Release: `release/v<version>`

---

## Release Process

This project uses **release-please** for automated versioning:

- Commits with `feat:` bump MINOR version
- Commits with `fix:` bump PATCH version
- Commits with `BREAK CHANGE:` bump MAJOR version
- Release PRs are auto-generated; merge to trigger release

Version is stored in:
- `package.json`
- `src-tauri/Cargo.toml`
- `src-tauri/tauri.conf.json`

---

## Dependencies

### Frontend
- React 19
- react-colorful (color picker)
- Vite 7
- TypeScript ~5.9.3
- ESLint 9

### Backend (Rust)
- Tauri 2.10
- tauri-plugin-dialog
- tauri-plugin-fs
- tauri-plugin-log
- serde/serde_json
