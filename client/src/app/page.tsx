import NicknameForm, { NicknameFormType } from "@ai/components/nickname-form";
import SocketInitializer from "@ai/components/socket-initializer";
import supabase from "@ai/utils/supabase";

export default async function Home() {
  const { data } = await supabase.from("users").select();

  console.log(data);

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className="container mx-auto px-4">
        <h1 className="mb-8 text-6xl">beeeeeeeep</h1>
        <NicknameForm submitLabel="Start Game" type="HOME" />
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </section>
      <SocketInitializer />
    </main>
  );
}
