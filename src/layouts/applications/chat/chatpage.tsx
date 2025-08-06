import React, { useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Form, Badge } from 'react-bootstrap';
import { Avatar, TextField, Typography } from '@mui/material';
import './App.css';

interface Message {
  author: string;
  message: string;
  time: string;
}

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        author: 'User',
        message: inputMessage,
        time: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={4} className="sidebar">
          <Card>
            <Card.Body>
              <Typography variant="h6">Chat List</Typography>
              <ListGroup>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <Avatar src="https://mdbootstrap.com/img/Photos/Avatars/avatar-8" />
                      <strong>John Doe</strong>
                      <p className="text-muted">Hello, Are you there?</p>
                    </Col>
                    <Col>
                      {/* <Badge variant="info">New</Badge> */}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {/* Add more friends or chat items */}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Body>
              <Typography variant="h6">Chat with John Doe</Typography>
              <ListGroup>
                {messages.map((msg, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={2}>
                        <Avatar />
                      </Col>
                      <Col md={10}>
                        <p><strong>{msg.author}</strong> - {msg.time}</p>
                        <p>{msg.message}</p>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Form.Control
                as="textarea"
                rows={3}
                value={inputMessage}
                onChange={(e: any) => setInputMessage(e.target.value)}
                placeholder="Type your message here"
              />
              <Button onClick={sendMessage} variant="primary" className="mt-2">Send</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatApp;
