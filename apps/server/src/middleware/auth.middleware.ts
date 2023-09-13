import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../types";
import { parseCookie } from "../utils";
import { checkUserSession } from "../services/user.service";

export function authSocketMiddleware(
  io: Server<ClientToServerEvents, ServerToClientEvents>
) {
  io.use(async (socket, next) => {
    const userId = socket.handshake.auth.userId;
    const sessionToken = socket.request.headers.cookie
      ? parseCookie(socket.request.headers.cookie)["next-auth.session-token"]
      : undefined;

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
