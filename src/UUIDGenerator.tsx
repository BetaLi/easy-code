import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Typography, InputNumber, Checkbox, Button, Input } from 'antd';

const { Title } = Typography;
const { TextArea } = Input;

const UUIDGenerator = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [useUpperCase, setUseUpperCase] = useState(false);

  const generateUUIDs = () => {
    const newUuids = Array.from({ length: count }, () => {
      const uuid = uuidv4();
      return useUpperCase ? uuid.toUpperCase() : uuid;
    });
    setUuids(uuidList => [...uuidList, ...newUuids]);
  };

  const handleTextAreaChange = (e:{target:{value:any;}}) => {
    setUuids(e.target.value.split('\n'));
  };

  return (
    <div>
      <Title level={2}>UUID Generator</Title>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <Checkbox
          checked={useUpperCase}
          onChange={(e) => setUseUpperCase(e.target.checked)}
          style={{ marginRight: '10px' }}
        >
          Use uppercase letters
        </Checkbox>
        <span style={{ marginRight: '10px' }}>Number of UUIDs to generate:</span>
        <InputNumber
          min={1}
          max={100}
          value={count}
          onChange={(value) => setCount(value || 1)}
          style={{ marginRight: '10px' }}
        />
        <Button type="primary" onClick={generateUUIDs}>
          Generate UUIDs
        </Button>
      </div>
      <TextArea
        style={{ height: '80vh' }} // 设置 TextArea 的高度为视口的 80%
        value={uuids.join('\n')}
        onChange={handleTextAreaChange} // 允许用户编辑 TextArea
        placeholder="Generated UUIDs will appear here..."
      />
    </div>
  );
};

export default UUIDGenerator;
