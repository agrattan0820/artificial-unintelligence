import { Server } from "socket.io";
import * as Sentry from "@sentry/node";
import { ClientToServerEvents, ServerToClientEvents } from "../types";
import { parseCookie } from "../utils";
import { checkUserSession } from "../services/user.service";

export function authSocketMiddleware(
  io: Server<ClientToServerEvents, ServerToClientEvents>
) {
  io.use(async (socket, next) => {
    const userId = socket.handshake.auth.userId;

    const headers = socket.request.headers;

    console.log(headers);

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

    console.log(cookieObject);

    Sentry.captureMessage("COOKIES", {
      extra: {
        cookies: cookieObject,
        cookiesString: JSON.stringify(cookieObject),
      },
    });

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
