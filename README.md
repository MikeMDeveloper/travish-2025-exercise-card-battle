# 2025 Exercise

## Getting started

- Install node
  - Suggestion (Mac) - https://github.com/nvm-sh/nvm
  - Suggestion (Windows) - https://github.com/coreybutler/nvm-windows
  - This exercise is based on Node v20 but will likely work with other versions
- Fork as a private repo to your Github account
  - Clone the repo and make your changes
  - navigate to the cloned folder
  - `npm install` - install dependencies and build system
  - `npm run dev` - starts a developement server
  - follow instructions to use the application in a web browser
  - Chrome developer tools can be helpful to spot problems
- Any text editor can be used but vscode is suggested
  - ESLint + Prettier is setup for users that have installed the relevant plugins

## Overview

- This project is an exercise platform to build a basic SPA (Single Page Application).
- The build system uses Vite (https://vite.dev/). The exercise does not require any changes to the build system.

## Exercise

- Create a card component to display a Pokemon (named PokemonCard)
  - Component should accept the following props:
    - id string
    - color string
    - name string
  - PokemonCard should:
    - be displayed inside the CardSection component
    - use width 130px, height 140px
    - display the name of the pokemon centered in the card colored black
    - have a 2px curved border that is colored uses the color prop
- Add a custom WebFont (https://fonts.google.com/specimen/Roboto) and define this as the standard font
- Use react-query to fetch the charmander pokemon using GET /pokemons/:id
  - it is not necessary to create an API server. this project uses msw to mock an api. all calls to GET /pokemons/charmander will resolve to the mocked API
  - the api call is fully defined in src/api/pokemon.ts as getPokemon(id)
    - this includes a simulated delay
  - Update the Pokemon card to display the data retrieved from the getPokemon() API call
  - Extract the query logic into a custom hook so it can easily be reused (see <https://dev.to/rasaf_ibrahim/a-guide-to-react-custom-hooks-2b4h>) for a guide
  - Pokemon card should display "Loading..." in the name section when the data is being fetched
- Set the main page title to your name

## Finalize

- Feel free to update README.md with relevant comments or decisions
- Commit + push your changes
- When finished, grant access or make the repo public and email the evaluator

## References

- https://github.com/travis-hilterbrand/pattern-query
- https://github.com/travis-hilterbrand/pattern-state-actions
- https://www.theodinproject.com/paths/full-stack-javascript/courses/react


## Mike's Notes
- React https://react.dev/
- React Components https://www.theodinproject.com/lessons/node-path-react-new-react-components
- State variables are stored in the DOM https://react.dev/learn/state-as-a-snapshot
- Javascript equality https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness
- Three Dots operator https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
- Text styling https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Text_styling/Fundamentals
- Roboto https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Text_styling/Web_fonts
- Roboto https://developers.google.com/fonts/docs/getting_started
- react-timer-hook https://www.npmjs.com/package/react-countdown-hook and https://registry.npmjs.org/react-timer-hook/
- Improved CLS from needing improvement to good by setting img dimensions https://web.dev/articles/cls
- TanStack Query useMutation https://tanstack.com/query/latest/docs/framework/react/guides/mutations

// Use these in this example:
- custom hooks
- memoization - useMemo or useCallback
- checkbox options that are saved as state, and get reset under certain conditions. Maybe battle options while a pokemon is active but get reset when swapped with another one.
- spread syntax. maybe replacing one element of it too?
- useReducer?
- router?
- multi-page app?
- test by navigating to another page then hit the back arrow to restart this app.

Odin Project:
- CV Application Project - edit, display, and submit a form that has three fields for your CV info.
- Memory Card Game Project
- Shopping Cart Project

react.dev/learn:
- Tic Tac Toe


https://kentcdodds.com/blog/application-state-management-with-react
https://kentcdodds.com/blog/compound-components-with-react-hooks


https://react.dev/learn/passing-data-deeply-with-context#challenges

