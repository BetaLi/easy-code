import React, { useState } from 'react';
import { Layout, Button } from 'antd';

const { Content } = Layout;

const UrlEncodeDecodeComponent = () => {
    const [inputValue, setInputValue] = useState('');
    const [encodedValue, setEncodedValue] = useState('');
    const [decodedValue, setDecodedValue] = useState('');

    const handleEncode = () => {
        const encoded = encodeURIComponent(inputValue);
        setEncodedValue(encoded);
    };

    const handleDecode = () => {
        const decoded = decodeURIComponent(inputValue);
        setDecodedValue(decoded);
    };

    const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setInputValue(e.target.value);
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
                    <Button type="primary" onClick={handleEncode} style={{ marginBottom: '10px' }}>Encode</Button>
                    <Button type="primary" onClick={handleDecode}>Decode</Button>
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

export default UrlEncodeDecodeComponent;
