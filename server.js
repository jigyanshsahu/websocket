
import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import readline from "readline";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Handle client connections
wss.on("connection", (ws) => {
    console.log("New client connected!");

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

// Broadcast message to ALL connected clients
function broadcast(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                message: message
            }));
        }
    });
}

// Take server terminal input
rl.on("line", (input) => {
    broadcast(input);
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
    console.log("Type message to broadcast:");
});
