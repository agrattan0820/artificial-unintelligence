import FaceOff from "./face-off";
import Leaderboard from "./leaderboard";
import NextRound from "./next-round";
import Prompt from "./prompt";
import RoundResult from "./round-result";
import Timer from "./timer";
import View from "./view";
import Winner from "./winner";
import WinnerLeadUp from "./winner-lead-up";
import WinnerWithImage from "./winner-with-image";

export default function Game({ params }: { params: { code: string } }) {
  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className="container mx-auto px-4">
        <Leaderboard />
      </section>
    </main>
  );
}
