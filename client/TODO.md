# Client TODOs

## Todo

- [ ] Third round prompt has to include a particular word?
- [ ] Connect state for `face-off` and `face-off-result` so that a transition between components doesn't need to happen
- [ ] Protect game pages from players who are not a part of it
- [ ] Optional user auth
- [ ] Fix point count on refresh for `face-off-result`

## In Progress

- [ ] Green color for confirm vote button?
- [ ] Try Replicate AI for image generation (so that we can have actors and naughty stuff)
- [ ] Random generated image option
- [ ] Music/Sound effects
- [ ] Prompt tutorial
- [ ] Show point progress during round changes

## Done ✓

- [x] Test face offs to see if they go to the next question correctly
- [x] Ensure user information in zustand state does not disappear
- [x] Show point increase in face off result
- [x] Connect "Winner" related components to data
- [x] Allow refresh in room lobby screen
- [x] Loop leaderboard screen back to home or new game
- [x] Fix Firefox round animation glitch
- [x] Fix hydration error when the page is reloaded during the game and a different state is shown
- [x] Only a host can start a game from the lobby
- [x] Remember users when joining a new game
- [x] Animation for new players arriving in room
- [x] Safari title font kerning bug
- [x] Change image generator endpoint to use `openai-edge`
- [x] How-to-play screen
- [x] Add donate button
- [x] Maximum on amount of regenerations (3 per game?)
- [x] +1000 instead of 1000+ for point results
- [x] Confim vote (and other buttons) be fixed to bottom of page
- [x] Show face off result without scrolling
- [x] Trying new prompt should not erase original prompt
