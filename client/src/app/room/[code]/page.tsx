import SocketInitializer from "@ai/components/socket-initializer";

export default function Room({ params }: { params: { code: string } }) {
  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className="container mx-auto px-4">
        <h1 className="text-6xl">Welcome to Room {params.code} 🎉</h1>
        <div className="rounded-full p-5 ring ring-indigo-700"></div>
      </section>
      <SocketInitializer />
    </main>
  );
}
