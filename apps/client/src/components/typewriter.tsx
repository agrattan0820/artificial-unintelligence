const TypewriterText = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="animate-typewriter mx-auto block overflow-hidden border-r-2 border-r-white whitespace-nowrap">
      {children}
    </span>
  );
};

export default TypewriterText;
