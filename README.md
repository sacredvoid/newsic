# newsic

> explore EDM from a different POV

[![Deploy with Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?style=flat&logo=vercel)](https://newsic-azure.vercel.app)
[![Built with Strudel](https://img.shields.io/badge/powered%20by-Strudel.cc-blueviolet?style=flat)](https://strudel.cc)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-green?style=flat)](LICENSE)

Pick a genre. Choose a mood. Get inspired by an artist. Hit generate - and hear how electronic music is built with code.

Newsic generates full EDM tracks with real song structure (intro, buildup, drop, breakdown, outro) using [Strudel.cc](https://strudel.cc)'s live coding engine. Every track is actual code you can copy, tweak, and play in Strudel's REPL.

## What's inside

- **4 genres** - House, Techno, Trance, Drum & Bass
- **20 artist profiles** - From Daft Punk to Pendulum, each with signature patterns
- **6 moods** - Energetic, Dark, Dreamy, Hypnotic, Uplifting, Aggressive
- **Real song structure** - Not just loops. Intro, buildup with filter sweeps, drops, breakdowns, outros with fade-outs
- **Show the code** - See the Strudel patterns behind your track, copy them, open in Strudel's REPL
- **Remix** - Generate variations with one click

## Run locally

```bash
git clone https://github.com/sacredvoid/newsic.git
cd newsic
npm install
npm run dev
```

## Tech

[Vite](https://vite.dev) + [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org) + [Tailwind CSS](https://tailwindcss.com) + [@strudel/web](https://strudel.cc) + [Framer Motion](https://www.framer.com/motion)

## How it works

Newsic doesn't use AI to generate audio. Instead, it constructs [Strudel](https://strudel.cc) pattern code from pre-analyzed artist profiles and genre templates, then feeds that code to Strudel's browser-based audio engine. The `arrange()` function handles song structure, `sine.slow()` and `saw.slow()` create filter sweeps and fade-outs, and `$:` stacks layers to play simultaneously.

## License

AGPL-3.0 (required by Strudel dependency)
