import ConnectionStatus from "@ai/components/connection-status";

export default function Game({ params }: { params: { code: string } }) {
  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className="container mx-auto px-4">
        <h1 className="mb-8 text-6xl">Game</h1>
        <ConnectionStatus code={params.code} />
      </section>
    </main>
  );
}
