import React, { useState } from 'react';
import { Layout, Button } from 'antd';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const { Content } = Layout;

SyntaxHighlighter.registerLanguage('json', json);

const JsonFormatComponent = () => {
    const [inputJson, setInputJson] = useState('');
    const [formattedJson, setFormattedJson] = useState('');

    const handleInputChange = (e:{target:{value:any;}}) => {
        const inputValue = e.target.value;
        setInputJson(inputValue);
        try {
            const formattedValue = JSON.stringify(JSON.parse(inputValue), null, 4);
            setFormattedJson(formattedValue);

            console.log(inputValue);
        } catch (error) {
            setFormattedJson('Invalid JSON');
        }
    };

    const handleCompress = () => {
        try {
            const compressedValue = JSON.stringify(JSON.parse(inputJson));
            setFormattedJson(compressedValue);
        } catch (error) {
            setFormattedJson('Invalid JSON');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(formattedJson);
    };

    const handleUnescapeString = () => {
        setFormattedJson(unescapeString(inputJson));
        setInputJson(unescapeString(inputJson))
        try {
            const formattedValue = JSON.stringify(JSON.parse(unescapeString(inputJson)), null, 4);
            setFormattedJson(formattedValue);
        } catch (error) {
            setFormattedJson('Invalid JSON');
        }
    }
    const handleEscapeString = () => {
        setInputJson(escapeString(inputJson))
        try {
            const formattedValue = JSON.stringify(JSON.parse(escapeString(inputJson)), null, 4);
            setFormattedJson(formattedValue);
        } catch (error) {
            setFormattedJson('Invalid JSON');
        }
    }

    // Function to escape special characters
    const escapeString = (str:string) => {
        return str.replace(/[\\"']/g, '\\$&').replace(/�/g, '\\0');
    };

    const unescapeString = (str:string) => {
        return str.replace(/\\([\\'"])/g, '$1');
    };

    return (
        <Layout style={{ height: '80vh' }}>
            <Content style={{ display: 'flex', height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '45%', marginRight: '10px', height: '100%', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '5px' }}>
                    <div style={{  height: '100%', padding: '0 0 10px 0'}}>
                        <textarea
                            style={{ height: '100%', width: '100%', padding:'10px', resize: 'none', border: 'none', outline: 'none' }}
                            placeholder="在此处输入 JSON 字符串..."
                            value={inputJson}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div style={{ padding: '0 10px 10px 10px'  }}>
                        <Button type="text" onClick={handleUnescapeString}>去转义</Button>
                        <Button type="text" style={{  }} onClick={handleEscapeString}>转义</Button>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '55%', marginLeft: '10px', height: '100%', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '5px' }}>
                    <div style={{ height: '100%', overflow: 'auto'}}>
                        <SyntaxHighlighter language="json" style={docco}>
                            {formattedJson}
                        </SyntaxHighlighter>
                    </div>
                    <div style={{ marginTop: '10px', padding: '0 0 10px 10px' }}>
                        <Button type="text" onClick={handleCompress}>压缩</Button>
                        <Button type="text" style={{  }} onClick={handleCopy}>复制</Button>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default JsonFormatComponent;
