# Standup Timer

A small web app for running a daily dev standup. Set the questions, a time
limit per person, and a speaking order. The app then walks the team through
each speaker with a countdown.

**Live:** https://standup-timer-three.vercel.app

## Features

- **Configurable questions.** Add or remove the prompts each person answers.
- **Timer per person.** Each speaker gets the same time box.
- **Speaking order.** Choose Daily Random (stable for the day), Shuffle, or
  Alphabetical.
- **Now-speaking view.** Shows the current speaker, the time remaining, and
  the questions.
- **End screen.** Wraps up the meeting when everyone has spoken.

## Stack

React 19, TypeScript, Vite, Tailwind CSS, and Sonner for toasts. There is no
backend, so everything runs in the browser.

## Run locally

```bash
npm install
npm run dev     # opens the app in your browser
npm run build   # production build in dist/
npm run lint    # type-check and build
```

## Project layout

| File | Purpose |
| --- | --- |
| `src/StartScreen.tsx` | Questions, timer, and speaking-order setup |
| `src/StandupScreen.tsx` | The active speaker and countdown |
| `src/EndScreen.tsx` | Meeting wrap-up |
| `src/StandupApp.tsx` | Moves between the three screens |
