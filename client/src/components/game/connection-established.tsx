import TypewriterText from "@ai/components/typewriter";

const ConnectionEstablished = () => {
  return (
    <div className="mx-auto flex min-h-[100dvh] w-fit flex-col items-center justify-center">
      <h2 className="text-lg md:text-4xl">
        <TypewriterText>Beginning training sequence...</TypewriterText>
      </h2>
    </div>
  );
};

export default ConnectionEstablished;
