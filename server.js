
import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "crypto";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Store client connections and their IDs
const clients = new Map();

wss.on("connection", (ws) => {

    const clientId = randomUUID();

    // ID -> WebSocket connection
    clients.set(clientId, ws);

    console.log("Connected:", clientId);

    ws.send(JSON.stringify({
        type: "welcome",
        clientId
    }));

    ws.on("message", (message) => {

        const data = JSON.parse(message.toString());

        // Find receiver using ID
        const receiver = clients.get(data.targetId);

        if (receiver && receiver.readyState === WebSocket.OPEN) {

            // Send only to the target client
            receiver.send(JSON.stringify({
                type: "private",
                senderId: clientId,
                message: data.message
            }));

            // Confirm delivery to sender
            ws.send(JSON.stringify({
                type: "success",
                message: "Message sent successfully"
            }));

        } else {

            ws.send(JSON.stringify({
                type: "error",
                message: "Client not found or disconnected"
            }));

        }
    });

    ws.on("close", () => {
        clients.delete(clientId);
        console.log("Disconnected:", clientId);
    });

});
server.listen(3000, () => {
    console.log("Server running on port 3000");
});
