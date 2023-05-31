"use client";

import { useEffect, useState } from "react";
import ConnectToMainframe from "./connect-to-mainframe";
import ConnectionEstablished from "./connection-established";

const View = () => {
  const [step, setStep] = useState(0);

  const VIEWS = [
    <ConnectToMainframe key={0} />,
    <ConnectionEstablished key={1} />,
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(1);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);
  return VIEWS[step];
};

export default View;
