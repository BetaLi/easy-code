import React, { useState, useRef, useEffect } from 'react';
import { Input, Button } from 'antd';
import axios from 'axios';

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
                        <span style={{ fontWeight: message.role === 'user' ? 'bold' : 'normal' }}>{message.role === 'user' ? 'You: ' : 'Bot: '}</span>
                        <span>{message.content}</span>
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
