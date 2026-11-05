# James Sederia — Portfolio

> Personal portfolio of James Sederia, a Front-end Developer & AWS Student Builder

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)


## About

This is my personal portfolio website, a fast, single-page introduction to who I am, what I've built, and how to reach me. It features my projects, tech stack, and a downloadable resume in a clean, distraction-free layout. Built for recruiters, collaborators, and anyone curious about my work.

## Features

- **Responsive layout** — fluid type scale and a mobile nav menu, from phones to wide screens
- **Dark / light mode** — toggle in the navbar; also respects your system preference
- **Hero typing animation** — cycles through my roles on load
- **Projects section** — featured work with tech tags and links to demos and code
- **Scroll-reveal animations** — sections fade in as you scroll (auto-disabled for `prefers-reduced-motion`)
- **Contact section** — direct email, GitHub, and LinkedIn links plus a form with required-field validation
  - _Note: the form is UI-only for now
- **Resume download** — one-click PDF download
- **Accessibility** — skip-to-content link, semantic landmarks, and ARIA labels
- **SEO & social meta** — Open Graph and Twitter tags with a canonical URL

## Tech stack

| Tool | What it's for |
| --- | --- |
| [React 19](https://react.dev) | UI library |
| [Vite 8](https://vite.dev) | Dev server and production build |
| [React Router 7](https://reactrouter.com) | Routing (serves `/`, redirects everything else home) |
| [react-icons](https://react-icons.github.io/react-icons/) | Icon set (GitHub, LinkedIn, etc.) |
| [Oxlint](https://oxc.rs) | Linter |
| Plain CSS | Hand-written styles — no CSS framework |

## Project structure

```
.
├── index.html            # Entry HTML — SEO/meta tags, Google Fonts
├── vite.config.js        # Vite configuration
├── package.json          # Scripts and dependencies
├── public/               # Static files served as-is (photos, resume PDF, favicon)
└── src/
    ├── main.jsx          # App entry — wraps everything in Router + ThemeProvider
    ├── App.jsx           # Routes: "/" renders Home, all other paths redirect to "/"
    ├── site.config.js    # Single source of truth: name, email, social links, roles
    ├── pages/Home.jsx    # Composes all sections into one page
    ├── components/       # Navbar, Hero, About, Skills, Projects, Contact, Footer, Reveal
    ├── contexts/         # ThemeContext — dark/light mode state
    ├── index.css         # Design tokens, base styles, dark-mode surfaces
    └── App.css           # Component styles
```

## Getting started

### Prerequisites

- **Node.js** `^20.19.0` or `>=22.12.0` (required by Vite 8)
- npm (included with Node)

### Install and run

```bash
git clone https://github.com/james-sed/my-portfolio.git
cd my-portfolio
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` with hot module replacement.

### Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint the project with Oxlint |

## Contact

- **Email:** [jjsederia08@gmail.com](mailto:jjsederia08@gmail.com)
- **LinkedIn:** [in/james-sederia](https://www.linkedin.com/in/james-sederia-4b87383a8)
- **GitHub:** [github.com/james-sed](https://github.com/james-sed)
