import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/shorten/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ original_url: originalUrl }),
    });
    const data = await response.json();
    setShortUrl(`http://localhost:8000/${data.short_url}`);
  };

  return (
    <div className="App container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="card-title text-center mb-4">URL Shortener</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="Enter your URL"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block mt-3">
              Shorten URL
            </button>
          </form>
          {shortUrl && (
            <div className="mt-4 text-center">
              <h2>Shortened URL:</h2>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="btn btn-link">
                {shortUrl}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;