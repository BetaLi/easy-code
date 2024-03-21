import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import JsonFormatComponent from "./JsonFromatComponent";
import UrlEncodeDecodeComponent from "./UrlEncodeDecodeComponent";
import Base64EncoderDecoder from "./Base64EncoderDecoder";
import HashGenerateComponent from "./HashGenerator";

const { Item, ItemGroup } = Menu;
const {Content, Sider } = Layout;

const App = () => {
    const [selectedMenu, setSelectedMenu] = useState('1');

    const handleClick = (any: { key: React.SetStateAction<string>; }) => {
        setSelectedMenu(any?.key);
    };

    return (
        <Layout>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedMenu]}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                        onClick={handleClick}
                    >
                        <ItemGroup key="group" title="Format">
                            <Item key="1">JSONFormat</Item>
                            <Item key="2">URL Encode&Decode</Item>
                            <Item key="3">Base64 Encoder&Decoder</Item>
                            <Item key="4">Hash Generator</Item>
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
                        
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;
