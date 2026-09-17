# threejs-testing


## Dev workflow

- `npm install`
- `npm run dev` (auto-compile TS bundle in watch mode + Vite live reload)
- `npm run typecheck` (TypeScript checks over TS sources)
- `npm run build:game` (compile TS back into browser runtime JS files)
- `npm run clean:js` (remove legacy JS sources under `js/`)

TypeScript is configured in `tsconfig.json` with:
- `allowJs: false`
- `checkJs: false`
- `noEmit: true`

During `npm run dev`:
- TypeScript rebuilds `dist/game.bundle.js` automatically when `.ts` files change.
- Vite serves the app and triggers full-page reload when the bundle file changes.


Red - National Rifle Association (the letter "A")
Green - Mental Health Liason Group (ribbon)
Blue - Sierra Club (recycling)
Yellow - American Energy Alliance (lightning)


TODO:
check refactoring for EVERYTHING
tests
- [ ] all tests
debug
- [ ] all debug
actors:
- [ ] pieces
- [ ] players
- [ ] manager
animations (oh boy)
- [ ] dice rolling
- [ ] player animator
board stuff
- [X] board data, layout, queries 
config 
- [ ] camera
- [ ] rendering
- [ ] settings
models
- [X] environment
- [X] dice
- [ ] pieces
themes
- [ ] themes
types
- [ ] types
ui
- [ ] credits
- [ ] title screen
- [ ] settings
- [ ] game info
- [ ] game manager
rendering
- [ ] envioronment
- [ ] sky

- have each character have special dice
  -> NRA has (0,1,1,5,5,6) dice
  -> MHLG has (3,3,3,3,3,3) dice
  -> SC has (1,1,3,3,5,5) dice
  -> AEA has (0,0,0,6,6,6) dice