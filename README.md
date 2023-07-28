<div align="center" style="padding-bottom:20px">
  <a href="https://beeeeeeeep.vercel.app/">
    <img src="./client/src/images/friend.svg" width="150" height="auto" alt="Friend from Artificial Unintelligence"/>
  </a>
</div>

<!-- ![Friend from Artificial Unintelligence!](./client/src/images/friend.svg "Friend from Artificial Unintelligence") -->

# Artificial Unintelligence

> Online multiplayer game where players compete against eachother to create the funniest AI-generated images.

## How to Play

WIP 🚧

## Dev Tutorial

1. Configure your environment variables (`.env` for the server folder and `.env.local` for the client folder):

   1. Server:
      1. `PORT` - port the http server runs on
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
