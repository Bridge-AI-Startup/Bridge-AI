import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api');
      setMessage(response.data.message);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error connecting to server');
      setLoading(false);
    }
  };

  return (
    <div className="App-header">
      <h1>MERN Stack Application</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}

export default Home;
