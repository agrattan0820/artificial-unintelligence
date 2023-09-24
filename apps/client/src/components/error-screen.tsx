import { LinkButton } from "./button";

export default function ErrorScreen({ details }: { details: string }) {
  return (
    <main className="flex min-h-[100dvh] flex-col justify-center">
      <section className="container mx-auto px-4">
        <h1 className="mb-8 text-4xl md:text-6xl">
          artif<span className="">i</span>cial <br /> unintelligence
        </h1>
        <p className="mb-6">{details}</p>
        <LinkButton href="/">Go To The Homepage</LinkButton>
      </section>
    </main>
  );
}
