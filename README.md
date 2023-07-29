<div align="center" style="padding-bottom:20px">
  <a href="https://artificial-unintelligence.vercel.app/">
    <img src="./client/src/images/friend.svg" width="150" height="auto" alt="Friend from Artificial Unintelligence"/>
  </a>
</div>

<!-- ![Friend from Artificial Unintelligence!](./client/src/images/friend.svg "Friend from Artificial Unintelligence") -->

# Artificial Unintelligence

> Online multiplayer game where players compete against each other to create the funniest AI-generated images in response to amusing prompts.
>
> Some prompts you might encounter:
>
> - A canceled children's toy
> - The creature hidden in IKEA
> - The newly discovered animal in Australia

## How to Play

Artificial Unintelligence is a game inspired by party games like [Jackbox Party Pack’s Quiplash](https://www.jackboxgames.com/quiplash/) and [Onrizon’s Garticphone](https://garticphone.com/).

Starting a game of Artificial Unintelligence will create a room with a unique room code and an invite link to join the room. The player who starts the game and creates the room is also known as the room’s “host.”

The host can share the unique invite link with other prospective players to have them join their room.

> To share the invite link: press the "Invite Players" button to copy the link to your clipboard or open the share menu, depending on which device you are playing on.

Once at least 3 players are in the room (max of 8 players), the game is allowed to begin, initiated by the host of the room.

A game consists of three rounds, and each round is split into two phases:

1. Generation
2. Face-Off

### Generation Phase

During the “Generation” phase, each player will be given two prompts that they will base off of for the AI-generated images. Both prompts each player receives is shared with another player in the game and the two resulting images submitted by both players for a given prompt will compete for votes from other players during the “Face-Off” phase.

To generate an image, describe an interesting picture within the provided text input and press the submit button. After a few seconds, two images based on your description will appear. You can decide to either submit one of these images as a response to the prompt or generate a new set of two images with a new description.

> To submit an image, click or tap on the image you want to appear in the face-off and then press the submit button.

### Face-Off Phase

The "Face-Off" phase showcases all of the player-submitted images in 1v1 duels where all players excluding those who have an image in the duel vote on which one is the funniest.

> To vote on an image, click or tap on the image and then press the "Confirm Vote" button.

Once all votes have been tallied for a duel, the winner and the original prompts the players used to generate the images are revealed.

For each 1% of the votes a player's image receives in the duel, they will receive 10 points (e.g. if an image receives 50% of the votes, 500 points will be awarded to the player who submitted the image).

Once all duels have been completed for the round, the game will return to the "Generation" phase until a total of 3 rounds have been completed.

### Scoring and Winning the Game

Once 3 rounds have been completed, all points are tallied up from the votes the players garnered and the player with the most points at the end wins the game.

## Dev Tutorial

1. Configure your environment variables (`.env` for the server folder and `.env.local` for the client folder):

   1. Server:
      1. `PORT` - port the HTTP server runs on
      2. `DATABASE_URL` - connection string to your PostgreSQL database
      3. `OPENAI_API_KEY` - authorization key for the OpenAI API
   1. Client:
      1. `NEXT_PUBLIC_API_URL` - URL to the running API (ex. <http://localhost:8080>)
      2. `OPENAI_API_KEY` - authorization key for the OpenAI API

2. Install the packages in both the client and server directories:

   ```bash
   # Run in both client and server
   yarn
   ```

3. Start the development instances of both the client and server:

   ```bash
   # Run in both client and server
   yarn dev
   ```

4. This opens the client on <http://localhost:3000> and the server on <http://localhost:8080>, navigate to these links to see your code changes in real-time.
