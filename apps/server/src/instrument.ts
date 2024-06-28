import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://94861f92f5354fe0ae1a921b9a55d909@o4505598670209024.ingest.sentry.io/4505598751211520",
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.5 : 1.0,
  profilesSampleRate: 1.0,
});
