import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "database";
import { myDrizzleAdapter } from "@ai/components/my-drizzle-adapter";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    adapter: myDrizzleAdapter(db),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        profile(profile) {
          const cookieNickname =
            typeof req.cookies["next-auth.callback-url"] === "string"
              ? new URL(req.cookies["next-auth.callback-url"]).searchParams.get(
                  "nickname",
                ) ?? ""
              : "";

          console.log("FINAL CHECK OF REQ", req);

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
      signIn: "/auth",
      // signOut: "/auth/signout",
      // error: "/auth/error", // Error code passed in query string as ?error=
      // verifyRequest: "/auth/verify-request", // (used for check email message)
      // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    callbacks: {
      async session({ session, user }) {
        session.user = user;
        return session;
      },
    },
    events: {
      createUser({ user }) {
        console.log("CREATE USER", user);
      },
    },
  });
}
