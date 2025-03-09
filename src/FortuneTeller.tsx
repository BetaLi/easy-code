import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Card, Spin, message, Form, Select, DatePicker } from 'antd';
import ReactMarkdown from 'react-markdown';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface FortuneMessage {
    role: 'user' | 'assistant';
    content: string;
}

const FortuneTeller = () => {
    const [inputText, setInputText] = useState(''); // 用户输入的问题
    const [fortuneConversation, setFortuneConversation] = useState<FortuneMessage[]>([]); // 对话记录
    const [isLoading, setIsLoading] = useState(false); // 加载状态
    const [userInfo, setUserInfo] = useState({
        birthDate: '',
        gender: '',
        birthTime: '',
    }); // 用户信息
    const [step, setStep] = useState(1); // 当前步骤（1: 收集信息，2: 算命）
    const chatContainerRef = useRef<HTMLDivElement>(null); // 用于滚动到底部

    // 每次对话更新时，滚动到底部
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [fortuneConversation]);

    // 收集用户信息
    const handleUserInfoSubmit = (values: any) => {
        const { birthDate, gender, birthTime } = values;
        setUserInfo({
            birthDate: dayjs(birthDate).format('YYYY-MM-DD'),
            gender,
            birthTime: dayjs(birthTime).format('HH:mm'),
        });
        setStep(2); // 进入算命步骤
    };

    // 发送问题并获取算命结果（流式输出）
    const askFortune = async () => {
        if (!inputText.trim()) {
            message.warning('请输入你的问题！');
            return;
        }

        const userMessage: FortuneMessage = { role: 'user', content: inputText };
        const newConversation = [...fortuneConversation, userMessage];
        setFortuneConversation(newConversation);
        setInputText('');
        setIsLoading(true);

        try {
            // 调用 DeepSeek 的 API（流式输出）
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
                            content: `你是一位精通周易八卦的算命大师，擅长通过生辰八字和八卦推演命运。以下是用户的信息：
- 出生日期: ${userInfo.birthDate}
- 出生时间: ${userInfo.birthTime}
- 性别: ${userInfo.gender}
请根据这些信息，结合周易八卦的原理，用专业且神秘的语气回答用户的问题。`,
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
            const assistantMessage: FortuneMessage = { role: 'assistant', content: '' };
            setFortuneConversation((prev) => [...prev, assistantMessage]);

            // 读取流式数据
            const reader = response.body?.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            while (true) {
                const result = await reader?.read();
                if (result) {
                    const { value, done } = result;
                    if (done) break; // 流结束

                    // 解码数据块并追加到缓冲区
                    buffer += decoder.decode(value, { stream: true });

                    // 按行分割缓冲区
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || ''; // 将不完整的行保留在缓冲区

                    for (const line of lines) {
                        if (line.trim() === 'data: [DONE]') {
                            console.log('Stream completed.');
                            continue; // 跳过结束标志
                        }

                        if (line.startsWith('data: ')) {
                            const jsonString = line.replace('data: ', '');
                            try {
                                const data = JSON.parse(jsonString);
                                const content = data.choices[0]?.delta?.content || '';

                                // 使用函数式更新，确保状态更新准确
                                setFortuneConversation((prev) => {
                                    const lastMessage = prev[prev.length - 1];
                                    if (lastMessage.role === 'assistant') {
                                        lastMessage.content += content;
                                    }
                                    return [...prev];
                                });
                            } catch (error) {
                                console.error('解析流式数据失败:', error);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('获取算命结果失败:', error);
            message.error('获取算命结果失败，请稍后重试！');
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
            askFortune();
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <Card title="AI 周易八卦算命大师" style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                {step === 1 ? (
                    // 第一步：收集用户信息
                    <Form onFinish={handleUserInfoSubmit}>
                        <Form.Item
                            label="出生日期"
                            name="birthDate"
                            rules={[{ required: true, message: '请输入你的出生日期！' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            label="出生时间"
                            name="birthTime"
                            rules={[{ required: true, message: '请输入你的出生时间！' }]}
                        >
                            <DatePicker.TimePicker style={{ width: '100%' }} format="HH:mm" />
                        </Form.Item>
                        <Form.Item
                            label="性别"
                            name="gender"
                            rules={[{ required: true, message: '请选择你的性别！' }]}
                        >
                            <Select placeholder="请选择性别">
                                <Option value="男">男</Option>
                                <Option value="女">女</Option>
                                <Option value="其他">其他</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                下一步
                            </Button>
                        </Form.Item>
                    </Form>
                ) : (
                    // 第二步：算命
                    <>
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
                            {fortuneConversation.map((message, index) => (
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
                                    <Spin tip="算命大师正在为你占卜..." />
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <TextArea
                                value={inputText}
                                onChange={handleInputChange}
                                onPressEnter={handleKeyPress}
                                placeholder="输入你的问题，例如：我的运势如何？"
                                autoSize={{ minRows: 3, maxRows: 6 }}
                                style={{ flex: 1, marginRight: '10px' }}
                            />
                            <Button type="primary" onClick={askFortune} style={{ height: '100%' }} disabled={isLoading}>
                                占卜
                            </Button>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default FortuneTeller;