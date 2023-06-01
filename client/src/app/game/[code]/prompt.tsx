import Button from "@ai/components/button";

const Prompt = () => {
  return (
    <div className="max-w-2xl">
      <h2 className="mb-14 text-lg md:text-2xl">
        Make a funny{" "}
        <span className="text-indigo-700 dark:text-indigo-300">Dog</span>{" "}
        picture for me human
      </h2>
      <div className="relative mb-8 flex flex-col">
        <textarea
          id="prompt"
          placeholder="Describe a funny image"
          rows={5}
          cols={33}
          maxLength={500}
          className="peer w-full resize-none rounded-xl border-2 border-gray-300 bg-transparent p-4 placeholder-transparent focus:border-indigo-600 focus:outline-none focus:dark:border-indigo-300"
        />
        <label
          htmlFor="prompt"
          className="absolute -top-6 left-2 text-sm text-gray-600 transition-all peer-placeholder-shown:left-4 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-6 peer-focus:left-2 peer-focus:text-sm peer-focus:text-gray-600 dark:text-gray-400 dark:peer-focus:text-gray-400"
        >
          Describe a funny image
        </label>
      </div>
      <Button>Submit Prompt</Button>
    </div>
  );
};

export default Prompt;
