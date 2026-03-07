# AI Study Planner

Study smarter, not harder. A focused exam prep workspace that learns your pace, knows your deadlines, and keeps you on track.

## What's This About?

You've got exams coming up. You've got too many subjects. You don't know where to start. 

This app fixes that. You add your subjects and exam dates, set daily study hours, and it gives you a realistic plan. Log your hours as you study, mark topics that are tough, and watch your progress actually mean something.

It's built for real exam prep—not vague productivity vibes.

## What You Can Do

- **Add Subjects & Topics** – List what you need to study with deadlines and difficulty levels
- **Smart Suggestions** – Get daily recommendations on what to focus on based on exam proximity and how much you've already covered
- **Track Study Sessions** – Log hours spent, see where your time actually goes
- **Daily Goals** – Set a target each day and stay accountable
- **Study Schedule** – Auto-generates a 30-day plan based on your workload
- **Progress Dashboard** – Charts that show hours per subject, completion rates, and learnings over time
- **Difficult Topics Panel** – Highlights topics you've flagged as hard so they don't get ignored
- **Achievements** – Unlock badges for study streaks, total hours, and completing topics
- **Pomodoro Timer** – Built-in 25/5 timer to keep focused study sessions short and sweet
- **Export Your Data** – Download your study plan as JSON, CSV, or PDF

## Getting Started

**Requirements:** Node.js & npm

```bash
# Clone this repo
git clone https://github.com/Yanshu04/ai-study-planner.git
cd ai-study-planner

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:8080` and start planning.

## Build for Production

```bash
npm run build
```

Outputs to `/dist`. Done.

## Tech Stack

- **React** – UI
- **TypeScript** – Catch bugs before they bite
- **Vite** – blazing fast builds
- **Tailwind CSS** – styling without the headache
- **shadcn/ui** – clean, accessible components
- **Zustand** – state management that doesn't suck
- **Recharts** – charts that look like you tried
- **Framer Motion** – smooth animations that matter
- **Date-fns** – date handling so you don't have to think

## How Data Works

Everything is saved to your browser's `localStorage`. Log out, come back tomorrow, your subjects and progress are still there. No login required.

Want to backup? Export your data from the dashboard—it's all yours.

## Local Development Notes

- **Hot reload** – Changes auto-refresh while running `npm run dev`
- **TypeScript** – Strict checking, so watch your types
- **Styling** – All Tailwind. Customize in `src/index.css`
- **Store** – Check `src/lib/store.ts` for state shape—it's straightforward

## Folder Structure

```
src/
├── components/       # UI pieces
├── lib/             # Helpers, store, types
├── pages/           # Main pages (just Index + 404)
└── hooks/           # Custom React hooks
```

## Contributing

Found a bug? Have a feature idea? Open an issue or fork it and send a PR. This is your project too.

## License

MIT—do what you want with it.
