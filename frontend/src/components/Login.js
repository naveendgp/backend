import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './animations.css'; // Import the CSS file with animations

const quotesList = [
  { quote: "What gets scheduled gets done.", author: "Michael Hyatt" },
  { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { quote: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.", author: "Paul J. Meyer" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "It's not about having time, it's about making time.", author: "Unknown" },
  { quote: "Do it now. Sometimes ‘later’ becomes ‘never’.", author: "Unknown" },
  { quote: "A goal without a plan is just a wish.", author: "Antoine de Saint-Exupéry" },
  { quote: "Well done is better than well said.", author: "Benjamin Franklin" },
  { quote: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { quote: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { quote: "Success doesn’t come from what you do occasionally, it comes from what you do consistently.", author: "Marie Forleo" },
  { quote: "You don’t need more time in your day, you need to decide.", author: "Seth Godin" },
  { quote: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { quote: "If you fail to plan, you are planning to fail.", author: "Benjamin Franklin" },
  { quote: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { quote: "Ordinary people think merely of spending time. Great people think of using it.", author: "Arthur Schopenhauer" },
  { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { quote: "One hour of planning saves 10 hours of doing.", author: "Dale Carnegie" },
  { quote: "Don’t wait. The time will never be just right.", author: "Napoleon Hill" },
  { quote: "What gets scheduled gets done.", author: "Michael Hyatt" },
  { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { quote: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.", author: "Paul J. Meyer" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "It's not about having time, it's about making time.", author: "Unknown" },
  { quote: "Do it now. Sometimes ‘later’ becomes ‘never’.", author: "Unknown" },
  { quote: "A goal without a plan is just a wish.", author: "Antoine de Saint-Exupéry" },
  { quote: "Well done is better than well said.", author: "Benjamin Franklin" },
  { quote: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { quote: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { quote: "Success doesn’t come from what you do occasionally, it comes from what you do consistently.", author: "Marie Forleo" },
  { quote: "You don’t need more time in your day, you need to decide.", author: "Seth Godin" },
  { quote: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { quote: "If you fail to plan, you are planning to fail.", author: "Benjamin Franklin" },
  { quote: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { quote: "Ordinary people think merely of spending time. Great people think of using it.", author: "Arthur Schopenhauer" },
  { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { quote: "One hour of planning saves 10 hours of doing.", author: "Dale Carnegie" },
  { quote: "Don’t wait. The time will never be just right.", author: "Napoleon Hill" },
  { quote: "Your time is limited, don’t waste it living someone else’s life.", author: "Steve Jobs" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.", author: "Albert Schweitzer" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { quote: "Act as if what you do makes a difference. It does.", author: "William James" },
  { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { quote: "Don’t watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { quote: "Everything you’ve ever wanted is on the other side of fear.", author: "George Addair" },
  { quote: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { quote: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { quote: "Don’t be pushed around by the fears in your mind. Be led by the dreams in your heart.", author: "Roy T. Bennett" },

];

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(Math.floor(Math.random() * quotesList.length));
  const [quoteAnimation, setQuoteAnimation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Add animation classes on mount
    document.querySelector('.loginContainer').classList.add('fade-in');
    document.querySelector('.quoteContent').classList.add('slide-in');
    document.querySelector('.heading').classList.add('zoom-in');
    document.querySelectorAll('.input').forEach(el => el.classList.add('fade-in-up'));
    document.querySelector('.button').classList.add('fade-in-up');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  const changeQuote = (direction) => {
    setQuoteAnimation('fade-out');
    setTimeout(() => {
      setCurrentQuoteIndex((prevIndex) => {
        let newIndex = prevIndex + direction;
        if (newIndex < 0) newIndex = quotesList.length - 1;
        if (newIndex >= quotesList.length) newIndex = 0;
        return newIndex;
      });
      setQuoteAnimation('fade-in');
    }, 500); // Duration of the fade-out animation
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.quoteContainer} className="quoteContainer">
        <button onClick={() => changeQuote(-1)} style={styles.arrowButtonLeft}> &lt; </button>
        <div style={styles.quoteContent} className={`quoteContent ${quoteAnimation}`}>
          <p style={styles.quote}>"{quotesList[currentQuoteIndex].quote}"</p>
          <p style={styles.author}>- {quotesList[currentQuoteIndex].author}</p>
        </div>
        <button onClick={() => changeQuote(1)} style={styles.arrowButtonRight}> &gt; </button>
      </div>
      <div style={styles.loginContainer} className="loginContainer">
        <button onClick={goToHome} style={styles.backButton}>Back to Home</button>
        <h2 style={styles.heading} className="heading">Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
            style={styles.input}
          />
          <button type="submit" className="button" style={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#4a6fa5',
  },
  quoteContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#e9ecef',
    cursor: 'pointer',
    border: '30px solid #4a6fa5',
    borderRadius: '80px',
    position: 'relative',
  },
  arrowButtonLeft: {
    position: 'absolute',
    left: '10px',
    fontSize: '2rem',
    background: 'transparent',
    border: 'none',
    color: '#4a6fa5',
    cursor: 'pointer',
    padding: '10px',
    zIndex: 1,
  },
  arrowButtonRight: {
    position: 'absolute',
    right: '10px',
    fontSize: '2rem',
    background: 'transparent',
    border: 'none',
    color: '#4a6fa5',
    cursor: 'pointer',
    padding: '10px',
    zIndex: 1,
  },
  quoteContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  quote: {
    fontSize: '1.5rem',
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#4a6fa5',
  },
  author: {
    marginTop: '10px',
    fontSize: '1rem',
    color: '#4a6fa5',
  },
  loginContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#4a6fa5',
    position: 'relative',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#fff',
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
    backgroundColor: '#e9ecef',
    color: '#4a6fa5',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default Login;
