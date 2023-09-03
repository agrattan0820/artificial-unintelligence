import Footer from "@ai/components/footer";
import Friend from "@ai/components/game/friend";
import NicknameForm from "@ai/components/nickname-form";

export default function Home() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col justify-center">
      <section className="container mx-auto flex flex-col-reverse items-start justify-center gap-8 px-4 lg:flex-row lg:gap-24">
        <div>
          <h1 className="mb-8 text-4xl md:text-6xl">
            artif<span className="ml-0.5 inline-block">i</span>cial <br />{" "}
            unintelligence
          </h1>
          <NicknameForm submitLabel="Host Game" type="HOME" />
        </div>
        <Friend className="w-32 lg:w-1/4" />
      </section>
      <Footer />
    </main>
  );
}
