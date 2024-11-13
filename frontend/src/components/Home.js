import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  useEffect(() => {
    const heroSection = document.querySelector('#hero-section');
    const aboutSection = document.querySelector('#about');
    const appSection = document.querySelector('#get-the-app');
    const contactSection = document.querySelector('#contact');
    
    const fadeIn = (element) => {
      element.style.opacity = 1;
      element.style.transform = 'translateY(0)';
    };

    // Fade in hero section on load
    fadeIn(heroSection);

    // Intersection Observer for lazy loading other sections
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fadeIn(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(aboutSection);
    observer.observe(appSection);
    observer.observe(contactSection);
  }, []);

  return (
    <div style={styles.container}>
      <div className="background-animation"></div> {/* Animated Background */}

      <header style={styles.header}>
        <h1 style={styles.title}>ProjectMaster</h1>
        <div style={styles.headerLinks}>
          <a href="#about" style={styles.headerLink}>About</a>
          <a href="#contact" style={styles.headerLink}>Contact</a>
          <Link to="/login" style={styles.headerLink}>Login</Link>
          <Link to="/register" style={styles.headerLink}>Register</Link>
          <Link to="/download" style={styles.getAppButton}>Get App!</Link>
        </div>
      </header>
      
      <div id="hero-section" style={styles.heroSection}>
        <h1 style={styles.heading}>Welcome to the Project Management Application</h1>
        <p>Get the app or continue with the website here</p>
        <div style={styles.buttonContainer}>
          <Link to="/login" style={styles.button}>Login</Link>
          <Link to="/register" style={styles.button}>Register</Link>
        </div>
      </div>  
      
      {/* Layout Sections */}
      <div style={styles.mainContent}>
        {/* About Us Section */}
        <div id="about" style={styles.leftColumn}>
          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>About Us</h2>
            <p style={styles.sectionContent}>
              Welcome to ProjectMaster, your go-to solution for staying organized and productive. Our app is designed to simplify your daily life by helping you manage your tasks effortlessly.
            </p>
            <p style={styles.sectionContent}>
              <strong>Key Features:</strong>
            </p>
            <ul style={styles.featuresList}>
            
  <li>
    <strong>Project Task Addition & Scheduling:</strong>
    Users can add tasks and assign them specific timelines (daily, weekly, monthly).
    Tasks are automatically split across different time periods for better tracking (daily, weekly, and monthly).
  </li>

  <li>
    <strong>Progress Tracking & Visualization:</strong>
    Real-time charts displaying task progress and completion rates.
    Visual breakdown of tasks by time period, giving users insights into their project progress.
  </li>

  <li>
    <strong>Rewards & Deductions:</strong>
    Users receive rewards for completing tasks on time.
    Incomplete tasks result in deductions, motivating users to stay accountable.
  </li>

  <li>
    <strong>Motivational Reminders:</strong>
    System sends motivational reminders to encourage users to stay focused and complete their tasks.
  </li>

  <li>
    <strong>Comprehensive Dashboard:</strong>
    An intuitive and user-friendly dashboard showing a clear overview of all tasks, progress, and upcoming deadlines.
  </li>

  <li>
    <strong>Project Analysis:</strong>
    Performance reports and task completion statistics are available to help users manage their projects more effectively.
  </li>
</ul>

            <p style={styles.sectionContent}>
              At ProjectMaster, we believe that staying organized shouldn't be difficult. That's why we've combined simplicity with powerful features to help you get more done, every day.
            </p>
          </div>
        </div>
        
        {/* Get the App Section */}
        <div id="get-the-app" style={styles.rightColumn}>
          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>Get the App</h2>
            <p style={styles.sectionContent}>
              Download our app today and start managing your projects more effectively. Available on all major platforms.
            </p>
            <Link to="/download" style={styles.button}>Download Now</Link>
          </div>
        </div>
  
        {/* Contact Us Section */}
        <div id="contact" style={styles.leftColumn}>
          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>Contact Us</h2>
            <p style={styles.sectionContent}>
              Have questions or need support? Reach out to us through our contact form or email us directly. We’re here to help!
            </p>
            <Link to="/contact" style={styles.button}>Contact Us</Link>
          </div>
        </div>
      </div>
      <div style={styles.starsEffect}></div> {/* Twinkling Stars Effect */}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    padding: '20px',
    minHeight: '100vh',
    overflowY: 'auto',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '6%',
    padding: '10px 20px',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: '#e9ecef',
    zIndex: 1000,
  },
  title: {
    fontSize: '2rem',
    color: '#4a6fa5',
  },
  headerLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  headerLink: {
    padding: '10px 15px',
    textDecoration: 'none',
    color: '#4a6fa5',
    fontSize: '1rem',
    transition: 'color 0.3s',
  },
  getAppButton: {
    padding: '10px 20px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s, transform 0.3s',
  },
  heroSection: {
    textAlign: 'center',
    marginTop: '60px',
    marginBottom: '40px',
    width: '100%',
    opacity: 0,
    transform: 'translateY(50px)',
    transition: 'opacity 1s ease-out, transform 1s ease-out',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#4a6fa5',
    fontStyle: 'italic',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  button: {
    padding: '15px 30px',
    backgroundColor: '#4a6fa5',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s, transform 0.3s',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '1200px',
    marginTop: '20px',
    gap: '20px',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    width: '48%',
    opacity: 0,
    transform: 'translateY(50px)',
    transition: 'opacity 1s ease-out, transform 1s ease-out',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    width: '48%',
    opacity: 0,
    transform: 'translateY(50px)',
    transition: 'opacity 1s ease-out, transform 1s ease-out',
  },
  section: {
    backgroundColor: '#4a6fa5',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  sectionHeading: {
    fontSize: '2rem',
    marginBottom: '10px',
    color: '#fff',
  },
  sectionContent: {
    fontSize: '1rem',
    color: '#fff',
    fontStyle: 'italic',
  },
  featuresList: {
    marginLeft: '20px',
    fontSize: '1rem',
    color: '#fff',
    listStyleType: 'disc',
    fontStyle: 'italic',
  },
  starsEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
};

export default Home;
