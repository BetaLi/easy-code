import React, { useState, useEffect } from 'react';
import { Input, Button, Typography, List, message } from 'antd';
import QRCode from 'qrcode.react';

const { Title } = Typography;

interface HistoryItem {
    text: string;
    timestamp: number;
}

const QRCodeGenerator = () => {
    const [inputText, setInputText] = useState('');
    const [qrValue, setQrValue] = useState('');
    const [history, setHistory] = useState<HistoryItem[]>(() => {
        // 初始化时读取本地存储‌:ml-citation{ref="4" data="citationList"}
        const storedHistory = localStorage.getItem('qrHistory');
        return storedHistory ? JSON.parse(storedHistory) : [];
    });

    // 同步存储的副作用‌:ml-citation{ref="2" data="citationList"}
    useEffect(() => {
        localStorage.setItem('qrHistory', JSON.stringify(history));
    }, [history]);

    const handleGenerateClick = () => {
        if (!inputText.trim()) {
            message.warning('Please enter valid content');
            return;
        }

        // 更新QR码并记录历史‌:ml-citation{ref="4" data="citationList"}
        setQrValue(inputText);
        setHistory(prev => [
            { text: inputText, timestamp: Date.now() },
            ...prev.slice(0, 9) // 保留最近10条记录
        ]);
    };

    const handleHistoryClick = (text: string) => {
        setInputText(text);
        setQrValue(text);
    };

    const clearHistory = () => {
        setHistory([]);
        message.success('History cleared');
    };

    return (
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
            <Title level={2}>QR Code Generator</Title>

            <Input
                placeholder="Enter text to generate QR code"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ marginBottom: 10 }}
            />

            <Button
                type="primary"
                onClick={handleGenerateClick}
                disabled={!inputText.trim()}
                style={{ marginRight: 10 }}
            >
                Generate QR Code
            </Button>

            <Button
                onClick={clearHistory}
                disabled={history.length === 0}
            >
                Clear History
            </Button>

            {qrValue && (
                <div style={{ marginTop: 20, textAlign: 'center' }}>
                    <QRCode value={qrValue} size={256} />
                </div>
            )}

            {history.length > 0 && (
                <div style={{ marginTop: 30 }}>
                    <Title level={4}>Generation History</Title>
                    <List
                        bordered
                        dataSource={history}
                        renderItem={(item) => (
                            <List.Item
                                onClick={() => handleHistoryClick(item.text)}
                                style={{ cursor: 'pointer' }}
                            >
                <span style={{ marginRight: 20 }}>
                  {new Date(item.timestamp).toLocaleString()}
                </span>
                                {item.text}
                            </List.Item>
                        )}
                    />
                </div>
            )}
        </div>
    );
};

export default QRCodeGenerator;
