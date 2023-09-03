import { cn } from "@ai/utils/cn";
import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

type InputProps = {
  id: string;
  type: HTMLInputTypeAttribute;
  label: React.ReactNode;
  labelStyles?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({
  id,
  type,
  label,
  className,
  labelStyles,
  ...props
}: InputProps) => {
  return (
    <div className="relative">
      <input
        {...props}
        id={id}
        type={type}
        className={cn(
          `peer h-10 rounded-none border-b-2 border-l-2 border-gray-400 bg-transparent px-2 placeholder-transparent focus:border-indigo-600 focus:outline-none`,
          className,
        )}
      />
      <label
        htmlFor={id}
        className={cn(
          `absolute -top-3.5 left-2 rounded-none text-sm text-gray-400 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-400`,
          labelStyles,
        )}
      >
        {label}
      </label>
    </div>
  );
};
export default Input;
