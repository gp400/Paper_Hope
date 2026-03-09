import { ServicesProvider } from "@/providers/servicesProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ReactNode } from "react";

interface RootProps {
    children: ReactNode; // allows React/HTML elements
}

export default function RootComponent({ children }: RootProps) {
    return (
        <html lang="en">
            <head>
                <title>Paper & Hope</title>
            </head>
            <body>
                <ServicesProvider>
                    <AntdRegistry>
                        {children}
                    </AntdRegistry>
                </ServicesProvider>
            </body>
        </html>
    );
}