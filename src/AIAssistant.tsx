import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Card, Spin, message } from 'antd';
import ReactMarkdown from 'react-markdown';

const { TextArea } = Input;

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const AIAssistant = () => {
    const [inputText, setInputText] = useState(''); // 用户输入的问题
    const [conversation, setConversation] = useState<Message[]>([]); // 对话记录
    const [isLoading, setIsLoading] = useState(false); // 加载状态
    const chatContainerRef = useRef<HTMLDivElement>(null); // 用于滚动到底部

    // 每次对话更新时，滚动到底部
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation]);

    // 发送问题并获取 AI 回复（流式输出）
    const askAI = async () => {
        if (!inputText.trim()) {
            message.warning('请输入你的问题！');
            return;
        }

        const userMessage: Message = { role: 'user', content: inputText };
        const newConversation = [...conversation, userMessage];
        setConversation(newConversation);
        setInputText('');
        setIsLoading(true);

        try {
            // 调用 AI 的 API（流式输出）
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer sk-4968b0afe65649f9a5a93ae104d6ad5b`, // 替换为你的 API Key
                },
                body: JSON.stringify({
                    model: 'deepseek-chat', // 模型名称
                    messages: [
                        {
                            role: 'system',
                            content: '你是一个 AI 助手，帮助用户解决问题。请用简洁明了的语言回答用户的问题。',
                        },
                        ...newConversation, // 包含上下文
                    ],
                    stream: true, // 启用流式输出
                }),
            });

            if (!response.ok) {
                throw new Error(`请求失败：${response.status} ${response.statusText}`);
            }

            // 创建一个新的 assistant 消息
            const assistantMessage: Message = { role: 'assistant', content: '' };
            setConversation((prev) => [...prev, assistantMessage]);

            // 读取流式数据
            const reader = response.body?.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            while (true) {
                const result = await reader?.read();
                if (result?.done) break;

                if (result?.value) {
                    const chunk = decoder.decode(result.value, { stream: true });
                    buffer += chunk;

                    // 按行分割数据
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || ''; // 将未处理完的部分保留在 buffer 中

                    for (const line of lines) {
                        if (line.trim() === '') continue;

                        try {
                            // 过滤掉非 JSON 格式的行（如 "data: [DONE]"）
                            if (line.startsWith('data: ')) {
                                const jsonString = line.replace('data: ', '');
                                if (jsonString === '[DONE]') {
                                    console.log('Stream completed.');
                                    continue; // 跳过结束标志
                                }

                                const data = JSON.parse(jsonString);
                                const content = data.choices[0]?.delta?.content || '';

                                // 更新 assistant 消息的内容
                                setConversation((prev) => {
                                    const lastMessage = prev[prev.length - 1];
                                    if (lastMessage.role === 'assistant') {
                                        return [
                                            ...prev.slice(0, -1),
                                            { ...lastMessage, content: lastMessage.content + content },
                                        ];
                                    }
                                    return prev;
                                });
                            }
                        } catch (error) {
                            console.error('解析流式数据失败:', error);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('获取 AI 回复失败:', error);
            message.error('获取 AI 回复失败，请稍后重试！');
        } finally {
            setIsLoading(false);
        }
    };

    // 处理输入框变化
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(e.target.value);
    };

    // 处理回车键发送
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            askAI();
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <Card title="AI 助手" style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <div
                    ref={chatContainerRef}
                    style={{
                        height: '400px',
                        overflowY: 'auto',
                        marginBottom: '20px',
                        border: '1px solid #f0f0f0',
                        borderRadius: '8px',
                        padding: '10px',
                    }}
                >
                    {conversation.map((message, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            {message.role === 'assistant' ? (
                                <div
                                    style={{
                                        backgroundColor: '#f0f5ff',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        marginBottom: '10px',
                                    }}
                                >
                                    <ReactMarkdown children={message.content} />
                                </div>
                            ) : (
                                <div
                                    style={{
                                        backgroundColor: '#e6f7ff',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        marginBottom: '10px',
                                    }}
                                >
                                    <strong>我:</strong> {message.content}
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            <Spin tip="AI 正在思考..." />
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextArea
                        value={inputText}
                        onChange={handleInputChange}
                        onPressEnter={handleKeyPress}
                        placeholder="输入你的问题"
                        autoSize={{ minRows: 3, maxRows: 6 }}
                        style={{ flex: 1, marginRight: '10px' }}
                    />
                    <Button type="primary" onClick={askAI} style={{ height: '100%' }} disabled={isLoading}>
                        发送
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default AIAssistant;