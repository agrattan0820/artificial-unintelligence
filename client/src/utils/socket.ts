// import { useEffect } from "react";
// import { Socket, io } from "socket.io-client";

// const URL =
//   process.env.NODE_ENV === "production"
//     ? "http://localhost:8080" // TODO: change to API_URL
//     : "http://localhost:8080";

// // export const useSocketInitializer = async (socket: Socket | null) => {
// //   useEffect(() => {
// //     if (!socket) {
// //       socket = io(URL);
// //     }
// //     if (socket) {
// //       socket.on("hello", helloMessages);
// //     }

// //     return () => {
// //       if (socket) {
// //         socket.off("hello", helloMessages);
// //       }
// //     };
// //   }, []);
// // };

// export const socket = io(URL);
