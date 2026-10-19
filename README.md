# Politico!

Politico! is a 3D educational board game about political interest groups, PAC allocation, and game theory.

The game is built with TypeScript, Vite, and Three.js.

## Requirements

- Node.js 20 or newer
- npm

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:5173` if the browser does not open automatically.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |

## Project structure

```text
src/
  constants/       Shared game configuration
  game/
    actors/        Players and pieces
    animations/    Dice and player animations
    board/         Board data, layout, and queries
    models/        Three.js game models
    themes/        Visual themes
    ui/            Menus, HUD, settings, and overlays
  input/           Camera and local multiplayer input
  rendering/       Environment, lighting, and sky
  types/           Shared TypeScript types
  utils/           Reusable utilities
  main.ts          Application entry point

tests/             Automated tests
public/            Static files served by Vite
assets/            Fonts and source assets
```

## Current gameplay

The game supports local four-player multiplayer and currently includes:

- A 40-space board
- Four political interest-group characters
- Character selection and player name entry
- Pregame turn-order rolls
- Dice-based movement and player movement animations
- Volume, graphics quality, game speed, and theme settings
- Default, colorblind, and monochrome themes
- Title screen and credits screen

The interest groups are:

- **NRA** — National Rifle Association
- **MHLG** — Mental Health Liaison Group
- **SC** — Sierra Club
- **AEA** — American Energy Alliance

## Controls

Controls depend on the current game state:

- Use the mouse to interact with menus and pieces.
- Use camera controls to inspect the board.
- Use the action button to advance local multiplayer turns.
- During a dice animation, click the highlighted player piece to roll.

## Testing

Run the test suite:

```bash
npm test
```

Run type checking:

```bash
npm run typecheck
```

Run the production build:

```bash
npm run build
```

Tests should cover board queries, settings normalization, utility functions, player movement, game-state transitions, and animation state transitions.

## Current limitations

- Character-specific dice and abilities are still being developed.
- The game currently supports local multiplayer only.
- Game progress is not saved.
- Online multiplayer is not implemented.
- PAC allocation and political game-theory mechanics are still being developed.
- Rendering performance has not been optimized for every device.
- Some UI and game systems still need stronger type coverage.

## Planned improvements

- Add character-specific dice and abilities.
- Add PAC allocation and interest-group game-theory mechanics.
- Improve piece placement when multiple players share a space.
- Add save/load support.
- Add sound effects and music.
- NRA has (0,1,1,5,5,6) dice
- MHLG has (3,3,3,3,3,3) dice
- SC has (1,1,3,3,5,5) dice
- AEA has (0,0,0,6,6,6) dice
- Improve accessibility and keyboard controls.
- Add more game-state and animation tests.
- Improve mobile and small-screen support.
- Optimize rendering and animation performance.

## Contributing

Before submitting changes, run:

```bash
npm run typecheck
npm test
npm run build
```

Keep changes focused, preserve existing behavior unless a change is intentional, and add tests for new game rules or state transitions.

## License

This project uses the license specified in `package.json`.
