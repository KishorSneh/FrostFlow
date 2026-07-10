# Todo — Glass

A modern, responsive todo list application built with vanilla HTML, CSS, and JavaScript. It features a monochrome glassmorphism UI, smooth task animations, and automatic persistence via `localStorage`.

![Vanilla JS](https://img.shields.io/badge/vanilla-JS-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![No Build](https://img.shields.io/badge/build-none-success?style=flat)

## Preview

Open `index.html` in any modern browser to use the app. No installation or build step is required.

## Features

### Design
- **Glassmorphism UI** — Frosted glass panel with `backdrop-filter: blur()`, soft borders, and layered shadows
- **Monochrome aesthetic** — Black-and-white palette with animated gray mesh background, grid overlay, and film grain
- **Cursor spotlight** — Subtle glow that follows the mouse across the background
- **Dark & light themes** — Toggle via the sun/moon button; preference is saved automatically
- **Responsive layout** — Works on desktop and mobile screens

### Task Management
- Add tasks via the input field, **Add** button, or **Enter** key
- Custom styled checkboxes with smooth completion animations (strikethrough, fade, reorder to bottom)
- **Priority levels** — Low, Medium, or High; higher-priority active tasks sort to the top
- **Inline editing** — Double-click any active task to edit; press **Enter** to save or **Escape** to cancel
- **Delete on hover** — Trash icon fades in when hovering over a task card
- **Filter pills** — View All, Active, or Done tasks
- **Live search** — Filter tasks as you type
- **Progress ring** — Circular indicator showing completion percentage
- **Clear completed** — Remove all finished tasks in one click

### Data Persistence
Tasks and theme preference are stored in the browser's `localStorage` and survive page refreshes.

| Key | Stores |
|-----|--------|
| `glass-todo-tasks` | Task list (text, status, priority, timestamps) |
| `glass-todo-theme` | `"dark"` or `"light"` |

## Project Structure

```
todo app/
├── index.html   # App markup and structure
├── style.css    # Glassmorphism styles, themes, animations
├── todo.js      # Task logic, rendering, and event handling
└── README.md    # Project documentation
```

## Getting Started

### Option 1 — Open directly

Double-click `index.html` or drag it into your browser.

### Option 2 — Local server (recommended)

Serving the folder avoids some browser restrictions on local files:

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Then visit `http://localhost:8080`.

## Usage

| Action | How |
|--------|-----|
| Add a task | Type in the input and press **Enter** or click **Add** |
| Set priority | Click a dot (Low / Medium / High) before adding |
| Complete a task | Click the checkbox on the left |
| Edit a task | Double-click the task text |
| Delete a task | Hover over the task and click the trash icon |
| Filter tasks | Use the **All**, **Active**, or **Done** pills |
| Search tasks | Type in the search field below the filters |
| Toggle theme | Click the sun/moon icon in the header |
| Clear done tasks | Click **Clear completed** in the footer |

## Tech Stack

| Technology | Role |
|------------|------|
| HTML5 | Semantic structure and accessibility |
| CSS3 | Glassmorphism, CSS variables, animations, responsive design |
| Vanilla JavaScript | Task CRUD, filtering, search, `localStorage` sync |
| [Lucide Icons](https://lucide.dev/) | Icons loaded via CDN (async, non-blocking) |

No frameworks, bundlers, or runtime dependencies are used.

## Browser Support

Works in all modern browsers that support:

- `localStorage`
- `backdrop-filter`
- CSS custom properties
- ES6+ JavaScript (`const`/`let`, arrow functions, template literals)

`backdrop-filter` may render with reduced blur in older browsers; core functionality remains intact.

## Accessibility

- Semantic HTML with ARIA labels on interactive controls
- Keyboard-accessible form and buttons
- Visible focus states on inputs and checkboxes
- Respects `prefers-reduced-motion` (disables background animation and spotlight)

## License

Free to use for personal and educational purposes.
"# FrostFlow" 
