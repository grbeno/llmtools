// src/AI/Chat.jsx

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { marked } from 'marked';
import './Chat.css';

const WebSocketChat = () => {
    const [responseMessages, setResponseMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const socketRef = useRef(null);

    // apply markdown to response messages
    const createMarkup = (markdown) => {
        return { __html: marked(markdown) };
    };

    // Initialize WebSocket connection
    useEffect(() => {
        const websocket = new WebSocket('ws://localhost:8000/ws/chat/');
        socketRef.current = websocket;

        websocket.onopen = () => {
            console.log('Connected to WebSocket');
            setConnectionStatus('Connected');
        };

        websocket.onclose = () => {
            console.log('Disconnected from WebSocket');
            setConnectionStatus('Disconnected');
        };

        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setConnectionStatus('Error');
        };

        // Listen for messages
        socketRef.current.addEventListener('message', (event) => {
            const response = JSON.parse(event.data);
            setResponseMessages(prevMessages => [...prevMessages, { prompt: response.prompt, message: response.response }]);
        });

        // Cleanup on component unmount
        return () => {
            websocket.close();
        };

    }, []);

    // Send message handler
    const sendMessage = useCallback(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && inputMessage.trim()) {
            socketRef.current.send(JSON.stringify({
                prompt: inputMessage,
            }));
            setInputMessage('');
        }
    }, [inputMessage]);

    return (
        <div className="chat-wrapper">
            <div>
                <h2 style={{ margin: '0.5em', color: '#03101d', fontFamily: "sans-serif" }}>AI Chat</h2>
            </div>

            <div className={`status ${
                connectionStatus === 'Connected' ? 'connected' : 
                connectionStatus === 'Error' ? 'error' : 'disconnected'
            }`}>
                Websocket status: {connectionStatus}
            </div>

            {window.location.port === '5173' ? (
                <div className="chat-messages">
                    <span className="chat-prompt">Hi! How is going on?</span>
                    <span className="chat-response">Oh, thank you for asking. I'm doing well. How about you?</span>
                </div>
            ) : null}

            {responseMessages.map((item, index) => (
                <div key={index} className="chat-messages">
                    <div>
                        <span className="chat-prompt">{item.prompt}</span>
                        <span className="chat-response" dangerouslySetInnerHTML={createMarkup(item.message)} />
                    </div>
                </div>
            ))}

            <div className="input-wrapper">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button
                    className="chat-button"
                    onClick={sendMessage}
                    disabled={!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default WebSocketChat;