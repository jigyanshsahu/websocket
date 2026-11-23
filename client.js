import WebSocket from "ws";
import readline from "readline";

const socket = new WebSocket("ws://localhost:3000");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let myId = null;

socket.on("open", () => {
    console.log("Connected to server!");
});

socket.on("message", (data) => {

    const response = JSON.parse(data.toString());

    if (response.type === "welcome") {
        myId = response.clientId;

        console.log("Your ID:", myId);
        console.log("Enter: receiverId message");
    }

    if (response.type === "private") {
        console.log(
            `\nPrivate message from ${response.senderId}: ${response.message}`
        );
    }

    if (response.type === "success") {
        console.log(response.message);
    }

    if (response.type === "error") {
        console.log(response.message);
    }

});

// Take user input
rl.on("line", (input) => {

    const separator = input.indexOf(" ");

    if (separator === -1) {
        console.log("Format: receiverId message");
        return;
    }

    const targetId = input.substring(0, separator);
    const message = input.substring(separator + 1);

    socket.send(JSON.stringify({
        type: "private",
        targetId,
        message
    }));

});