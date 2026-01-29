# User Dashboard

A search application built with React and TypeScript. Users can search by name, filter by role, and view detailed profiles in a modal.

## Features

- Search by name with explicit submit (button or Enter)
- Role-based filtering (Admin, Editor, Viewer, Guest, Owner)
- Responsive grid layout (desktop, tablet, mobile)
- Accessible modal with focus trap and keyboard navigation
- Loading, empty, and error states

## Getting started

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```

## Tech stack

- React 19
- TypeScript
- Vite
- Vitest + React Testing Library

## Design

Based on the [Figma file](https://www.figma.com/design/ESP3mNtKRj1aI458c08QBb/%F0%9F%92%BB-Website-Home-Test?node-id=0-1&t=tmrCaYq4wADJCHvD-1). The Figma covers desktop only; tablet and mobile layouts are adapted to be responsive.

No utility libraries were used for React or styling — all components and CSS are written from scratch.
