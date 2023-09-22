"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function SentryProvider() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      Sentry.setUser({
        id: session.user.id,
        email: session.user.email ?? "",
        username: session.user.nickname,
      });
    }
  }, [session]);

  return <></>;
}
