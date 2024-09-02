import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
import QRCodeComponent from "./QRCodeComponent";
import { Button, Popover, Input, Drawer } from "antd";
import { IoLinkSharp } from "react-icons/io5";
import { FaShare, FaMagic, FaQrcode  } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [SSID,setSSID] = useState(localStorage.getItem("SSID"));
  const [openDrawer,setOpenDrawer] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState('100%');
  const [myUrls,setMyUrls] = useState([]);
  
  useEffect(()=>{
    if(!SSID){
      const ssid = uuidv4();
      setSSID(ssid);
      localStorage.setItem("SSID",ssid);
    }
  },[SSID]);

  const fetchMyUrls = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/myurls?ssid=${SSID}`);
      const data = await response.json();
      setMyUrls(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{
    if(openDrawer){
      const handleResize = () => {
        setDrawerWidth(window.innerWidth < 768 ? '100%' : '50%');
      };
  
      // Set initial width
      handleResize();
      fetchMyUrls();
  
      // Add event listener for window resize
      window.addEventListener('resize', handleResize);
  
      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };

    }
  },[openDrawer])


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/shorten/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ original_url: originalUrl, ssid:SSID }),
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
              <div className="mt-3 d-flex flex-column">
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
                </Button>
                </Popover>
                <Button size="large"  onClick={copyToClipboard}>
                  <FaCopy />
                </Button>
                </div>
                <div className="mt-3 d-flex align-items-center">
                <Button size="large" onClick={resetFields}>
                Shorten Another
                </Button>
                <Button className="ms-2" size="large" onClick={()=> setOpenDrawer(true)}>
                  My URLs
                </Button>
                </div>
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
      <Drawer width={drawerWidth} title="Your Shortened URLs" onClose={()=> setOpenDrawer(false)} open={openDrawer}>
        {
          myUrls.length ? myUrls.map((url, index)=> <div className="card my-2 p-3" key={index}>
            <h6>{`${import.meta.env.VITE_API_URL}/${url.short_url}`}</h6>
            <div className="text-success">{url.original_url}</div>
          </div>)
          
          : <p>No shortened URLs found</p>
        }
      </Drawer>
    </div>
  );
}

export default App;
