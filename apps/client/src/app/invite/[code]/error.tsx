"use client"; // Error components must be Client Components

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { useParams } from "next/navigation";

import ErrorScreen from "@ai/components/error-screen";

export default function Error({ error }: { error: Error; reset: () => void }) {
  const params = useParams();

  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <ErrorScreen
      details={`An error occured trying to access an invite for the room: ${params?.code}.`}
    />
  );
}
