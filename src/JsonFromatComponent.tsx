import React, { useState, useEffect } from 'react';
import { Layout, Button, List, message, Modal, Form } from 'antd';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import TextArea from 'antd/es/input/TextArea';

const { Content } = Layout;

SyntaxHighlighter.registerLanguage('json', json);

interface HistoryItem {
    input: string;
    output: string;
    timestamp: number;
    operation?: string;
    note?: string; // 新增备注字段
}

const JsonFormatComponent = () => {
    const [inputJson, setInputJson] = useState('');
    const [formattedJson, setFormattedJson] = useState('');
    const [history, setHistory] = useState<HistoryItem[]>(() => {
        const stored = localStorage.getItem('jsonHistory');
        return stored ? JSON.parse(stored) : [];
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentNote, setCurrentNote] = useState('');
    const [currentHistoryItem, setCurrentHistoryItem] = useState<HistoryItem | null>(null);

    // 持久化存储
    useEffect(() => {
        localStorage.setItem('jsonHistory', JSON.stringify(history));
    }, [history]);

    const handleInputChange = (e: { target: { value: string } }) => {
        const inputValue = e.target.value;
        setInputJson(inputValue);
        try {
            const trimInput = inputValue.trim();
            const formattedValue = JSON.stringify(JSON.parse(trimInput), null, 4);
            setFormattedJson(formattedValue);

            // 检查是否已存在相同的 input
            const existingItemIndex = history.findIndex((item) => item.input === trimInput);
            if (existingItemIndex !== -1) {
                // 如果存在相同的 input，更新 timestamp
                const updatedHistory = [...history];
                updatedHistory[existingItemIndex] = {
                    ...updatedHistory[existingItemIndex],
                    timestamp: Date.now(),
                };
                setHistory(updatedHistory);
            } else {
                // 如果不存在相同的 input，添加新记录
                setHistory((prev) => [
                    { input: trimInput, output: formattedValue, timestamp: Date.now(), operation: 'format' },
                    ...prev.slice(0, 19), // 保留最近20条记录
                ]);
            }
        } catch (err) {
            const error = err as Error;
            const errorMsg = error.message;
            const regex = /position (?<pos>\d+)/d;
            const match = error.message.match(regex);
            // @ts-ignore
            const errorPos = match?.groups?.pos ? parseInt(match.groups.pos) : -1;

            // 构建带标记的错误预览
            let errorPreview = inputValue;
            if (errorPos > -1) {
                const start = Math.max(0, errorPos - 10);
                const end = Math.min(inputValue.length, errorPos + 10);
                errorPreview = inputValue.slice(start, errorPos) + inputValue.slice(errorPos, end);
            }

            // 组合错误信息
            setFormattedJson(`JSON解析失败：
错误类型：${errorMsg}
错误位置：${errorPos > -1 ? `字符索引 ${errorPos}` : '未知位置'}
错误上下文：${errorPreview}`);
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

    const handleUnescapeString = () => {
        setFormattedJson(unescapeString(inputJson));
        setInputJson(unescapeString(inputJson));
        try {
            const formattedValue = JSON.stringify(JSON.parse(unescapeString(inputJson)), null, 4);
            setFormattedJson(formattedValue);
        } catch (error) {
            setFormattedJson('Invalid JSON');
        }
    };

    const handleEscapeString = () => {
        setInputJson(escapeString(inputJson));
        try {
            const formattedValue = JSON.stringify(JSON.parse(escapeString(inputJson)), null, 4);
            setFormattedJson(formattedValue);
        } catch (error) {
            setFormattedJson('Invalid JSON');
        }
    };

    // Function to escape special characters
    const escapeString = (str: string) => {
        return str.replace(/[\\"']/g, '\\$&').replace(/�/g, '\\0');
    };

    const unescapeString = (str: string) => {
        return str.replace(/\\([\\'"])/g, '$1');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(formattedJson);
    };

    const handleHistoryClick = (item: HistoryItem) => {
        setInputJson(item.input);
        setFormattedJson(item.output);
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
        <div>
            <Layout style={{ height: '85vh' }}>
                <Content style={{ display: 'flex', height: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '40%', marginRight: '10px', height: '100%', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '5px' }}>
                        <div style={{ height: '100%', padding: '0 0 10px 0' }}>
              <textarea
                  style={{ height: '100%', width: '100%', padding: '10px', resize: 'none', border: 'none', outline: 'none' }}
                  placeholder="在此处输入 JSON 字符串..."
                  value={inputJson}
                  onChange={handleInputChange}
              />
                        </div>
                        <div style={{ padding: '0 10px 10px 10px' }}>
                            <Button type="text" onClick={handleUnescapeString}>去转义</Button>
                            <Button type="text" onClick={handleEscapeString}>转义</Button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '60%', marginLeft: '10px', height: '100%', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '5px' }}>
                        <div style={{ height: '100%', overflow: 'auto' }}>
                            <SyntaxHighlighter language="json" style={docco}>
                                {formattedJson}
                            </SyntaxHighlighter>
                        </div>
                        <div style={{ marginTop: '10px', padding: '0 0 10px 10px' }}>
                            <Button type="text" onClick={handleCompress}>压缩</Button>
                            <Button type="text" onClick={handleCopy}>复制</Button>
                        </div>
                    </div>
                </Content>
            </Layout>

            <div style={{ marginTop: 10, borderTop: '1px solid #f0f0f0' }}>
        <span
            onClick={history.length > 0 ? clearHistory : undefined}
            style={{
                cursor: history.length > 0 ? 'pointer' : 'not-allowed',
                color: history.length > 0 ? '#1890ff' : '#bfbfbf',
            }}
        >
          Clear History
        </span>

                <List
                    bordered
                    dataSource={history}
                    renderItem={(item) => (
                        <List.Item
                            style={{ cursor: 'pointer', background: '#f5f5f5' }}
                            onClick={() => handleHistoryClick(item)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <div>
                                    <span style={{ marginRight: 20 }}>{new Date(item.timestamp).toLocaleString()}</span>
                                    <div>{item.input}</div>
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
                            onChange={(e: { target: { value: React.SetStateAction<string> } }) => setCurrentNote(e.target.value)}
                            placeholder="Add a note..."
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default JsonFormatComponent;