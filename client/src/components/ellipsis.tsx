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
      <span className="[animation-delay: 0.25s] animate-dot-bounce opacity-0">
        •
      </span>
      <span className="[animation-delay: 0.5s] animate-dot-bounce opacity-0">
        •
      </span>
    </span>
  );
};

export default Ellipsis;
