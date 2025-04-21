"use client";

import { X } from "lucide-react";
import axios from "axios";
import { useState } from "react";

export default function FullChat() {
    const [inputText, setInputText] = useState("");
    const [responseText, setResponseText] = useState(""); // State to store the response

    async function sendPostRequest() {
        try {
            interface ResponseData {
                message: string;
            }
            const response = await axios.post<ResponseData>("https://f381-105-110-19-72.ngrok-free.app/test", {
                name: inputText,
            });
            console.log("Response:", response.data);
            setResponseText(response.data.message); // Update the response state
        } catch (error) {
            console.error("Error sending POST request:", error);
            setResponseText("Error occurred while sending the request."); // Handle error
        }
    }

    return (
        <div
            style={{
                margin: 0,
                background: 'white',
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <button onClick={() => {
                window.parent.postMessage('close-chat', '*')
            }}>
                <X className="w-15 h-15 text-red-600" />
            </button>
            <h1>This is the full chat screen</h1>
            <div style={{ marginTop: '20px' }}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type something..."
                    style={{ padding: '10px', marginRight: '10px' }}
                />
                <button onClick={sendPostRequest} style={{ padding: '10px' }}>
                    Submit
                </button>
            </div>
            {responseText && ( // Conditionally render the response
                <div style={{ marginTop: '20px', color: 'green' }}>
                    <strong>Response:</strong> {responseText}
                </div>
            )}
        </div>
    );
}