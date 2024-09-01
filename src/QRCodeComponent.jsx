import React, { useState, useRef } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Button } from "antd";

const QRCodeComponent = ({ url }) => {
  const canvasRef = useRef(null);
  const [renderSVG, setRenderSVG] = useState(false);

  const downloadQRCode = (format) => {
    const downloadLink = document.createElement("a");
    if (format === "svg") {
      setRenderSVG(true);
      setTimeout(() => {
        const svg = canvasRef.current.querySelector("svg");
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const svgUrl = URL.createObjectURL(svgBlob);
        downloadLink.href = svgUrl;
        downloadLink.download = "qrcode.svg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }, 100);
    } else {
      setRenderSVG(false);
      setTimeout(() => {
        const canvas = canvasRef.current.querySelector("canvas");
        const image = canvas.toDataURL(`image/${format}`);
        downloadLink.href = image;
        downloadLink.download = `qrcode.${format}`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }, 100);
    }
  };

  return (
    <div className="d-flex align-items-center">
      <div ref={canvasRef}>
        {renderSVG ? <QRCodeSVG value={url} /> : <QRCodeCanvas value={url} />}
      </div>

      <div className="d-flex flex-column ms-3 w-50">
        <Button type="primary" onClick={() => downloadQRCode("svg")}>
          SVG
        </Button>
        <Button
          className="my-1"
          type="primary"
          onClick={() => downloadQRCode("png")}
        >
          PNG
        </Button>
        <Button type="primary" onClick={() => downloadQRCode("jpg")}>
          JPG
        </Button>
      </div>
    </div>
  );
};

export default QRCodeComponent;
