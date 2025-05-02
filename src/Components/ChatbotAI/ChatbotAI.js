import React from 'react';

const Chatbot = () => {
    return (
        <section id="chatbot">
            <h2>Chatbot Assistant</h2>
            <div id="chatbox">
                <div id="messages"></div>
                <input type="text" id="userInput" placeholder="Ask a question..." />
                <button id="sendButton">Send</button>
            </div>
        </section>
    );
};

export default Chatbot;
