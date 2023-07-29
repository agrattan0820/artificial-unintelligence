import { LinkButton } from "@ai/components/button";

export default function HowToPlay() {
  return (
    <main className="container mx-auto px-4 py-32 ">
      <section className="prose mx-auto text-white prose-headings:text-white prose-a:text-white prose-a:underline-offset-2 prose-a:transition hover:prose-a:text-indigo-200  prose-blockquote:text-white">
        <h1>How to Play</h1>
        <p>
          Artificial Unintelligence is a game inspired by party games like{" "}
          <a href="https://www.jackboxgames.com/quiplash/">
            Jackbox Party Pack&apos;s Quiplash
          </a>{" "}
          and <a href="https://garticphone.com/">Onrizon&apos;s Garticphone</a>.
        </p>
        <p>
          Starting a game of Artificial Unintelligence will create a room with a
          unique room code and an invite link to join the room. The player who
          starts the game and creates the room is also known as the room&apos;s
          &quot;host.&quot;
        </p>
        <p>
          The host can share the unique invite link with other prospective
          players to have them join their room.
        </p>
        <blockquote>
          To share the invite link: press the &quot;Invite Players&quot; button
          to copy the link to your clipboard or open the share menu, depending
          on which device you are playing on.
        </blockquote>
        <p>
          Once at least 3 players are in the room (max of 8 players), the game
          is allowed to begin, initiated by the host of the room.
        </p>
        <p>
          A game consists of three rounds, and each round is split into two
          phases:
        </p>
        <ol>
          <li>Generation</li>
          <li>Face-Off</li>
        </ol>
        <h2>Generation Phase</h2>
        <p>
          During the &quot;Generation&quot; phase, each player will be given two
          prompts that they will base off of for the AI-generated images. Both
          prompts each player receives is shared with another player in the game
          and the two resulting images submitted by both players for a given
          prompt will compete for votes from other players during the
          &quot;Face-Off&quot; phase.
        </p>
        <p>
          To generate an image, describe an interesting picture within the
          provided text input and press the submit button. After a few seconds,
          two images based on your description will appear. You can decide to
          either submit one of these images as a response to the prompt or
          generate a new set of two images with a new description.
        </p>
        <blockquote>
          To submit an image, click or tap on the image you want to appear in
          the face-off and then press the submit button.
        </blockquote>
        <h2>Face-Off Phase</h2>
        <p>
          The &quot;Face-Off&quot; phase showcases all of the player-submitted
          images in 1v1 duels where all players excluding those who have an
          image in the duel vote on which one is the funniest.
        </p>
        <blockquote>
          To vote on an image, click or tap on the image and then press the
          &quot;Confirm Vote&quot; button.
        </blockquote>
        <p>
          Once all votes have been tallied for a duel, the winner and the
          original prompts the players used to generate the images are revealed.
        </p>
        <p>
          For each 1% of the votes a player&apos;s image receives in the duel,
          they will receive 10 points (e.g. if an image receives 50% of the
          votes, 500 points will be awarded to the player who submitted the
          image).
        </p>
        <p>
          Once all duels have been completed for the round, the game will return
          to the &quot;Generation&quot; phase until a total of 3 rounds have
          been completed.
        </p>
        <h2>Scoring and Winning the Game</h2>
        <p>
          Once 3 rounds have been completed, all points are tallied up from the
          votes the players garnered and the player with the most points at the
          end wins the game.
        </p>
      </section>
      <div className="mt-8">
        <LinkButton href="/">Back to Homepage</LinkButton>
      </div>
    </main>
  );
}
