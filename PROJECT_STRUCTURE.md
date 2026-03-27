# Project Structure & Organization Guide

## 📁 Directory Tree

```
alibi-architect/
├── src/                              # Source code directory
│   ├── components/
│   │   └── Workbench.svelte          # Main application component
│   │                                  #   - Input controls (seed, elaboration, tone)
│   │                                  #   - Tone calibration wheel
│   │                                  #   - Output terminal display
│   │                                  #   - Bottom navigation bar
│   │
│   ├── routes/
│   │   ├── +layout.svelte             # Root layout wrapper
│   │   ├── +page.svelte               # Home page entry point
│   │   └── layout.css                 # Global styles & theme variables
│   │
│   ├── lib/
│   │   ├── assets/
│   │   │   └── favicon.svg
│   │   └── index.ts                   # Exported utilities
│   │
│   ├── app.html                       # HTML template shell
│   └── app.d.ts                       # Global TypeScript types
│
├── static/                            # Static assets (no processing)
│   ├── icons/
│   │   └── icon.svg                   # App icon
│   └── robots.txt                     # SEO robots directive
│
├── docs/                              # Documentation (future)
│   ├── css-specifications/            # CSS-related docs
│   ├── implementation-reports/        # Implementation docs
│   └── design-specs/                  # Design specifications
│
├── Configuration Files
│   ├── .gitignore                     # Git ignore rules
│   ├── .npmrc                         # npm registry config
│   ├── .prettierrc                    # Code formatter config
│   ├── .prettierignore                # Prettier ignore patterns
│   ├── eslint.config.js               # ESLint rules
│   ├── svelte.config.js               # SvelteKit config
│   ├── vite.config.ts                 # Vite bundler config
│   ├── tsconfig.json                  # TypeScript config
│   └── package.json                   # Dependencies & scripts
│
├── Documentation Files
│   ├── README.md                      # Project overview
│   ├── PROJECT_STRUCTURE.md           # This file
│   ├── CSS_CHANGES_SUMMARY.md         # CSS improvements quick ref
│   ├── OUTPUT_TERMINAL_CSS_CROSS_CHECK.md  # Detailed CSS analysis
│   ├── IMPLEMENTATION_VERIFICATION.md      # Testing & verification
│   ├── COMPLETION_REPORT.md          # Project completion details
│   └── README_CHANGES.md              # Executive summary
│
└── Root Files
    ├── package-lock.json              # Dependency lock file
    └── .vscode/                       # VS Code settings
        ├── extensions.json            # Recommended extensions
        └── settings.json              # Editor settings
```

## 🗂️ File Organization Logic

### Source Code (`src/`)

#### `components/Workbench.svelte`
**Purpose**: Main application interface
**Sections**:
1. Script block: State management (tone, elaboration, language, input)
2. Header: Logo, language selector, visualizers
3. Main content:
   - Input section (seed prompt)
   - Tone calibration wheel
   - Parameter controls
   - Output terminal
4. Navigation: Bottom bar with 4 buttons
5. Styles: Inline Tailwind CSS classes

#### `routes/+layout.svelte`
**Purpose**: Global layout wrapper
**Contains**:
- Header component shell
- Main content area
- Footer/nav area
- Global state initialization

#### `routes/+page.svelte`
**Purpose**: Home page
**Contains**:
- Workbench component import
- Page metadata

#### `routes/layout.css`
**Purpose**: Global theme and styling
**Defines**:
- Color variables
- Font imports
- Shadow systems
- Tailwind theme extensions
- Range slider styling

#### `lib/index.ts`
**Purpose**: Exported utilities and types
**Contains**:
- Helper functions
- Type definitions
- Constants

### Static Assets (`static/`)

#### `icons/icon.svg`
**Purpose**: App icon for PWA manifest
**Usage**: Home screen icon, favicon

#### `robots.txt`
**Purpose**: SEO robot instructions
**Content**: Crawl directives for search engines

### Documentation Root Level

#### Primary Files
- `README.md` - Start here for project overview
- `PROJECT_STRUCTURE.md` - This file (navigation guide)

#### CSS Implementation Docs
- `CSS_CHANGES_SUMMARY.md` - Quick reference of 14 CSS changes
- `OUTPUT_TERMINAL_CSS_CROSS_CHECK.md` - Detailed Figma spec analysis
- *Use when*: Reviewing CSS changes or understanding output terminal styling

#### Implementation & Verification
- `IMPLEMENTATION_VERIFICATION.md` - Complete testing report
- `COMPLETION_REPORT.md` - Full project completion documentation
- `README_CHANGES.md` - Executive summary for stakeholders
- *Use when*: Understanding what was implemented and tested

### Configuration Files

#### Build & Runtime
- `svelte.config.js` - SvelteKit adapter and options
- `vite.config.ts` - Bundler configuration
- `package.json` - Dependencies and npm scripts

#### Code Quality
- `eslint.config.js` - Linting rules
- `.prettierrc` - Code formatter settings
- `.prettierignore` - Prettier exceptions
- `tsconfig.json` - TypeScript compiler options

#### Environment & VCS
- `.gitignore` - Version control exclusions
- `.npmrc` - npm registry settings
- `.vscode/` - Editor recommendations

## 📊 Component Hierarchy

```
App (app.html)
└── +layout.svelte (Global Layout)
    └── +page.svelte (Home Page)
        └── Workbench.svelte (Main Component)
            ├── Header Section
            │   ├── Logo
            │   ├── Language Selector
            │   └── Visualizers
            ├── Input Section
            │   ├── Seed Prompt Textarea
            │   └── Model/Elaboration Info
            ├── Control Section
            │   ├── Tone Calibration Wheel
            │   ├── Elaboration Slider
            │   ├── Detail Density Controls
            │   └── API Key Input
            ├── Output Terminal
            │   ├── Header (Status Indicators)
            │   ├── Body (Output Content)
            │   └── Footer (Believability Index)
            └── Navigation Bar
                ├── Home Button
                ├── Library Button
                ├── Rankings Button
                └── Export Button
```

## 🎯 Navigation Guide

### Finding Specific Features

**Want to modify the Output Terminal styling?**
→ `src/components/Workbench.svelte` lines 1180-1242
→ Reference: `OUTPUT_TERMINAL_CSS_CROSS_CHECK.md`

**Need CSS implementation details?**
→ `CSS_CHANGES_SUMMARY.md` (quick reference)
→ `OUTPUT_TERMINAL_CSS_CROSS_CHECK.md` (detailed analysis)

**Understanding what was changed?**
→ `README_CHANGES.md` (executive overview)
→ `IMPLEMENTATION_VERIFICATION.md` (complete details)

**Setting up development environment?**
→ `README.md` (Getting Started section)
→ `package.json` (dependencies and scripts)

**Code style and standards?**
→ `.prettierrc` (formatting rules)
→ `eslint.config.js` (linting rules)
→ `tsconfig.json` (TypeScript settings)

## 📝 File Purposes Summary

| File | Purpose | Last Modified |
|------|---------|---------------|
| `Workbench.svelte` | Main UI component | 2024 |
| `layout.css` | Global styles & theme | 2024 |
| `README.md` | Project overview | 2024 |
| `CSS_CHANGES_SUMMARY.md` | CSS quick reference | 2024 |
| `IMPLEMENTATION_VERIFICATION.md` | Testing report | 2024 |
| `svelte.config.js` | Build configuration | Setup |
| `vite.config.ts` | Bundle configuration | Setup |
| `package.json` | Dependencies | Setup |

## 🔄 File Dependencies

```
package.json
    ↓
svelte.config.js + vite.config.ts
    ↓
src/app.html
    ↓
src/routes/+layout.svelte
    ↓
src/routes/+page.svelte
    ↓
src/components/Workbench.svelte
    ↓
src/routes/layout.css (styles)
```

## 📚 Documentation Reading Order

1. **Quick Start**: `README.md` (Getting Started section)
2. **What Changed**: `README_CHANGES.md` (executive summary)
3. **CSS Details**: `CSS_CHANGES_SUMMARY.md` (if modifying styles)
4. **Deep Dive**: `OUTPUT_TERMINAL_CSS_CROSS_CHECK.md` (detailed specs)
5. **Verification**: `IMPLEMENTATION_VERIFICATION.md` (testing proof)
6. **Complete Report**: `COMPLETION_REPORT.md` (full details)

## 🎨 Component Customization Paths

### Styling
1. Global theme → `src/routes/layout.css`
2. Component styles → Inline Tailwind classes in `.svelte` file
3. Font changes → `layout.css` @import section

### Layout Changes
1. Main structure → `src/components/Workbench.svelte`
2. Page wrapper → `src/routes/+layout.svelte`

### Adding Features
1. New component → `src/components/[ComponentName].svelte`
2. New utilities → `src/lib/[utilityName].ts`
3. New route → `src/routes/[route]/+page.svelte`

## 🚀 Deployment Files

Files needed for production:
- ✅ All files in `src/`
- ✅ Configuration files (svelte.config.js, vite.config.ts, etc.)
- ✅ `package.json` and `package-lock.json`
- ✅ Static assets in `static/`
- ✅ Documentation (optional but recommended)

Files NOT needed:
- ❌ `.git` folder (unless pushing to GitHub)
- ❌ `node_modules/` (regenerated from package-lock.json)
- ❌ `.svelte-kit/` and `build/` (regenerated on build)
- ❌ `.DS_Store`, `Thumbs.db` (OS files)

See `.gitignore` for full exclusion list.

## 📋 Key Sections in Workbench.svelte

```
Lines 1-48:     Script block (state, functions, variables)
Lines 53-110:   Header section
Lines 113-1244: Main content area
Lines 1180-1242: Output Terminal component
Lines 1247-1376: Bottom navigation bar
```

## 🔍 Quick Reference Links

- **Component File**: `src/components/Workbench.svelte`
- **Global Styles**: `src/routes/layout.css`
- **CSS Changes**: `CSS_CHANGES_SUMMARY.md` (quick) or `OUTPUT_TERMINAL_CSS_CROSS_CHECK.md` (detailed)
- **Testing Report**: `IMPLEMENTATION_VERIFICATION.md`
- **Project Status**: `COMPLETION_REPORT.md`
- **Executive Summary**: `README_CHANGES.md`

## 💡 Best Practices

### When Adding Files
1. Place components in `src/components/`
2. Place utilities in `src/lib/`
3. Place routes in `src/routes/`
4. Update documentation files if significant changes

### When Modifying Styles
1. Check `src/routes/layout.css` for theme variables
2. Use Tailwind classes for consistency
3. Reference `CSS_CHANGES_SUMMARY.md` for applied specifications
4. Update this guide if structure changes

### When Documenting
1. Root level docs: Project-wide information
2. Inline comments: Complex logic explanation
3. Component README: (future) Component-specific docs
4. Keep version dates updated

## 🗂️ Unused/Old Files to Delete

If migrating from old layouts:
- ❌ Old layout files (not in src/routes/)
- ❌ Deprecated components (not in src/components/)
- ❌ Old CSS files (not in src/routes/layout.css)
- ❌ Test files (if not running tests)
- ❌ Backup files (*_old.svelte, *_backup.js)

Current structure is clean and up-to-date.

## 🔐 Important Notes

### Do NOT delete:
- ✅ `src/` directory and all its contents
- ✅ Configuration files (svelte.config.js, vite.config.ts, etc.)
- ✅ `package.json` and `package-lock.json`
- ✅ `.gitignore` and `.npmrc`
- ✅ Documentation files (helpful for future development)

### Safe to modify:
- ✅ Component code in `src/components/`
- ✅ Styles in `src/routes/layout.css`
- ✅ Utilities in `src/lib/`
- ✅ Configuration values (not deletion)
- ✅ Documentation for accuracy

---

**Last Updated**: 2024
**Maintained By**: Engineering Team
**Status**: ✅ Current & Accurate

For the most up-to-date information, see `README.md` and `COMPLETION_REPORT.md`
