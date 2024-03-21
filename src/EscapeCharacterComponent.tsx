import React, { useState } from 'react';
import { Input, Button, Radio, Typography, RadioChangeEvent } from 'antd';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const EscapeCharacterComponent = () => {
  const [text, setText] = useState('');
  const [processedText, setProcessedText] = useState('');
  const [action, setAction] = useState('unescape');

  const handleChange = (e:{target:{value:any;}}) => {
    setText(e.target.value);
  };

  const handleRadioChange = (e:RadioChangeEvent) => {
    setAction(e.target.value);
  };

  const handleProcessText = () => {
    if (action === 'escape') {
      setProcessedText(escapeString(text));
    } else {
      setProcessedText(unescapeString(text));
    }
  };

  // Function to escape special characters
  const escapeString = (str:string) => {
    return str.replace(/[\\"']/g, '\\$&').replace(/�/g, '\\0');
  };

  // Function to unescape special characters
  const unescapeString = (str:string) => {
    return str.replace(/\\([\\'"])/g, '$1');
  };

  return (
    <div>
      <Title level={2}>Escape Character Handler</Title>
      <TextArea rows={6} value={text} onChange={handleChange} placeholder="Enter text here..." />
      <Radio.Group value={action} onChange={handleRadioChange} style={{ margin: '20px 0' }}>
        <Radio value="unescape">Remove Escape Characters</Radio>
        <Radio value="escape">Add Escape Characters</Radio>
      </Radio.Group>
      <Button type="primary" onClick={handleProcessText}>
        Process Text
      </Button>
      {processedText && (
        <Paragraph style={{ marginTop: 20, height: '40vh'}}>
          <Title level={4}>Processed Text:</Title>
          <TextArea rows={14} value={processedText} readOnly />
        </Paragraph>
      )}
    </div>
  );
};

export default EscapeCharacterComponent;
