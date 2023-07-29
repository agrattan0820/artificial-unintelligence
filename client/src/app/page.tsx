import Friend from "@ai/components/game/friend";
import FriendWithLegs from "@ai/components/game/friend-with-legs";
import NicknameForm from "@ai/components/nickname-form";

export default function Home() {
  return (
    <main className="pt-36 md:flex md:min-h-screen md:flex-col md:justify-center md:pt-0">
      <section className="container mx-auto flex flex-col-reverse items-start justify-center gap-8 px-4 lg:flex-row lg:gap-24">
        <div>
          <h1 className="mb-8 text-4xl md:text-6xl">
            artif<span className="ml-0.5 inline-block">i</span>cial <br />{" "}
            unintelligence
          </h1>
          <NicknameForm submitLabel="Start Game" type="HOME" />
        </div>
        <Friend className="w-32 lg:w-1/4" />
      </section>
    </main>
  );
}
