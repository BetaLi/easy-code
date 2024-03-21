import React, { useState } from 'react';
import { Layout, Button } from 'antd';

const { Content } = Layout;

const JsonFormatComponent = () => {
    const [inputJson, setInputJson] = useState('');
    const [formattedJson, setFormattedJson] = useState('');

    const handleInputChange = (e: { target: { value: any; }; }) => {
        const inputValue = e.target.value;
        setInputJson(inputValue);

        // 格式化 JSON 字符串并更新显示
        try {
            const formattedValue = JSON.stringify(JSON.parse(inputValue), null, 4);
            setFormattedJson(formattedValue);
        } catch (error) {
            // 如果输入的 JSON 字符串不合法，则不进行格式化
            setFormattedJson('Invalid JSON');
        }
    };

    const handleCompress = () => {
        try {
            const compressedValue = JSON.stringify(JSON.parse(inputJson));
            setFormattedJson(compressedValue);
        } catch (error) {
            // 如果输入的 JSON 字符串不合法，则不进行压缩
            setFormattedJson('Invalid JSON');
        }
    };

    return (
        <Layout style={{ height: '80vh' }}>
            <Content style={{ display: 'flex', height: '100%' }}>
                <textarea
                    style={{ height: '100%', width: '50%', resize: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '5px', marginBottom: '10px' }}
                    placeholder="Enter JSON string here..."
                    value={inputJson}
                    onChange={handleInputChange}
                />
                <div style={{ display: 'flex', flexDirection: 'column', width: '50%', marginLeft: '10px' }}>
                    <textarea
                        style={{ height: 'calc(100% - 40px)', width: '100%', resize: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '5px', marginBottom: '10px' }}
                        value={formattedJson}
                        readOnly={false}
                        onChange={(e) => setFormattedJson(e.target.value)}
                    />
                    <Button type="primary" onClick={handleCompress}>Compress</Button>
                </div>
            </Content>
        </Layout>
    );
};

export default JsonFormatComponent;
