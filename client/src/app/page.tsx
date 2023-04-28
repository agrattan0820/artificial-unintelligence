export default function Home() {
  return (
    <main className="flex flex-col justify-center min-h-screen">
      <section className="container mx-auto px-4">
        <h1 className="text-6xl mb-8">beeeeeeeep</h1>
        <div className="relative mb-8">
          <input
            id="nickname"
            className="peer h-10 bg-transparent border-b-2 px-2 border-l-2 border-gray-400 placeholder-transparent focus:border-indigo-600 focus:outline-none"
            type="text"
            placeholder="enter a nickname"
          />
          <label
            htmlFor="nickname"
            className="absolute transition-all left-2 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
          >
            Enter a cool nickname
          </label>
        </div>
        <div className="space-x-2">
          <button className="bg-indigo-600 text-white px-4 transition hover:bg-indigo-500 focus:bg-indigo-700">
            Start Game
          </button>
          <button className="bg-gray-300 px-4 transition hover:bg-gray-200 focus:bg-gray-400">
            How to Play
          </button>
        </div>
      </section>
    </main>
  );
}
