
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import readline from "readline";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let connectedClient = null;

wss.on("connection", (ws) => {
    console.log("Client connected!");

    connectedClient = ws;

    // RECEIVE from client
    ws.on("message", (message) => {
        const data = JSON.parse(message.toString());

        console.log("\nClient:", data.message);

        // SEND response to client
        ws.send(JSON.stringify({
            message: "Server received: " + data.message
        }));
    });

    ws.on("close", () => {
        console.log("Client disconnected");
        if (connectedClient === ws) {
            connectedClient = null;
        }
    });
});

// Server can also send custom input
rl.on("line", (input) => {
    if (connectedClient?.readyState === 1) {
        connectedClient.send(JSON.stringify({
            message: input
        }));
    } else {
        console.log("No client connected");
    }
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
    console.log("Type messages to send to client:");
});
