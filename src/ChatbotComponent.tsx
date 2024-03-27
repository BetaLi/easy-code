import React, { useState, useRef, useEffect } from 'react';
import { Input, Button } from 'antd';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // 导入 react-markdown

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const { TextArea } = Input;

const ChatbotComponent = () => {
    const [inputText, setInputText] = useState('');
    const [conversation, setConversation] = useState<Message[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 每次对话更新时，滚动到底部
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation]);

    const sendMessage = async () => {
        if (!inputText) return;

        console.log("inputText", inputText);
        const userMessage: Message = { role: 'user', content: inputText };
        const newConversation = [...conversation, userMessage];
        setConversation(newConversation);
        setInputText('');

        try {
            const response = await axios.post('https://www.jcapikey.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: newConversation,
            }, {
                headers: {
                    'Authorization': `Bearer sk-Al02kG89cTbb8AJe30E7A046Fc374d639975EdB200088f9b`,
                    'Content-Type': 'application/json'
                }
            });

            const { choices } = response.data;
            const botReply = choices[0].message.content;

            setConversation([
                ...newConversation,
                { role: 'assistant', content: botReply }
            ]);
            setInputText('');
        } catch (error) {
            console.error('Error fetching response from OpenAI:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(e.target.value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div style={{ height: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
                {conversation.map((message, index) => (
                    <div key={index} style={{ marginBottom: '5px' }}>
                        <div style={{ marginBottom: '5px' }}>

                            {/* 使用条件渲染为机器人回复添加浅蓝色背景 */}
                            {message.role === 'assistant' ? (
                                <div
                                    style={{
                                        backgroundColor: '#cfe6ff',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        marginBottom: '5px',
                                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <ReactMarkdown children={message.content} />
                                </div>
                            ) : (
                                    <ReactMarkdown children={`**YOU:** ${message.content}`} />
                                )}
                        </div>
                        {/* 添加分隔线，仅在机器人回复后且不是最后一条消息时显示 */}
                        {message.role === 'assistant' && index < conversation.length - 1 && conversation[index + 1].role === 'user' && (
                            <hr style={{ margin: '5px 0', border: 'none', borderBottom: '2px dashed #ccc' }} />
                        )}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TextArea
                    value={inputText}
                    onChange={handleInputChange}
                    onPressEnter={handleKeyPress}
                    placeholder="Type your message here..."
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    style={{ flex: 1, marginRight: '10px' }}
                />
                <Button type="primary" onClick={sendMessage} style={{ height: '100%' }}>Send</Button>
            </div>
        </div>
    );
};

export default ChatbotComponent;
