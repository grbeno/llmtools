// src/provider.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import WebSocketChat from './Chat';
import Lang from './Lang';

const Provider = () => {
    return (
        <Router>
            <Routes>
                <Route path="ws/chat/" element={<WebSocketChat />} />
                <Route path="/lang" element={<Lang />} />
                <Route path="/" element={<App />} />
            </Routes>
        </Router>
    );
};

export default Provider;