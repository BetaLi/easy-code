import React, { useState, useEffect } from 'react';
import {Layout, Button, List, message} from 'antd';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const { Content } = Layout;

SyntaxHighlighter.registerLanguage('json', json);

interface HistoryItem {
    input: string;
    output: string;
    timestamp: number;
    operation?: string;
}

const JsonFormatComponent = () => {
    const [inputJson, setInputJson] = useState('');
    const [formattedJson, setFormattedJson] = useState('');
    const [history, setHistory] = useState<HistoryItem[]>(() => {
        const stored = localStorage.getItem('jsonHistory');
        return stored ? JSON.parse(stored) : [];
    });

    // 持久化存储‌:ml-citation{ref="1,2" data="citationList"}
    useEffect(() => {
        localStorage.setItem('jsonHistory', JSON.stringify(history));
    }, [history]);

    const handleInputChange = (e: { target: { value: string } }) => {
        const inputValue = e.target.value;
        setInputJson(inputValue);
        try {
            const formattedValue = JSON.stringify(JSON.parse(inputValue), null, 4);
            setFormattedJson(formattedValue);
            // 移除防抖直接记录‌:ml-citation{ref="3,4" data="citationList"}
            setHistory(prev => [
                { input: inputValue, output: formattedValue, timestamp: Date.now(), operation: 'format' },
                ...prev.slice(0, 9)
            ]);
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
                errorPreview =
                    inputValue.slice(start, errorPos) + inputValue.slice(errorPos, end)
            }

            // @ts-ignore
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
    }

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

    const handleCopy = () => {
        navigator.clipboard.writeText(formattedJson);
    };

    // 保持其他操作方法不变
    const handleOperation = (output: string, operation: string) => {
        setHistory(prev => [
            { input: inputJson, output, timestamp: Date.now(), operation },
            ...prev.slice(0, 9)
        ]);
    };

    // 新增点击处理函数
    const handleHistoryClick = (item: HistoryItem) => {
        setInputJson(item.input);          // 回填原始输入内容‌:ml-citation{ref="1,7" data="citationList"}
        setFormattedJson(item.output);     // 同步显示格式化结果‌:ml-citation{ref="3,4" data="citationList"}
    };

    const clearHistory = () => {
        setHistory([]);
        message.success('History cleared');
    };


    return (
        <div>
            <Layout style={{ height: '85vh' }}>
                <Content style={{ display: 'flex', height: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '40%', marginRight: '10px', height: '100%', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '5px' }}>
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
                    <div style={{ display: 'flex', flexDirection: 'column', width: '60%', marginLeft: '10px', height: '100%', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '5px' }}>
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

            <div style={{ marginTop: 10, borderTop: '1px solid #f0f0f0' }}>
                <span
                    onClick={history.length > 0 ? clearHistory : undefined}
                    style={{
                        cursor: history.length > 0 ? 'pointer' : 'not-allowed',
                        color: history.length > 0 ? '#1890ff' : '#bfbfbf'
                    }}
                >
                Clear History
                </span>

                <List
                    bordered
                    dataSource={history}

                    renderItem={(item) => (
                        <List.Item style={{ cursor: 'pointer', background: '#f5f5f5'}} onClick={() => handleHistoryClick(item)}>
                            <span style={{ marginRight: 20 }}>{new Date(item.timestamp).toLocaleString()}</span>
                            {item.input}
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default JsonFormatComponent;