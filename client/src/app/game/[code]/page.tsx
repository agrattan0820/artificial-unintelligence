import Prompt from "./prompt";
import View from "./view";

export default function Game({ params }: { params: { code: string } }) {
  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className="container mx-auto px-4">
        <Prompt />
      </section>
    </main>
  );
}
