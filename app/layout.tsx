'use client';

import { Layout, Menu } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import "./styles/global.scss";
import { useRouter, usePathname } from 'next/navigation'
import { useMemo, useState } from "react";
import { BankOutlined, ProductOutlined } from "@ant-design/icons";
import RootComponent from '@/components/rootComponent/rootComponent';

const items = [
    { key: "catalog", label: "Catalogo", icon: <ProductOutlined /> },
    { key: "purchaseOrder", label: "Ordenes", icon: <BankOutlined /> },
]

export default function LayoutComponent({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    const selectedKey = useMemo(() => pathname.split("/")[1] || items[0].key, [pathname]);

    return (
        <RootComponent>
            <Layout style={{ minHeight: "100vh" }}>
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                >
                    <div style={{ color: "white", textAlign: "center", padding: "16px" }}>
                        Paper & Hope
                    </div>

                    <Menu
                        theme="dark"
                        defaultSelectedKeys={[selectedKey]}
                        mode="inline"
                        onClick={({ key }) => router.push(key)}
                        items={items}
                    >
                    </Menu>
                </Sider>

                <Layout style={{ background: "white" }}>
                    <Content style={{ margin: "24px" }}>
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </RootComponent>
    );
}