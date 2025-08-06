import React, { useState } from 'react';
import './MessagePage.css';

const users = [
    { id: 1, name: 'Ahmet' },
    { id: 2, name: 'Mehmet' },
    { id: 3, name: 'Ayşe' },
];

const MessagePage = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState({});
    const [input, setInput] = useState('');

    const handleUserClick = (user: any) => {
        setSelectedUser(user);
    };

    const handleSendMessage = () => {
        // if (input.trim() && selectedUser) {
        //     const userMessages = messages[selectedUser.id] || [];
        //     setMessages({
        //         ...messages,
        //         [selectedUser.id]: [...userMessages, { sender: 'me', text: input }],
        //     });
        //     setInput('');
        // }
    };

    return (
        <div className="message-page">
            <div className="user-list">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className={`user-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
                        onClick={() => handleUserClick(user)}
                    >
                        {user.name}
                    </div>
                ))}
            </div>
            <div className="chat-area">
                {selectedUser ? (
                    <>
                        <div className="chat-header">
                            <h2>{selectedUser.name}</h2>
                        </div>
                        <div className="chat-content">
                            {/* {(messages[selectedUser.id] || []).map((message, index) => (
                                <div key={index} className={`chat-message ${message.sender}`}>
                                    {message.text}
                                </div>
                            ))} */}
                        </div>
                        <div className="chat-footer">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="chat-input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            {/* <button className="send-button" onClick={handleSendMessage}>
                                Send
                            </button> */}
                        </div>
                    </>
                ) : (
                    <div className="no-user-selected">Select a user to start chatting</div>
                )}
            </div>
        </div>
    );
};

export default MessagePage;