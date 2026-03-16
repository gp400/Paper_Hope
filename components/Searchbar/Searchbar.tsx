import { Button, Col, Input, Row } from "antd";
import "./Searchbar.scss";
import { SearchOutlined } from "@ant-design/icons";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface SearchBarProps {
    placeholder: string;
    searchFunction: (filter: string) => Promise<void>
}

export interface SearchBarHandle {
    triggerSearch: () => Promise<void>
}

const Searchbar = forwardRef<SearchBarHandle, SearchBarProps>(({ placeholder, searchFunction }, ref) => {

    useImperativeHandle(ref, () => ({
        async triggerSearch() {
            await searchFunction(filter);
        }
    }))

    const [filter, setFilter] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            await searchFunction(filter)
        }
    };

    return (<>
        <Row>
            <Col flex="1" style={{ width: '250px' }}>
                <Input className="searchbar" placeholder={placeholder} value={filter} onKeyDown={handleKeyDown} onChange={handleChange} allowClear />
            </Col>
            <Col>
                <Button className="search-btn" type="primary" onClick={async () => await searchFunction(filter)} icon={<SearchOutlined />} />
            </Col>
        </Row>
    </>)
})

export default Searchbar;