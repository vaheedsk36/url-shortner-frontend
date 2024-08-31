import { useState } from 'react';
import { FaCopy } from 'react-icons/fa';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { VITE_API_URL } = import.meta.env;
    try {
      const response = await fetch(`${VITE_API_URL}/shorten/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ original_url: originalUrl }),
      });
      if (!response.ok) {
        throw new Error('An error occurred while shortening the URL. Please try again.');
      }
      const data = await response.json();
      setShortUrl(`${VITE_API_URL}/${data.short_url}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const linkClickHandler = async()=>{
    try{
      const response = await fetch(shortUrl);
      if(!response){
        throw new Error('Unable to shorten URL');
      }
      const data = await response.json();
      window.open(data?.original_url, '_blank');
    }catch(err){
      console.error(err);
    }
}

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopySuccess('URL copied to clipboard!');
    } catch (err) {
      setError('Failed to copy URL. Please try again.');
    }
  };

  return (
    <div className="App container mt-5">
      <div className="card shadow-lg">
        <div className="card-header text-center">
          <h1 className="card-title">URL Shortener</h1>
        </div>
        <div className="card-body">
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
            <button type="submit" className="btn btn-primary btn-block mt-3" disabled={loading}>
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </form>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {shortUrl && (
            <div className="mt-4 text-center">
              <h2>Shortened URL:</h2>
              <div className="d-flex justify-content-center align-items-center">
                <span
                  className="btn btn-link"
                  onClick={linkClickHandler}
                >
                  {shortUrl}
                </span>
                <button
                  className="btn btn-outline-secondary ml-3"
                  onClick={copyToClipboard}
                >
                  <FaCopy /> Copy
                </button>
              </div>
              {copySuccess && <div className="alert alert-success mt-3">{copySuccess}</div>}
            </div>
          )}
        </div>
        <div className="card-footer text-center text-muted">
          &copy; 2024 URL Shortener App
        </div>
      </div>
    </div>
  );
}

export default App;
