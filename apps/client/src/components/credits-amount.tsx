import Link from "next/link";

const CreditsAmount = ({ creditCount }: { creditCount: number | null }) => {
  if (typeof creditCount !== "number") {
    return <></>;
  }

  return (
    <Link href="/pricing" className="underline-offset-2 hover:underline">
      {creditCount} Token{creditCount !== 1 ? "s" : ""}
    </Link>
  );
};

export default CreditsAmount;
