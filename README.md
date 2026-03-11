# Task Tracker - Enterprise Project Management

A professional, enterprise-grade task tracking application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Monday.com-inspired UI** - Clean, professional tabular interface
- **Auto-calculations** - Automatic date completion and duration calculation
- **Advanced Filtering** - Search, monthly filters, status and technology filters
- **CSV Export** - Export filtered tasks for reporting
- **LocalStorage Persistence** - Data persists across sessions
- **Inline Editing** - Edit tasks directly in the table
- **Form Validation** - Comprehensive validation for new tasks

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Lucide React (Icons)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- **Create Task**: Click "New Task" button
- **Edit Task**: Click edit icon in the Actions column
- **Delete Task**: Click trash icon in the Actions column
- **Filter by Month**: Use the month picker
- **Filter by Status/Tech**: Click filter badges
- **Search**: Use the search bar for task names/IDs
- **Export**: Click "Export CSV" to download filtered tasks

## Automation Features

- When status is changed to "Completed", Date Ended is auto-set to today
- Days Taken is automatically calculated from Date Started and Date Ended
- All changes are persisted to localStorage automatically
