import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string | null;
    nickname: string;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    createdAt: Date;
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    user: User;
    expires: string;
  }
}
