// ========= COMPONENT =========

/**
 * An ellipsis that animates each of its dots opacity infinitely in a sequence.
 *
 * @param props
 * @returns A React component.
 */
const Ellipsis = () => {
  return (
    <span>
      <span className="animate-dot-bounce opacity-0">•</span>
      <span className="animate-dot-bounce-2 opacity-0">•</span>
      <span className="animate-dot-bounce-3 opacity-0">•</span>
    </span>
  );
};

export default Ellipsis;
