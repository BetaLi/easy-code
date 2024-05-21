import React, { useState } from 'react';
import { Input, Button, Row, Col } from 'antd';
import DiffViewer, { DiffMethod } from 'react-diff-viewer';

const { TextArea } = Input;

const TextDiffComponent = () => {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={16} style={{ marginBottom: '20px' }}>
                <Col span={12}>
                    <TextArea
                        value={text1}
                        onChange={(e) => setText1(e.target.value)}
                        placeholder="输入文本1"
                        autoSize={{ minRows: 5, maxRows: 10 }}
                        style={{ height: '100%', overflowY: 'scroll' }}
                    />
                </Col>
                <Col span={12}>
                    <TextArea
                        value={text2}
                        onChange={(e) => setText2(e.target.value)}
                        placeholder="输入文本2"
                        autoSize={{ minRows: 5, maxRows: 10 }}
                        style={{ height: '100%', overflowY: 'scroll' }}
                    />
                </Col>
            </Row>
            <h2 style={{ marginBottom: '20px' }}>比对结果：</h2>
            <DiffViewer
                oldValue={text1}
                newValue={text2}
                splitView={true}
                compareMethod={DiffMethod.WORDS}
                styles={{ lineNumber: { minWidth: '0.5em' },
                    diffContainer: {
                        fontSize: '13px', // 设置比对结果的字体大小
                    } }}
            />
        </div>
    );
};

export default TextDiffComponent;
