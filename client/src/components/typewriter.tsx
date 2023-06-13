const TypewriterText = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="mx-auto block animate-typewriter overflow-hidden whitespace-nowrap border-r-2 border-r-white">
      {children}
    </span>
  );
};

export default TypewriterText;
