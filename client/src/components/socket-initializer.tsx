// "use client";

// import { useEffect } from "react";
// import toast from "react-hot-toast";

// import { socket } from "@ai/utils/socket";

// const SocketInitializer = () => {
//   const helloMessages = (msg: string) => {
//     console.log("received messages!");
//     toast(msg);
//   };
//   const message = (msg: string) => {
//     console.log("Received messages:", msg);
//     toast(msg);
//   };

//   useEffect(() => {
//     socket.on("hello", helloMessages);
//     socket.on("message", message);

//     return () => {
//       socket.off("hello", helloMessages);
//       socket.off("message", message);
//     };
//   }, []);

//   return <></>;
// };

// export default SocketInitializer;
