// pages/enquiry.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import api from '../utils/api';
import AppNavbar from '../components/Navbar';

export default function Enquiry() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Ensure the user is logged in (client-side check)
  if (typeof window !== 'undefined' && !localStorage.getItem('loggedIn')) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/enquiry', { name, email, message });
      setResponseMsg(res.data.message);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send enquiry');
    }
  };

  return (
    <>
      <AppNavbar />
      <Container className="mt-5">
        <Card className="mx-auto" style={{ maxWidth: '600px' }}>
          <Card.Body>
            <h3 className="mb-4 text-center">Enquiry Form</h3>
            {responseMsg && <Alert variant="success">{responseMsg}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control 
                  as="textarea"
                  rows={4}
                  placeholder="Enter your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required 
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Send Enquiry
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
