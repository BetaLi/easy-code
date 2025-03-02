import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import JsonFormatComponent from "./JsonFromatComponent";
import UrlEncodeDecodeComponent from "./UrlEncodeDecodeComponent";
import Base64EncoderDecoder from "./Base64EncoderDecoder";
import HashGenerateComponent from "./HashGenerator";
import UUIDGenerator from "./UUIDGenerator";
import EscapeCharacterComponent from "./EscapeCharacterComponent";
import QRCodeGenerator from "./QRCodeGenerator";
import TimestampConverter from "./TimestampConverter";
import ChatbotComponent from "./ChatbotComponent";
import TextDiffComponent from "./TextDiffComponent";
import  TextCompressor from "./TextCompressor";

const { Item, ItemGroup } = Menu;
const {Content, Sider,Footer } = Layout;

const App = () => {
    const [selectedMenu, setSelectedMenu] = useState('1');

    const handleClick = (any: { key: React.SetStateAction<string>; }) => {
        setSelectedMenu(any?.key);
    };

    return (
        <Layout>
            <Layout>
                <Sider width={170} className="site-layout-background">
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedMenu]}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                        onClick={handleClick}
                    >
                        <ItemGroup key="group" title="文本处理">
                            <Item key="1">JSON 格式化</Item>
                            <Item key="10">字符统计</Item>
                            <Item key="6">文本比对</Item>
                            <Item key="2">URL 加解码</Item>
                            <Item key="3">Base64 加解码</Item>
                            
                        </ItemGroup>

                        <ItemGroup key="group" title="生成器">
                            <Item key="7">二维码 生成器</Item>
                            <Item key="4">Hash 生成器</Item>
                            <Item key="5">UUID 生成器</Item>
                        </ItemGroup>
                        <ItemGroup key="group" title="聊天">
                            <Item key="9">聊天机器人</Item>

                        </ItemGroup>

                        <ItemGroup key="group" title="其他">
                            <Item key="8">时间戳转换</Item>
                            
                        </ItemGroup>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        {selectedMenu === '1' && <JsonFormatComponent />}
                        {selectedMenu === '2' && <UrlEncodeDecodeComponent />}
                        {selectedMenu === '3' && <Base64EncoderDecoder />}
                        {selectedMenu === '4' && <HashGenerateComponent />}
                        {selectedMenu === '5' && <UUIDGenerator />}
                        {selectedMenu === '6' && <TextDiffComponent />}
                        {selectedMenu === '7' && <QRCodeGenerator />}
                        {selectedMenu === '8' && <TimestampConverter />}
                        {selectedMenu === '9' && <ChatbotComponent />}
                        {selectedMenu === '10' && <TextCompressor />}
                    </Content>
                    <Footer style={{ textAlign: 'center', fontSize:'x-small' }}>
                        <a href="https://beian.miit.gov.cn/" style={{color:'gray'}} target="_blank">京ICP备2024067514号-1</a>
                    </Footer>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;
