import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import JsonFormatComponent from "./JsonFromatComponent";
import UrlEncodeDecodeComponent from "./UrlEncodeDecodeComponent";

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
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;
