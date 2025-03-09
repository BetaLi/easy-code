import React, { useState, useEffect } from 'react';
import { Input, Button, Typography, List, message, Modal, Form } from 'antd';
import QRCode from 'qrcode.react';

const { Title } = Typography;
const { TextArea } = Input;

interface HistoryItem {
    text: string;
    timestamp: number;
    note?: string; // 新增备注字段
}

const QRCodeGenerator = () => {
    const [inputText, setInputText] = useState('');
    const [qrValue, setQrValue] = useState('');
    const [history, setHistory] = useState<HistoryItem[]>(() => {
        const storedHistory = localStorage.getItem('qrHistory');
        return storedHistory ? JSON.parse(storedHistory) : [];
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentNote, setCurrentNote] = useState('');
    const [currentHistoryItem, setCurrentHistoryItem] = useState<HistoryItem | null>(null);

    useEffect(() => {
        localStorage.setItem('qrHistory', JSON.stringify(history));
    }, [history]);

    const handleGenerateClick = () => {
        if (!inputText.trim()) {
            message.warning('Please enter valid content');
            return;
        }

        // 检查是否已存在相同的 text
        const existingItemIndex = history.findIndex((item) => item.text === inputText);

        if (existingItemIndex !== -1) {
            // 如果存在相同的 text，更新 timestamp
            const updatedHistory = [...history];
            updatedHistory[existingItemIndex] = {
                ...updatedHistory[existingItemIndex],
                timestamp: Date.now(),
            };
            setHistory(updatedHistory);
        } else {
            // 如果不存在相同的 text，添加新记录
            setHistory((prev) => [
                { text: inputText, timestamp: Date.now() },
                ...prev.slice(0, 19), // 保留最近20条记录
            ]);
        }

        setQrValue(inputText);
    };

    const handleHistoryClick = (item: HistoryItem) => {
        setInputText(item.text);
        setQrValue(item.text);
    };

    const handleNoteClick = (item: HistoryItem) => {
        setCurrentHistoryItem(item);
        setCurrentNote(item.note || '');
        setIsModalVisible(true);
    };

    const handleNoteSave = () => {
        if (currentHistoryItem) {
            const updatedHistory = history.map((historyItem) =>
                historyItem.timestamp === currentHistoryItem.timestamp
                    ? { ...historyItem, note: currentNote }
                    : historyItem
            );
            setHistory(updatedHistory);
            setIsModalVisible(false);
            message.success('Note saved');
        }
    };

    const clearHistory = () => {
        setHistory([]);
        message.success('History cleared');
    };

    const handleDeleteHistoryItem = (timestamp: number) => {
        const updatedHistory = history.filter((item) => item.timestamp !== timestamp);
        setHistory(updatedHistory);
        message.success('History item deleted');
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
            <Button onClick={clearHistory} disabled={history.length === 0}>
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
                                onClick={() => handleHistoryClick(item)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <div>
                    <span style={{ marginRight: 20 }}>
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                                        <div>{item.text}</div>
                                        {item.note ? (
                                            <div
                                                style={{ color: 'gray', cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // 阻止事件冒泡
                                                    handleNoteClick(item);
                                                }}
                                            >
                                                Note: {item.note}
                                            </div>
                                        ) : (
                                            <div
                                                style={{ color: '#1890ff', cursor: 'pointer', fontStyle: 'italic' }}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // 阻止事件冒泡
                                                    handleNoteClick(item);
                                                }}
                                            >
                                                点击添加备注
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        type="text"
                                        danger
                                        onClick={(e) => {
                                            e.stopPropagation(); // 阻止事件冒泡
                                            handleDeleteHistoryItem(item.timestamp);
                                        }}
                                    >
                                        删除
                                    </Button>
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
            )}
            <Modal
                title={currentHistoryItem?.note ? 'Edit Note' : 'Add Note'}
                visible={isModalVisible}
                onOk={handleNoteSave}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form>
                    <Form.Item>
                        <TextArea
                            rows={4}
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                            placeholder="Add a note..."
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QRCodeGenerator;