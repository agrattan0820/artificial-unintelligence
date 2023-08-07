import Image, { StaticImageData } from "next/image";

import { LinkButton } from "@ai/components/button";
import InviteLink from "@ai/images/invite-link.png";
import Prompt from "@ai/images/prompt.png";
import ImagePrompt from "@ai/images/image-prompt.png";
import ImageVoting from "@ai/images/image-voting.png";
import VotingPoints from "@ai/images/voting-points.png";
import WinningImages from "@ai/images/winning-images.png";

const ImageFigure = ({
  image,
  caption,
}: {
  image: { src: StaticImageData; alt: string };
  caption: string;
}) => {
  return (
    <figure className="relative rounded-xl pb-12 pt-8 ring ring-indigo-600">
      <Image className="rounded-xl" src={image.src} alt={image.alt} />
      <figcaption className="absolute bottom-4 left-4 m-0 pr-4 italic">
        {caption}
      </figcaption>
    </figure>
  );
};

export default function HowToPlay() {
  return (
    <main className="container mx-auto px-4 py-16 md:py-32 ">
      <section className="prose mx-auto text-white prose-headings:text-white prose-a:text-white prose-a:underline-offset-2 prose-a:transition hover:prose-a:text-indigo-200  prose-blockquote:text-white">
        <h1>How to Play</h1>
        <p>
          Artificial Unintelligence is a game inspired by party games like{" "}
          <a href="https://www.jackboxgames.com/quiplash/">
            Jackbox Party Pack&apos;s Quiplash
          </a>
          , <a href="https://garticphone.com/">Onrizon&apos;s Garticphone</a>,
          and
          <a href="https://fishbowl-game.com/">Avi Moondra's Fishbowl Game</a>.
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
        <ImageFigure
          image={{
            src: InviteLink,
            alt: "Artificial Unintelligence invite link",
          }}
          caption="The room lobby"
        />
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
        <h2 id="generation">Generation Phase</h2>
        <p>
          During the &quot;Generation&quot; phase, each player will be given two
          prompts. These prompts will be the basis for the AI-generated images
          the players create. Each of the two prompts a player receives is
          shared with another player in the game. Once all players create and
          submit images for their two assigned prompts, the game transitions to
          the <a href="#faceOff">&quot;Face-Off&quot;</a> phase where the image
          generations compete against whichever counterpart shared the same
          original prompt.
        </p>
        <ImageFigure
          image={{
            src: Prompt,
            alt: "Artificial Unintelligence prompt screen",
          }}
          caption="The entered text is transformed into an image"
        />
        <p>
          To generate an image, describe an interesting picture within the
          provided text input and press the submit button. After a few seconds,
          two images based on your description will appear. You can decide to
          either submit one of these images as a response to the prompt or
          generate a new set of two images with a new description.
        </p>
        <ImageFigure
          image={{
            src: ImagePrompt,
            alt: "Artificial Unintelligence image prompt screen",
          }}
          caption="You can select between two generated images"
        />
        <blockquote>
          To submit an image, click or tap on the image you want to appear in
          the face-off and then press the submit button.
        </blockquote>
        <h2 id="faceOff">Face-Off Phase</h2>
        <p>
          The &quot;Face-Off&quot; phase showcases all of the player-submitted
          images in 1v1 duels where all players excluding those who have an
          image in the duel vote on which one is the funniest.
        </p>
        <ImageFigure
          image={{
            src: ImageVoting,
            alt: "Artificial Unintelligence image voting screen",
          }}
          caption="Players outside of the ones who generated the images vote"
        />
        <blockquote>
          To vote on an image, click or tap on the image and then press the
          &quot;Confirm Vote&quot; button.
        </blockquote>
        <p>
          Once all votes have been tallied for a duel, the winner and the
          original prompts the players used to generate the images are revealed.
        </p>
        <ImageFigure
          image={{
            src: VotingPoints,
            alt: "Artificial Unintelligence voting results screen",
          }}
          caption="The winning image is highlighted along with the original prompts"
        />
        <p>
          For each 1% of the votes a player&apos;s image receives in the duel,
          they will receive 10 points (e.g. if an image receives 50% of the
          votes, 500 points will be awarded to the player who submitted the
          image).
        </p>
        <p>
          Once all duels have been completed for the round, the game will return
          to the <a href="#generation">&quot;Generation&quot;</a> phase until a
          total of 3 rounds have been completed.
        </p>
        <h2>Scoring and Winning the Game</h2>
        <p>
          Once 3 rounds have been completed, all points are tallied up from the
          votes the players garnered and the player with the most points at the
          end wins the game.
        </p>
        <ImageFigure
          image={{
            src: WinningImages,
            alt: "Artificial Unintelligence winning images screen",
          }}
          caption="Show the winner and all of their images"
        />
      </section>
      <div className="mx-auto mt-8 max-w-prose">
        <LinkButton href="/">Back to Homepage</LinkButton>
      </div>
    </main>
  );
}
