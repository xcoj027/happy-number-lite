# Happy Number

Happy Number is a free and open-source math practice game. It is built to help children strengthen their arithmetic skills through short, playful challenges. A child chooses a grade, selects a game, answers a series of math questions, and then reviews a final score.

The application runs entirely in the browser. It has no backend, no accounts, no multiplayer, and no analytics, which keeps it simple to host, safe for young learners, and easy to run on any device.

This project is developed by **TNQ MEDIA**.

## Official Application

You can play the official application at:

- [https://math-hero.online](https://math-hero.online)
- [https://happy-number.cloud](https://happy-number.cloud)

## Features

- **Three game modes.** Children can choose between a multiple-choice Quiz, Car Racing, and Tug of War, and each mode presents the same math curriculum in a different play style.
- **Five grade levels.** The quiz generators cover grades 1 through 5, with question difficulty that grows with each grade.
- **Multiplication table practice.** A dedicated generator helps children drill their times tables.
- **Responsive design.** The interface adapts to phones, tablets, and desktop screens without horizontal overflow.
- **Single dark theme.** The game ships with one carefully tuned dark theme, so there is no theme switching to manage.
- **Client-side only.** The entire game is static and runs in the browser, so it can be hosted on any static file server.
- **English-language interface.** All user-facing text is written directly in the components, with no translation layer.

## Getting Started

You need [Node.js](https://nodejs.org) (version 18 or later) and npm.

Install the dependencies and start the development server:

```bash
npm install
npm run start
```

The development server opens automatically at `http://localhost:5173`.

To create a production build, run `npm run build`. The output is written to the `dist/` directory and can be served by any static host.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run start` | Starts the Vite development server and opens it in the browser. |
| `npm run build` | Creates an optimized production build in the `dist/` directory. |
| `npm run preview` | Serves the production build locally for a final check. |
| `npm run typecheck` | Runs the TypeScript compiler in type-checking mode. |
| `npm run lint` | Runs ESLint over the source files. |

## Tech Stack

- React 18 with TypeScript in strict mode
- Vite 5 as the build tool and development server
- Redux Toolkit for global application state
- React Router 7 for client-side routing
- Sass (SCSS) with global styles and CSS custom properties
- lucide-react for interface icons

## Project Structure

```
src/
  main.tsx                     Application entry point
  App.tsx                      Route definitions and the workflow guard
  GameApplication.tsx          Solo game lifecycle orchestration
  GameApplicationContext.tsx   Shared game application context
  useGameApplication.ts        Typed hook for the game application context
  components/                  Reusable interface primitives
  pages/
    game/                      Route-level pages for the home, play, and result screens
  screens/
    games/                     Individual game screens and shared game UI
    tugOfWar/                  Tug of War game logic
    ResultScreen.tsx           Shared result screen
  quiz/
    generators/math/           Grade 1-5 and multiplication table question generators
    QuizGeneratorFactory.ts    Selects the generator for a given grade
  store/                       Redux Toolkit slices and store configuration
  constants/, hooks/, styles/, types/, utils/
```

## Contributing

Contributions are welcome. If you find a bug or have an idea for an improvement, please open an issue on GitHub. If you would like to contribute code, fork the repository, create a focused branch, and open a pull request that describes the change and how it was tested. Every pull request is reviewed with care.

## License

This project is released under the MIT License. See the [LICENSE](LICENSE) file for the full text.

## About

Happy Number is an open-source project of TNQ MEDIA. The original idea behind it is simple: math can be fun, and children learn best when practice feels like play.
