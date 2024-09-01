import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import QRCodeComponent from "./QRCodeComponent";
import { Button, Popover, Input } from "antd";
import { IoLinkSharp } from "react-icons/io5";
import { FaShare, FaMagic, FaQrcode  } from "react-icons/fa";
import { MdAutorenew } from "react-icons/md";

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log(import.meta.env.VITE_API_URL, "---VITE_API_URL---");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/shorten/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ original_url: originalUrl }),
      });
      if (!response.ok) {
        throw new Error(
          "An error occurred while shortening the URL. Please try again."
        );
      }
      const data = await response.json();
      setShortUrl(`${import.meta.env.VITE_API_URL}/${data.short_url}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopySuccess("URL copied to clipboard!");
    } catch (err) {
      setError("Failed to copy URL. Please try again.");
    }
  };

  const resetFields = ()=> {
    setShortUrl("");
    setOriginalUrl("");
    setCopySuccess("");
  }

  return (
    <div className="App container mt-5">
      <div className="card shadow-lg">
        <div className="card-header text-center">
          <h1 className="card-title">URL Shortener</h1>
        </div>
        <div className="card-body">
          <div className="form-group">
            <div className="fs-5 d-flex align-items-center mb-2">
              {" "}
              <IoLinkSharp /> <span className="ms-2">URL to shorten</span>
            </div>

            <Input
              size="large"
              type="text"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="Enter your URL"
              required
              autoComplete
            />
            <Button
            type="primary"
            size="large"
            className="mt-3"
            loading={loading}
            onClick={handleSubmit}
            disabled={!originalUrl}
            >
              {loading ? "Shortening..." : "Shorten URL"}
            </Button>
          </div>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {shortUrl && (
            <div className="mt-3">
              <div className="fs-5 d-flex align-items-center mb-2">
                {" "}
                <FaMagic /> <span className="ms-2">Shortened URL</span>
              </div>
              <Input
                size="large"
                type="text"
                value={shortUrl}
                style={{ pointerEvents: "none" }}
              />
              <div className="mt-3 d-flex align-items-center">
                <Button size="large" onClick={()=> window.open(shortUrl, "_blank")}>
                  <FaShare />
                </Button>
                <Popover
                  content={<QRCodeComponent url={shortUrl} />}
                  trigger="click"
                  placement="bottom"
                >
                <Button className="mx-2" size="large">
                  <FaQrcode />
                  <span>QR</span>
                </Button>
                </Popover>
                <Button size="large"  onClick={copyToClipboard}>
                  <FaCopy /> Copy
                </Button>
                <Button className="ms-2" size="large" onClick={resetFields}>
                <MdAutorenew />
                </Button>
              </div>
              {copySuccess && (
                <div className="alert alert-success mt-3">{copySuccess}</div>
              )}
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
