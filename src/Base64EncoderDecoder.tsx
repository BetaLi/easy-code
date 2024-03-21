import React, { useState } from 'react';
import { Layout, Input, Button } from 'antd';
const { TextArea } = Input;
const { Content } = Layout;

const Base64EncoderDecoder = () => {
  const [inputValue, setInput] = useState('');
  const [encodedValue, setEncoded] = useState('');
  const [decodedValue, setDecoded] = useState('');
  const [error, setError] = useState('');

  const handleEncode = () => {
    try {
      const encodedData = btoa(inputValue);
      setEncoded(encodedData);
      setDecoded('');
      setError('');
    } catch (e) {
      setError('Error encoding text to Base64.');
      setEncoded('');
      setDecoded('');
    }
  };

  const handleDecode = () => {
    try {
      const decodedData = atob(inputValue);
      setDecoded(decodedData);
      setEncoded('');
      setError('');
    } catch (e) {
      setError('Error decoding Base64 text.');
      setEncoded('');
      setDecoded('');
    }
  };

  const handleInputChange = (e:{ target: { value: any; }; }) => {
    setInput(e.target.value);
    setEncoded('');
    setDecoded('');
    setError('');
  };

  return (
    <Layout style={{ height: '80vh' }}>
            <Content style={{ display: 'flex', height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '50%', marginRight: '10px' }}>
                    <textarea
                        style={{ height: 'calc(100% - 40px)', width: '100%', resize: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '5px', marginBottom: '10px' }}
                        placeholder="Enter text to encode/decode..."
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <Button type="primary" onClick={handleEncode} style={{ marginBottom: '10px' }}>Base64 Encode</Button>
                    <Button type="primary" onClick={handleDecode}>Base64 Decode</Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                    <textarea
                        style={{ height: 'calc(100% - 40px)', width: '100%', resize: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '5px', marginBottom: '10px' }}
                        placeholder="Encoded value..."
                        value={encodedValue}
                        readOnly
                    />
                    <textarea
                        style={{ height: 'calc(100% - 40px)', width: '100%', resize: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '5px', marginBottom: '10px' }}
                        placeholder="Decoded value..."
                        value={decodedValue}
                        readOnly
                    />
                </div>
            </Content>
        </Layout>
  );
};

export default Base64EncoderDecoder;
