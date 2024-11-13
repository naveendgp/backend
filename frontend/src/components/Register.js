import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const goToHome = () => {
    navigate('/');
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      setName('');
      setEmail('');
      setPassword('');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  // Animations
  const registerSectionAnimation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  const thankYouSectionAnimation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  const smileyAnimation = useSpring({
    opacity: 1,
    from: { opacity: 0, transform: 'scale(0.5)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { duration: 500 },
  });

  const thankYouMessageAnimation = useSpring({
    opacity: 1,
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 500 },
  });

  // Input field animations
  const inputAnimation = useSpring({
    opacity: 1,
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 500 },
  });

  return (
    <div style={styles.container}>
      <animated.div style={{ ...styles.registerSection, ...registerSectionAnimation }}>
        <button onClick={goToHome} style={styles.backButton}>Back to Home</button>
        <h2 style={styles.heading}>Register</h2>
        <form onSubmit={onSubmit} style={styles.form}>
          <animated.input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ ...styles.input, ...inputAnimation }}
          />
          <animated.input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ ...styles.input, ...inputAnimation }}
          />
          <animated.input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ ...styles.input, ...inputAnimation }}
          />
          <button type="submit" style={styles.button}>Register</button>
        </form>
      </animated.div>

      <animated.div style={{ ...styles.thankYouSection, ...thankYouSectionAnimation }}>
        <animated.div style={{ ...styles.smiley, ...smileyAnimation }}>😊</animated.div>
        <h2 style={styles.thankYouHeading}>Thank You!</h2>
        <animated.p style={{ ...styles.thankYouMessage, ...thankYouMessageAnimation }}>
          Thank you for choosing our Task Manager! We're excited to help you get organized and stay on top of your tasks. Our tool is designed to make your work more efficient and productive. We're confident that you'll find it valuable and worth every minute of your time.
        </animated.p>
      </animated.div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#4a6fa5',
    position: 'relative', // Add this to make sure the button is positioned relative to the container
  },
  registerSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#4a6fa5',
    border: '50px solid #4a6fa5',
    borderRadius: '70px',
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  thankYouSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f3f4f6',
    border: '50px solid #4a6fa5',
    borderRadius: '70px',
  },
  smiley: {
    fontSize: '4rem',  // Adjust size as needed
    marginBottom: '20px',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#fff',
  },
  thankYouHeading: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#4a6fa5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
  },
  input: {
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ced4da',
    fontSize: '1rem',
  },
  button: {
    padding: '15px',
    backgroundColor: '#f3f4f6',
    color: '#4a6fa5',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  thankYouMessage: {
    fontSize: '1rem',
    textAlign: 'center',
    color: '#333',
  },
};

export default Register;
