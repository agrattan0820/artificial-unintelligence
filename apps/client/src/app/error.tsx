"use client"; // Error components must be Client Components

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

import ErrorScreen from "@ai/components/error-screen";

export default function Error({ error }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <ErrorScreen
      details={`Sorry, an error occurred! We've been notified about it, please try playing again later.`}
    />
  );
}
