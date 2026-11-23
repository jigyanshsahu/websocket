
import WebSocket from "ws";

const socket = new WebSocket("ws://localhost:3000");

socket.on("open", () => {
    console.log("Connected to server!");
});

socket.on("message", (data) => {
    const response = JSON.parse(data.toString());

    console.log("Broadcast received:", response.message);
});

socket.on("close", () => {
    console.log("Disconnected");
});
