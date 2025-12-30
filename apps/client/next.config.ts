import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "media.giphy.com",
      },
      {
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
      },
      {
        hostname: "replicate.delivery",
      },
      {
        hostname: "pbxt.replicate.delivery",
      },
      {
        hostname: "api.dicebear.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

// Make sure adding Sentry options is the last code to run before exporting
export default withSentryConfig(nextConfig, {
  org: "alexander-grattan",
  project: "artificial-unintelligence-client",
  // Only print logs for uploading source maps in CI
  // Set to `true` to suppress logs
  silent: !process.env.CI,
});
