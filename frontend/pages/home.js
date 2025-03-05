// pages/home.js
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import api from '../utils/api';
import AppNavbar from '../components/Navbar';

export default function Home() {
  const router = useRouter();
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('loggedIn')) {
      router.push('/login');
    } else {
      api.get('/home')
        .then((res) => setWelcomeMessage(res.data.message))
        .catch(() => {
          localStorage.removeItem('loggedIn');
          router.push('/login');
        });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('loggedIn');
      router.push('/login');
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  return (
    <>
      <AppNavbar />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow text-center">
              <Card.Body>
                <h2 className="mb-4">{welcomeMessage || 'Welcome Home!'}</h2>
                <p className="mb-4">You are logged in. Enjoy your stay!</p>
                <Button variant="danger" onClick={handleLogout}>
                  Logout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
