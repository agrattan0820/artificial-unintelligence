import FaceOff from "./face-off";
import Prompt from "./prompt";
import RoundResult from "./round-result";
import Timer from "./timer";
import View from "./view";

export default function Game({ params }: { params: { code: string } }) {
  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className="container mx-auto px-4">
        <RoundResult />
      </section>
    </main>
  );
}
