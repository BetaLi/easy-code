import React, { useState } from 'react';
import { Input, Button, Typography } from 'antd';
import QRCode from 'qrcode.react';

const { Title } = Typography;

const QRCodeGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [qrValue, setQrValue] = useState('');

  const handleInputChange = (e:{target:{value:any;}}) => {
    setInputText(e.target.value);
  };

  const handleGenerateClick = () => {
    setQrValue(inputText);
  };

  return (
    <div>
      <Title level={2}>QR Code Generator</Title>
      <Input
        placeholder="Enter text to generate QR code"
        value={inputText}
        onChange={handleInputChange}
        style={{ marginBottom: '10px' }}
      />
      <Button
        type="primary"
        onClick={handleGenerateClick}
        disabled={!inputText}
      >
        Generate QR Code
      </Button>
      {qrValue && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <QRCode value={qrValue} size={256} />
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
