export default function Room({ params }: { params: { code: string } }) {
  return (
    <main className="flex min-h-screen flex-col justify-center">
      <h1 className="text-6xl">Welcome to Room {params.code} 🎉</h1>
    </main>
  );
}
