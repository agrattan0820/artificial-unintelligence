"use client";

import { FormEvent } from "react";
import Ellipsis from "./ellipsis";

interface FormElementsType extends HTMLFormControlsCollection {
  nickname: HTMLInputElement;
}

export interface NicknameFormType extends HTMLFormElement {
  readonly elements: FormElementsType;
}

type NicknameFormProps = {
  onSubmit: (e: FormEvent<NicknameFormType>) => Promise<void>;
  user: { id: number; nickname: string } | null;
  loading: boolean;
  submitBtnLabel: string;
};

const NicknameForm = ({
  onSubmit,
  user,
  loading,
  submitBtnLabel,
}: NicknameFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="relative mb-8">
        <input
          id="nickname"
          className="peer h-10 border-b-2 border-l-2 border-gray-400 bg-transparent px-2 placeholder-transparent focus:border-indigo-600 focus:outline-none"
          type="text"
          placeholder="enter a nickname"
          defaultValue={user?.nickname ?? ""}
          required
        />
        <label
          htmlFor="nickname"
          className="absolute -top-3.5 left-2 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
        >
          Enter a cool nickname
        </label>
      </div>
      <div className="space-x-2">
        <button
          type="submit"
          className="bg-indigo-600 px-4 text-white transition hover:bg-indigo-500 focus:bg-indigo-700"
          disabled={loading}
        >
          {!loading ? <>{submitBtnLabel}</> : <Ellipsis />}
        </button>
        <button
          className="bg-gray-300 px-4 transition hover:bg-gray-200 focus:bg-gray-400"
          disabled={loading}
        >
          How to Play
        </button>
      </div>
    </form>
  );
};

export default NicknameForm;
