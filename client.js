
import WebSocket from "ws";
import readline from "readline";

const socket = new WebSocket("ws://localhost:3000");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

socket.on("open", () => {
    console.log("Connected to server!");
    console.log("Type your message:");

    // Take user input
    rl.on("line", (input) => {

        const data = {
            type: "chat",
            message: input,
            sender: "client"
        };

        // Send custom data
        socket.send(JSON.stringify(data));
    });
});

// Receive server response
socket.on("message", (data) => {
    const response = JSON.parse(data.toString());

    console.log("\nServer:", response.message);
});

socket.on("close", () => {
    console.log("Disconnected");
    rl.close();
});
