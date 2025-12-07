import type { Server } from "socket.io";
import { parseCookie } from "../utils";
import { checkUserSession } from "../services/user.service";
import type { ClientToServerEvents, ServerToClientEvents } from "../types";

export function authSocketMiddleware(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
) {
  io.use(async (socket, next) => {
    const userId = socket.handshake.auth.userId;

    const cookieObject = socket.request.headers.cookie
      ? parseCookie(socket.request.headers.cookie)
      : undefined;

    if (!cookieObject) {
      next(new Error("Unauthorized, no cookies sent"));
      return;
    }

    const sessionToken =
      cookieObject["next-auth.session-token"] ??
      cookieObject["__Secure-next-auth.session-token"];

    if (!userId || !sessionToken) {
      next(new Error("Unauthorized"));
      return;
    }

    const checkDBForSession = await checkUserSession({ sessionToken });

    if (!checkDBForSession) {
      next(new Error("Unauthorized"));
      return;
    }

    next();
  });
}
