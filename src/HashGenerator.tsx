import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { Input, Typography } from 'antd';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const HashGenerator = () => {
  const [textToHash, setTextToHash] = useState('');
  const [hashes, setHashes] = useState({
    MD5: '',
    SHA1: '',
    SHA256: '',
    SHA512: '',
  });

  useEffect(() => {
    if (textToHash) {
      setHashes({
        MD5: CryptoJS.MD5(textToHash).toString(),
        SHA1: CryptoJS.SHA1(textToHash).toString(),
        SHA256: CryptoJS.SHA256(textToHash).toString(),
        SHA512: CryptoJS.SHA512(textToHash).toString(),
      });
    } else {
      setHashes({
        MD5: '',
        SHA1: '',
        SHA256: '',
        SHA512: '',
      });
    }
  }, [textToHash]);

  const handleTextChange = (e:{target:{value:any};}) => {
    setTextToHash(e.target.value);
  };

  return (
    <div>
      <Title level={2}>Hash Generator</Title>
      <TextArea
        rows={4}
        value={textToHash}
        onChange={handleTextChange}
        placeholder="Enter text to hash"
        style={{ marginBottom: 20 }}
      />
      <div>
        {Object.entries(hashes).map(([algorithm, hashValue]) => (
          hashValue && (
            <Paragraph key={algorithm}>
              <Title level={5}>{algorithm}:</Title>
              {hashValue}
            </Paragraph>
          )
        ))}
      </div>
    </div>
  );
};

export default HashGenerator;
