import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "database";
import { myDrizzleAdapter } from "@ai/components/my-drizzle-adapter";
import { captureMessage } from "@sentry/nextjs";

export const authOptions = (
  req?: NextApiRequest | Request,
): NextAuthOptions => {
  return {
    adapter: myDrizzleAdapter(db),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        profile(profile) {
          const cookieNickname =
            req && "cookies" in req && typeof req.cookies === "object"
              ? typeof req.cookies["next-auth.callback-url"] === "string"
                ? new URL(
                    req.cookies["next-auth.callback-url"],
                  ).searchParams.get("nickname") ?? ""
                : typeof req.cookies["__Secure-next-auth.callback-url"] ===
                    "string"
                  ? new URL(
                      req.cookies["__Secure-next-auth.callback-url"],
                    ).searchParams.get("nickname") ?? ""
                  : ""
              : "";

          if (!cookieNickname) {
            captureMessage(
              "No nickname was found when returning profile from Google callback.",
            );
          }

          return {
            id: profile.sub,
            name: profile.name,
            nickname: cookieNickname,
            emailVerified: new Date(),
            email: profile.email,
            image: profile.picture,
            createdAt: new Date(),
          };
        },
      }),
    ],
    pages: {
      // signIn: "/auth",
      // signOut: "/auth/signout",
      // error: "/auth/error", // Error code passed in query string as ?error=
      // verifyRequest: "/auth/verify-request", // (used for check email message)
      // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    callbacks: {
      session({ session, user }) {
        session.user = user;
        return session;
      },
    },
    cookies: {
      sessionToken: {
        name:
          process.env.NODE_ENV === "production"
            ? "__Secure-next-auth.session-token"
            : "next-auth.session-token",
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: process.env.NODE_ENV === "production",
          domain: process.env.SESSION_COOKIE_DOMAIN,
        },
      },
      // https://github.com/nextauthjs/next-auth/discussions/6898
      pkceCodeVerifier: {
        name: "next-auth.pkce.code_verifier",
        options: {
          httpOnly: true,
          sameSite: "none",
          path: "/",
          secure: process.env.NODE_ENV === "production",
          domain: process.env.SESSION_COOKIE_DOMAIN,
        },
      },
    },
  };
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, authOptions(req));
}
