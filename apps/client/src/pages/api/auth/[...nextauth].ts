import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "database";
import { myDrizzleAdapter } from "@ai/components/my-drizzle-adapter";

export const authOptions = (
  req?: NextApiRequest | Request,
): NextAuthOptions => {
  return {
    adapter: myDrizzleAdapter(db),
    providers: [
      CredentialsProvider({
        async authorize(credentials, req) {
          // Add logic here to look up the user from the credentials supplied
          const user = {
            id: "1",
            name: "J Smith",
            // nickname: "JJ",
            // image: null,
            email: "jsmith@example.com",
            // emailVerified: null,
          };

          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return user;
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        },
      }),
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
                : ""
              : "";

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
    },
  };
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, authOptions(req));
}
