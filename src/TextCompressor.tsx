import React, { useState } from 'react';
import { Layout, Button, Card, Statistic, Input, Space } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

interface TextStats {
    totalChars: number;
    nonSpaceChars: number;
    lineCount: number;
    compressedLength?: number;
}

const TextCompressor = () => {
    const [inputText, setInputText] = useState('');
    const [compressedText, setCompressedText] = useState('');
    const [stats, setStats] = useState<TextStats>({
        totalChars: 0,
        nonSpaceChars: 0,
        lineCount: 0
    });

    // 字符统计逻辑‌:ml-citation{ref="2" data="citationList"}
    const calculateStats = (text: string) => ({
        totalChars: text.length,
        nonSpaceChars: text.replace(/\s/g, '').length,
        lineCount: text.split('\n').length
    });

    const runCompressCode = (str: string): string => {
        let encoded = '';
        let i = 0;
        let lineHasContent = false;  // 行内容标记‌:ml-citation{ref="1,2" data="citationList"}

        while (i < str.length) {
            const char = str[i];

            // 换行符处理‌:ml-citation{ref="1,2" data="citationList"}
            if (char === '\n') {
                if (lineHasContent) encoded += '\n';  // 仅保留含内容的换行
                lineHasContent = false;  // 重置行标记
                i++;
                continue;
            }

            // 空格压缩逻辑‌:ml-citation{ref="5" data="citationList"}
            if (char === ' ') {
                if (!lineHasContent) lineHasContent = true;  // 空格视为有效行内容
                encoded += ' ';
                while (i < str.length && str[i] === ' ') i++;
            }
            // 非空字符处理‌:ml-citation{ref="7" data="citationList"}
            else {
                encoded += char;
                lineHasContent = true;  // 标记有效行内容
                i++;
            }
        }

        // 删除纯空格行‌:ml-citation{ref="2" data="citationList"}
        return encoded.replace(/(\n) +(\n)/g, '$1$2');
    };




    const handleCompress = () => {
        const compressed = runCompressCode(inputText);
        setCompressedText(compressed);
        setStats(prev => ({
            ...prev,
            compressedLength: compressed.length
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setInputText(text);
        setStats(calculateStats(text));
    };

    return (
        <Layout.Content style={{ padding: 10, maxWidth: 1300, margin: '0 auto' }}>
    <Card title="文本输入" style={{ marginBottom: 10 }}>
    <Input.TextArea
        rows={10}
    value={inputText}
    onChange={handleInputChange}
    placeholder="输入需要统计和压缩的文本..."
        />
        </Card>

        <Card title="统计信息" style={{ marginBottom: 24 }}>
    <Space size="large">
    <Statistic title="总字符数" value={stats.totalChars} />
    <Statistic title="非空字符" value={stats.nonSpaceChars} />
    <Statistic title="行数" value={stats.lineCount} />
    {stats.compressedLength && (
        <Statistic title="压缩后长度" value={stats.compressedLength} />
    )}
    </Space>
    </Card>

    <Card
    title="压缩结果"
    extra={
        <Button
    icon={<CopyOutlined />}
    onClick={() => navigator.clipboard.writeText(compressedText)}
>
    复制
    </Button>
}
>
    <pre style={{ whiteSpace: 'pre-wrap' }}>
    {compressedText || '点击压缩按钮生成结果'}
    </pre>
    <Button
    type="primary"
    onClick={handleCompress}
    style={{ marginTop: 16 }}
>
    执行压缩
    </Button>
    </Card>
    </Layout.Content>
);
};

export default TextCompressor;
