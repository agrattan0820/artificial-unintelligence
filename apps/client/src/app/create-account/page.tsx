import { SecondaryButton } from "@ai/components/button";
import Footer from "@ai/components/footer";
import Friend from "@ai/components/game/friend";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";

export default function CreateAccountPage() {
  return (
    <main className="container mx-auto flex min-h-screen items-center justify-center px-4 py-16 md:py-32">
      <section>
        <div className="mx-auto grid w-full max-w-xl grid-cols-[8rem_1fr] gap-x-8 gap-y-4 rounded-2xl bg-slate-600 p-8">
          <Friend className="w-32" type="SMILING" />
          <h1 className="text-3xl">Create an account to play for free</h1>
          <div className="col-start-2">
            <SecondaryButton className="flex items-center justify-center gap-2">
              <FaGoogle /> Continue with Google
            </SecondaryButton>
            <p className="mt-4 text-xs">
              Already played before?{" "}
              <Link href="/login" className="underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
