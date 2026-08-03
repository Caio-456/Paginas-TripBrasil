# TripBrasil - Design System & Responsive Implementation Plan

## Project Overview

TripBrasil is a multi-role travel platform built as a static HTML site with **glassmorphism** UI design. The project uses a directory-per-role architecture with dynamic header injection via JavaScript.

### Current Architecture

```
TripBrasil - Mockup/
├── templates/
│   ├── publico/              # Public pages (home, search, login, etc.)
│   │   ├── home.html
│   │   ├── buscar-explorar.html
│   │   ├── login.html
│   │   ├── cadastro.html
│   │   ├── estabelecimento.html
│   │   ├── ponto-turistico.html
│   │   ├── roteiro.html
│   │   ├── roteiros-predefinidos.html
│   │   ├── resultados-pesquisa.html
│   │   ├── recuperar-senha.html
│   │   ├── redefinir-senha.html
│   │   └── tornar-se-anunciante.html
│   ├── cadastrado/           # Logged-in user pages
│   │   ├── avaliar-estabelecimento.html
│   │   ├── avaliar-ponto-turistico.html
│   │   ├── assinar-plano.html
│   │   ├── editar-perfil.html
│   │   ├── favoritos.html
│   │   ├── minhas-avaliacoes.html
│   │   └── perfil-usuario.html
│   ├── anunciante/           # Advertiser pages
│   │   ├── area-anunciante.html
│   │   ├── cadastrar-estabelecimento.html
│   │   ├── contratar-resultado.html
│   │   ├── editar-estabelecimento.html
│   │   ├── estatisticas-anuncios.html
│   │   └── meus-estabelecimentos.html
│   ├── assinante/            # Subscriber pages
│   │   ├── aumentar-catalogo.html
│   │   ├── cancelar-assinatura.html
│   │   ├── editar-roteiro.html
│   │   ├── meus-roteiros.html
│   │   ├── minha-assinatura.html
│   │   ├── roteiros-ia.html
│   │   ├── sugerir-estabelecimento.html
│   │   └── sugerir-ponto-turistico.html
│   ├── administrador/        # Admin pages
│   │   ├── admin-anuncios.html
│   │   ├── admin-avaliacoes.html
│   │   ├── admin-cadastrar-local.html
│   │   ├── admin-editar-anuncio.html
│   │   ├── admin-editar-local.html
│   │   ├── admin-locais.html
│   │   ├── admin-sugestao.html
│   │   ├── admin-ver-sugestoes.html
│   │   ├── dashboard-admin.html
│   │   ├── login-adm.html
│   │   └── usuarios.html
│   ├── header.html           # Public header (injected dynamically)
│   ├── header-cadastrado.html # Logged-in user header
│   ├── header-admin.html     # Admin header
│   └── DESIGN-AND-RESPONSIVE-PLAN.md
├── static/
│   └── img/
│       ├── logo-cabecario.svg
│       ├── fundo.webp
│       ├── seta.svg
│       ├── cadastro/
│       ├── estabelecimento/
│       ├── dashboard-adm/
│       ├── roteiros-predefinidos/
│       ├── resultados-pesquisa/
│       ├── buscar-explorar/
│       ├── minha-assinatura/
│       └── cadastro/
└── .git/
```

### Design Language

- **Colors**: Primary `#70AE6E` (green), dark overlay backgrounds
- **Typography**: `Outfit` (headings) + `Red Hat Display` (body)
- **Glassmorphism**: `rgba(255,255,255,0.10-0.15)` backgrounds, `backdrop-filter: blur(15px)`, white borders at 0.18-0.20 opacity
- **Border radius**: 12px (buttons/inputs), 20-24px (cards), 50px (pills)
- **Shadows**: `0 8-10px 30px rgba(0,0,0,0.2)`
- **Transitions**: 0.3s ease

---

## Current Problems

### 1. **CSS Duplication Across 34+ HTML Files**
Each page has its own `<style>` block with 200-600 lines of duplicated CSS:
- Reset (`* { margin:0; padding:0; box-sizing:border-box }`) repeated everywhere
- Body background (gradient + fundo.webp) repeated
- Glass card styles repeated with minor variations
- Button styles, form inputs, typography all duplicated
- Media queries inconsistent (some at 768px, some 576px, some 480px)

### 2. **Inconsistent Breakpoints**
| Page | Mobile Breakpoint |
|------|-------------------|
| `buscar-explorar.html` | 768px |
| `login.html` | 576px |
| `resultados-pesquisa.html` | 768px |
| `home.html` | 900px |
| `ponto-turistico.html` | 768px |

### 3. **Header Injection Issues**
- 3 separate header files with duplicated CSS (`header.html`, `header-cadastrado.html`, `header-admin.html`)
- Hardcoded paths that break when pages move folders
- Logo path uses wrong name: `logo-cabecario.svg` vs actual `logo-cabecario.svg`

### 4. **No Design Tokens**
- Colors, spacing, shadows hardcoded everywhere
- No CSS custom properties for theming
- Impossible to change design system globally

### 5. **Bootstrap Mixed In**
- `login.html` uses Bootstrap 5.3.8 via CDN
- Other pages use custom CSS
- Creates visual inconsistencies and bloat

---

## Proposed Solution: Unified Design System

### 1. Directory Structure (New)

```
TripBrasil - Mockup/
├── templates/
│   ├── publico/
│   ├── cadastrado/
│   ├── anunciante/
│   ├── assinante/
│   ├── administrador/
│   ├── -shared/                    # Shared partials
│   │   ├── header-public.html
│   │   ├── header-authenticated.html
│   │   ├── header-admin.html
│   │   └── footer.html
│   └── DESIGN-AND-RESPONSIVE-PLAN.md
├── static/
│   ├── css/
│   │   ├── design-tokens.css       # CSS custom properties
│   │   ├── reset.css               # Normalize + base reset
│   │   ├── components.css          # Reusable UI components
│   │   ├── layout.css              # Grid, flex, container utilities
│   │   ├── forms.css               # Form-specific styles
│   │   ├── pages/                  # Page-specific overrides (minimal)
│   │   │   ├── home.css
│   │   │   ├── login.css
│   │   │   └── ...
│   │   └── main.css                # Bundles all above
│   ├── js/
│   │   ├── header-loader.js        # Dynamic header injection
│   │   ├── theme.js                # Theme utilities
│   │   └── utils.js                # Shared utilities
│   └── img/
│       └── (existing structure)
└── .git/
```

### 2. Design Tokens (`static/css/design-tokens.css`)

```css
:root {
  /* Colors */
  --color-primary: #70AE6E;
  --color-primary-hover: #5A9758;
  --color-primary-light: #9BD799;
  --color-dark-1: #0D2901;
  --color-dark-2: #113601;
  --color-white: #FFFFFF;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: rgba(255, 255, 255, 0.85);
  --color-text-muted: rgba(255, 255, 255, 0.7);
  --color-border: rgba(255, 255, 255, 0.18);
  --color-border-strong: rgba(255, 255, 255, 0.25);
  --color-error: #DC3545;
  --color-success: #70AE6E;

  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.10);
  --glass-bg-strong: rgba(255, 255, 255, 0.15);
  --glass-border: rgba(255, 255, 255, 0.18);
  --glass-blur: blur(15px);
  --glass-blur-strong: blur(18px);

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-pill: 50px;
  --radius-circle: 50%;

  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.2);
  --shadow-xl: 0 15px 40px rgba(0, 0, 0, 0.2);

  /* Typography */
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Red Hat Display', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;
  --font-size-4xl: 2.5rem;
  --font-size-5xl: 3.5rem;
  --font-size-6xl: 5.5rem;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;

  /* Z-index */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-toast: 600;

  /* Breakpoints (Mobile First) */
  --bp-sm: 480px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --bp-2xl: 1440px;
}
```

### 3. Unified Breakpoint System

Standardized breakpoints (mobile-first approach):
- **Mobile**: < 768px (`--bp-md`)
- **Tablet**: 768px - 1024px (`--bp-md` to `--bp-lg`)
- **Desktop**: 1024px - 1280px (`--bp-lg` to `--bp-xl`)
- **Large Desktop**: > 1280px (`--bp-xl`)

Media query mixins:
```css
@media (max-width: var(--bp-sm)) { /* 480px */ }
@media (max-width: var(--bp-md)) { /* 768px */ }
@media (max-width: var(--bp-lg)) { /* 1024px */ }
@media (min-width: var(--bp-md)) { /* 768px+ */ }
@media (min-width: var(--bp-lg)) { /* 1024px+ */ }
```

---

## Migration Strategy

### Phase 1: Foundation (Week 1)
1. Create `static/css/design-tokens.css` with all design tokens
2. Create `static/css/reset.css` with normalize + base styles
3. Create `static/css/components.css` with reusable components:
   - Buttons (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`)
   - Cards (`.card`, `.card-glass`, `.card-white`)
   - Form inputs (`.form-input`, `.form-label`, `.form-group`)
   - Badges (`.badge`, `.badge-pill`)
   - Grid utilities (`.grid`, `.grid-cols-2`, `.grid-cols-3`, etc.)
   - Flex utilities (`.flex`, `.flex-col`, `.items-center`, etc.)
   - Container (`.container`, `.container-fluid`)
   - Section spacing (`.section`, `.section-header`)
4. Create `static/css/layout.css` for layout utilities
5. Create `static/css/main.css` that imports all

### Phase 2: Header Unification (Week 1)
1. Create unified header partials in `templates/-shared/`:
   - `header-public.html` - for non-logged-in pages
   - `header-authenticated.html` - for logged-in users (cadastrado, anunciante, assinante)
   - `header-admin.html` - for admin pages
2. Create `static/js/header-loader.js` with configurable paths:
   ```javascript
   // Usage in each page:
   // <script>loadHeader('public');</script> or
   // <script>loadHeader('authenticated');</script> or
   // <script>loadHeader('admin');</script>
   ```
3. Fix logo path to `static/img/logo-cabecario.svg`
4. Use relative paths from project root via `<base href="../">`

### Phase 3: Page Migration (Week 2-3)
For each of the 34+ HTML pages:
1. Remove inline `<style>` blocks
2. Add `<link rel="stylesheet" href="../../static/css/main.css">` (adjust path depth)
3. Replace custom CSS classes with design system classes
4. Update header injection to use new `header-loader.js`
5. Test responsive behavior at all breakpoints

**Migration Priority:**
1. High-traffic pages: `home.html`, `login.html`, `cadastro.html`, `buscar-explorar.html`
2. User dashboards: `area-anunciante.html`, `meus-roteiros.html`, `perfil-usuario.html`
3. Admin pages: `dashboard-admin.html`, `admin-locais.html`, `usuarios.html`
4. Remaining pages

### Phase 4: Cleanup & Optimization (Week 3)
1. Remove old header files from `templates/`
2. Remove Bootstrap CDN from `login.html`
3. Create page-specific CSS only where absolutely necessary (`static/css/pages/`)
4. Add critical CSS inlining for above-the-fold content
5. Set up build process for CSS minification (optional)

---

## File-by-File Migration Reference

### Public Pages (`templates/publico/`)

| File | Current Header | New Header | CSS Depth |
|------|----------------|------------|-----------|
| `home.html` | `header.html` | `header-public.html` | `../../static/css/main.css` |
| `buscar-explorar.html` | `header.html` | `header-public.html` | `../../static/css/main.css` |
| `login.html` | `header.html` | `header-public.html` | `../../static/css/main.css` |
| `cadastro.html` | `header.html` | `header-public.html` | `../../static/css/main.css` |
| `estabelecimento.html` | `header.html` | `header-public.html` | `../../static/css/main.css` |
| `ponto-turistico.html` | `header.html` | `header-public.html` | `../../static/css/main.css` |
| `roteiro.html` | `header.html` | `header-public.html` | `../../static/css/main.css` |
| `roteiros-predefinidos.html` | `header.html` | `header-public.html` | `../../static/css/main.css` |
| `resultados-pesquisa.html` | `header.html` | `header-public.html` | `../../static/css/main.css` |
| `recuperar-senha.html` | `header.html` | `header-public.html` | `../../static/css/main.css` |
| `redefinir-senha.html` | `header.html` | `header-public.html` | `../../static/css/main.css` |
| `tornar-se-anunciante.html` | `header.html` | `header-public.html` | `../../static/css/main.css` |

### Cadastrado Pages (`templates/cadastrado/`)

| File | Current Header | New Header | CSS Depth |
|------|----------------|------------|-----------|
| `avaliar-estabelecimento.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |
| `avaliar-ponto-turistico.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |
| `assinar-plano.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |
| `editar-perfil.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |
| `favoritos.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |
| `minhas-avaliacoes.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |
| `perfil-usuario.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |

### Anunciante Pages (`templates/anunciante/`)

| File | Current Header | New Header | CSS Depth |
|------|----------------|------------|-----------|
| `area-anunciante.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |
| `cadastrar-estabelecimento.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |
| `contratar-resultado.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |
| `editar-estabelecimento.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |
| `estatisticas-anuncios.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |
| `meus-estabelecimentos.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |

### Assinante Pages (`templates/assinante/`)

| File | Current Header | New Header | CSS Depth |
|------|----------------|------------|-----------|
| `aumentar-catalogo.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |
| `cancelar-assinatura.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |
| `editar-roteiro.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |
| `meus-roteiros.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |
| `minha-assinatura.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |
| `roteiros-ia.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |
| `sugerir-estabelecimento.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |
| `sugerir-ponto-turistico.html` | `header-cadastrado.html` | `header-authenticated.html` | `../../static/css/main.css` |

### Administrador Pages (`templates/administrador/`)

| File | Current Header | New Header | CSS Depth |
|------|----------------|------------|-----------|
| `admin-anuncios.html` | `header-admin.html` | `header-admin.html` | `../../static/css/main.css` |
| `admin-avaliacoes.html` | `header-admin.html` | `header-admin.html` | `../../static/css/main.css` |
| `admin-cadastrar-local.html` | `header-admin.html` | `header-admin.html` | `../../static/css/main.css` |
| `admin-editar-anuncio.html` | `header-admin.html` | `header-admin.html` | `../../static/css/main.css` |
| `admin-editar-local.html` | `header-admin.html` | `header-admin.html` | `../../static/css/main.css` |
| `admin-locais.html` | `header-admin.html` | `header-admin.html` | `../../static/css/main.css` |
| `admin-sugestao.html` | `header-admin.html` | `header-admin.html` | `../../static/css/main.css` |
| `admin-ver-sugestoes.html` | `header-admin.html` | `header-admin.html` | `../../static/css/main.css` |
| `dashboard-admin.html` | `header-admin.html` | `header-admin.html` | `../../static/css/main.css` |
| `login-adm.html` | `header-admin.html` | `header-public.html` | `../../static/css/main.css` |
| `usuarios.html` | `header-admin.html` | `header-admin.html` | `../../static/css/main.css` |

---

## Component Library (Design System)

### Buttons
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--font-size-base);
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-primary {
  background: var(--color-dark-2);
  color: var(--color-white);
}
.btn-primary:hover { background: var(--color-dark-1); transform: translateY(-2px); }

.btn-secondary {
  background: transparent;
  color: var(--color-white);
  border: 2px solid var(--color-white);
}
.btn-secondary:hover { background: var(--glass-bg-strong); }

.btn-accent {
  background: var(--color-primary);
  color: var(--color-white);
}
.btn-accent:hover { background: var(--color-primary-hover); transform: translateY(-2px); }

.btn-outline {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}
.btn-outline:hover { background: var(--color-primary); color: var(--color-white); }

.btn-ghost {
  background: transparent;
  color: var(--color-text-primary);
}
.btn-ghost:hover { background: var(--glass-bg); }
```

### Cards
```css
.card {
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all var(--transition-base);
}

.card-glass {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-lg);
}

.card-white {
  background: var(--color-white);
  color: var(--color-dark-2);
  box-shadow: var(--shadow-md);
}

.card-glass:hover, .card-white:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}
```

### Form Inputs
```css
.form-group { display: flex; flex-direction: column; gap: var(--space-xs); }

.form-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.form-input {
  padding: var(--space-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--glass-bg);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
}

.form-input::placeholder { color: var(--color-text-muted); }
.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--glass-bg-strong);
}
```

### Layout Utilities
```css
.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.section { padding: var(--space-3xl) var(--space-lg); }

.section-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.section-header .label {
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.section-header h2 {
  font-family: var(--font-heading);
  font-size: var(--font-size-4xl);
  margin-top: var(--space-sm);
}

.section-header p {
  max-width: 700px;
  margin: var(--space-md) auto 0;
  color: var(--color-text-muted);
}

/* Grid */
.grid { display: grid; gap: var(--space-lg); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
.grid-auto-fit { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }

/* Flex */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-sm { gap: var(--space-sm); }
.gap-md { gap: var(--space-md); }
.gap-lg { gap: var(--space-lg); }
.flex-wrap { flex-wrap: wrap; }

/* Responsive Grid */
@media (max-width: var(--bp-lg)) {
  .grid-cols-3 { grid-template-columns: repeat(2, 1fr); }
  .grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: var(--bp-md)) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 { grid-template-columns: 1fr; }
  .section-header h2 { font-size: var(--font-size-3xl); }
}
```

---

## Header Loader Implementation

### `static/js/header-loader.js`
```javascript
/**
 * Dynamic header injection for TripBrasil
 * Usage: <script>loadHeader('public');</script> (or 'authenticated', 'admin')
 */

async function loadHeader(type = 'public') {
  const headerMap = {
    'public': '-shared/header-public.html',
    'authenticated': '-shared/header-authenticated.html',
    'admin': '-shared/header-admin.html'
  };

  const headerPath = headerMap[type] || headerMap['public'];
  const container = document.getElementById('header');

  if (!container) {
    console.warn('Header container (#header) not found');
    return;
  }

  try {
    // Determine base path from current page location
    const basePath = getBasePath();
    const response = await fetch(`${basePath}${headerPath}`);

    if (!response.ok) {
      throw new Error(`Failed to load header: ${response.status}`);
    }

    const html = await response.text();
    container.innerHTML = html;

    // Initialize header-specific scripts
    initHeaderScripts();
  } catch (err) {
    console.error('Header load error:', err);
    container.innerHTML = getFallbackHeader(type);
  }
}

function getBasePath() {
  // Pages are in templates/<role>/ so we need to go up to root
  const path = window.location.pathname;
  const depth = (path.match(/\//g) || []).length - 1; // Adjust based on actual depth
  return '../'.repeat(Math.max(0, depth - 1));
}

function initHeaderScripts() {
  // Mobile menu toggle, dropdowns, etc.
  const header = document.querySelector('header');
  if (header) {
    // Add any header-specific JS here
  }
}

function getFallbackHeader(type) {
  return `
    <header style="position:fixed;top:20px;left:50%;transform:translateX(-50%);width:95%;max-width:1400px;padding:15px 35px;display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.12);backdrop-filter:blur(15px);border:1px solid rgba(255,255,255,0.2);border-radius:20px;z-index:1000;">
      <a href="/publico/home.html"><img src="/static/img/logo-cabecario.svg" alt="TripBrasil" style="height:50px;"></a>
      <nav style="display:flex;gap:20px;align-items:center;">
        <a href="/publico/buscar-explorar.html" style="color:white;text-decoration:none;">Explorar</a>
        <a href="/publico/login.html" style="color:white;text-decoration:none;">Entrar</a>
      </nav>
    </header>`;
}

// Auto-load if data-header attribute present
document.addEventListener('DOMContentLoaded', () => {
  const headerEl = document.getElementById('header');
  if (headerEl && headerEl.dataset.headerType) {
    loadHeader(headerEl.dataset.headerType);
  }
});
```

### Updated Header Partials (in `templates/-shared/`)

**header-public.html** - Remove `<style>` block, keep only HTML:
```html
<header>
  <a href="publico/home.html">
    <img src="static/img/logo-cabecario.svg" alt="Logo TripBrasil" class="logo">
  </a>
  <nav>
    <a href="publico/buscar-explorar.html">Explorar</a>
    <a href="publico/tornar-se-anunciante.html">Tornar-se anunciante</a>
    <a href="publico/login.html">Entrar</a>
    <a href="publico/cadastro.html" class="btn-nav">Cadastro</a>
  </nav>
</header>
```

**header-authenticated.html** - Similar structure, authenticated nav items

**header-admin.html** - Admin nav items

### Page Integration
```html
<!-- In each HTML page -->
<div id="header" data-header-type="public"></div>
<!-- or data-header-type="authenticated" or "admin" -->

<script src="../../static/js/header-loader.js"></script>
```

---

## Testing Checklist

### Visual Regression
- [ ] All 34+ pages render identically before/after migration
- [ ] Glassmorphism effects preserved
- [ ] Colors match design tokens exactly
- [ ] Typography scale consistent
- [ ] Spacing rhythm maintained

### Responsive Testing
- [ ] Mobile (< 480px)
- [ ] Mobile Large (480px - 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1024px - 1280px)
- [ ] Large Desktop (1280px - 1440px)
- [ ] Ultra-wide (> 1440px)

### Functional Testing
- [ ] Header loads correctly on all pages
- [ ] Navigation links work (correct relative paths)
- [ ] Logo displays correctly
- [ ] Mobile header behavior works
- [ ] No console errors

### Performance
- [ ] CSS file size < 50KB gzipped
- [ ] No render-blocking CSS for above-fold
- [ ] Header injection < 100ms
- [ ] No duplicate CSS rules

---

## Rollback Plan

If issues arise during migration:
1. Keep old header files until all pages verified
2. Use feature flag: `data-header-type="legacy"` to use old headers
3. Revert individual pages by restoring inline styles
4. Full rollback: revert `main.css` link, restore inline styles

---

## Success Metrics

- **CSS Reduction**: ~80% reduction in total CSS lines (from ~15,000+ to ~3,000)
- **Maintainability**: Single source of truth for design tokens
- **Consistency**: 100% consistent breakpoints, spacing, colors
- **Performance**: < 50KB CSS, faster page loads
- **Developer Experience**: New pages created in minutes not hours