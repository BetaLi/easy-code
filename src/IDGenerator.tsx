import React, { useState, useEffect } from 'react';
import { Tabs, Input, Typography, InputNumber, Checkbox, Button, Select } from 'antd';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const IDGenerator = () => {
  const [activeTab, setActiveTab] = useState('hash'); // 当前激活的选项卡
  const [textToHash, setTextToHash] = useState(''); // 用于哈希生成的输入文本
  const [hashes, setHashes] = useState({
    MD5: '',
    SHA1: '',
    SHA256: '',
    SHA512: '',
  }); // 存储生成的哈希值
  const [uuids, setUuids] = useState<string[]>([]); // 存储生成的 UUID
  const [count, setCount] = useState(1); // 生成 UUID 的数量
  const [useUpperCase, setUseUpperCase] = useState(false); // 是否使用大写字母
  const [randomStrings, setRandomStrings] = useState<string[]>([]); // 存储生成的随机字符串
  const [randomStringLength, setRandomStringLength] = useState(10); // 随机字符串长度
  const [includeSpecialChars, setIncludeSpecialChars] = useState(false); // 是否包含特殊字符
  const [numericIds, setNumericIds] = useState<string[]>([]); // 存储生成的数字 ID
  const [numericIdLength, setNumericIdLength] = useState(8); // 数字 ID 长度
  const [guids, setGuids] = useState<string[]>([]); // 存储生成的 GUID
  const [timestampIds, setTimestampIds] = useState<string[]>([]); // 存储生成的时间戳 ID
  const [includeRandomSuffix, setIncludeRandomSuffix] = useState(false); // 是否包含随机后缀

  // 哈希生成逻辑
  useEffect(() => {
    if (textToHash) {
      setHashes({
        MD5: CryptoJS.MD5(textToHash).toString(),
        SHA1: CryptoJS.SHA1(textToHash).toString(),
        SHA256: CryptoJS.SHA256(textToHash).toString(),
        SHA512: CryptoJS.SHA512(textToHash).toString(),
      });
    } else {
      setHashes({
        MD5: '',
        SHA1: '',
        SHA256: '',
        SHA512: '',
      });
    }
  }, [textToHash]);

  // UUID 生成逻辑
  const generateUUIDs = () => {
    const newUuids = Array.from({ length: count }, () => {
      const uuid = uuidv4();
      return useUpperCase ? uuid.toUpperCase() : uuid;
    });
    setUuids((uuidList) => [...uuidList, ...newUuids]);
  };

  // 随机字符串生成逻辑
  const generateRandomStrings = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const charSet = includeSpecialChars ? chars + specialChars : chars;

    const newRandomStrings = Array.from({ length: count }, () => {
      return Array.from({ length: randomStringLength }, () => {
        return charSet[Math.floor(Math.random() * charSet.length)];
      }).join('');
    });
    setRandomStrings((randomStringList) => [...randomStringList, ...newRandomStrings]);
  };

  // 数字 ID 生成逻辑
  const generateNumericIds = () => {
    const newNumericIds = Array.from({ length: count }, () => {
      return Array.from({ length: numericIdLength }, () => {
        return Math.floor(Math.random() * 10);
      }).join('');
    });
    setNumericIds((numericIdList) => [...numericIdList, ...newNumericIds]);
  };

  // GUID 生成逻辑
  const generateGuids = () => {
    const newGuids = Array.from({ length: count }, () => {
      const guid = uuidv4();
      return useUpperCase ? guid.toUpperCase() : guid;
    });
    setGuids((guidList) => [...guidList, ...newGuids]);
  };

  // 时间戳 ID 生成逻辑
  const generateTimestampIds = () => {
    const newTimestampIds = Array.from({ length: count }, () => {
      const timestamp = Date.now().toString();
      const randomSuffix = includeRandomSuffix
          ? Math.floor(Math.random() * 1000).toString().padStart(3, '0')
          : '';
      return timestamp + randomSuffix;
    });
    setTimestampIds((timestampIdList) => [...timestampIdList, ...newTimestampIds]);
  };

  // 处理哈希输入变化
  const handleTextChange = (e: { target: { value: string } }) => {
    setTextToHash(e.target.value);
  };

  // 处理 UUID 输入变化
  const handleTextAreaChange = (e: { target: { value: string } }, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(e.target.value.split('\n'));
  };

  return (
      <div>
        <Title level={2}>ID Generator</Title>
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
          {/* 哈希生成器选项卡 */}
          <TabPane tab="Hash Generator" key="hash">
            <TextArea
                rows={4}
                value={textToHash}
                onChange={handleTextChange}
                placeholder="Enter text to hash"
                style={{ marginBottom: 20 }}
            />
            <div>
              {Object.entries(hashes).map(([algorithm, hashValue]) => (
                  hashValue && (
                      <Paragraph key={algorithm}>
                        <Title level={5}>{algorithm}:</Title>
                        {hashValue}
                      </Paragraph>
                  )
              ))}
            </div>
          </TabPane>

          {/* UUID 生成器选项卡 */}
          <TabPane tab="UUID Generator" key="uuid">
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
                style={{ height: '50vh' }} // 设置 TextArea 的高度
                value={uuids.join('\n')}
                onChange={(e) => handleTextAreaChange(e, setUuids)} // 允许用户编辑 TextArea
                placeholder="Generated UUIDs will appear here..."
            />
          </TabPane>

          {/* 随机字符串生成器选项卡 */}
          <TabPane tab="Random String Generator" key="randomString">
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              <Checkbox
                  checked={includeSpecialChars}
                  onChange={(e) => setIncludeSpecialChars(e.target.checked)}
                  style={{ marginRight: '10px' }}
              >
                Include special characters
              </Checkbox>
              <span style={{ marginRight: '10px' }}>Length of random string:</span>
              <InputNumber
                  min={1}
                  max={100}
                  value={randomStringLength}
                  onChange={(value) => setRandomStringLength(value || 10)}
                  style={{ marginRight: '10px' }}
              />
              <Button type="primary" onClick={generateRandomStrings}>
                Generate Random Strings
              </Button>
            </div>
            <TextArea
                style={{ height: '50vh' }}
                value={randomStrings.join('\n')}
                onChange={(e) => handleTextAreaChange(e, setRandomStrings)}
                placeholder="Generated random strings will appear here..."
            />
          </TabPane>

          {/* 数字 ID 生成器选项卡 */}
          <TabPane tab="Numeric ID Generator" key="numericId">
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px' }}>Length of numeric ID:</span>
              <InputNumber
                  min={1}
                  max={20}
                  value={numericIdLength}
                  onChange={(value) => setNumericIdLength(value || 8)}
                  style={{ marginRight: '10px' }}
              />
              <Button type="primary" onClick={generateNumericIds}>
                Generate Numeric IDs
              </Button>
            </div>
            <TextArea
                style={{ height: '50vh' }}
                value={numericIds.join('\n')}
                onChange={(e) => handleTextAreaChange(e, setNumericIds)}
                placeholder="Generated numeric IDs will appear here..."
            />
          </TabPane>

          {/* GUID 生成器选项卡 */}
          <TabPane tab="GUID Generator" key="guid">
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              <Checkbox
                  checked={useUpperCase}
                  onChange={(e) => setUseUpperCase(e.target.checked)}
                  style={{ marginRight: '10px' }}
              >
                Use uppercase letters
              </Checkbox>
              <span style={{ marginRight: '10px' }}>Number of GUIDs to generate:</span>
              <InputNumber
                  min={1}
                  max={100}
                  value={count}
                  onChange={(value) => setCount(value || 1)}
                  style={{ marginRight: '10px' }}
              />
              <Button type="primary" onClick={generateGuids}>
                Generate GUIDs
              </Button>
            </div>
            <TextArea
                style={{ height: '50vh' }}
                value={guids.join('\n')}
                onChange={(e) => handleTextAreaChange(e, setGuids)}
                placeholder="Generated GUIDs will appear here..."
            />
          </TabPane>

          {/* 时间戳 ID 生成器选项卡 */}
          <TabPane tab="Timestamp ID Generator" key="timestampId">
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              <Checkbox
                  checked={includeRandomSuffix}
                  onChange={(e) => setIncludeRandomSuffix(e.target.checked)}
                  style={{ marginRight: '10px' }}
              >
                Include random suffix
              </Checkbox>
              <span style={{ marginRight: '10px' }}>Number of IDs to generate:</span>
              <InputNumber
                  min={1}
                  max={100}
                  value={count}
                  onChange={(value) => setCount(value || 1)}
                  style={{ marginRight: '10px' }}
              />
              <Button type="primary" onClick={generateTimestampIds}>
                Generate Timestamp IDs
              </Button>
            </div>
            <TextArea
                style={{ height: '50vh' }}
                value={timestampIds.join('\n')}
                onChange={(e) => handleTextAreaChange(e, setTimestampIds)}
                placeholder="Generated timestamp IDs will appear here..."
            />
          </TabPane>
        </Tabs>
      </div>
  );
};

export default IDGenerator;