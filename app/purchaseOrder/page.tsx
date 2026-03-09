"use client"

import { Button, Col, Flex, Row, Spin, Table } from "antd";
import Title from "antd/es/typography/Title";
import { useRef } from "react";
import Searchbar, { type SearchBarHandle } from "../../components/Searchbar/Searchbar";
import PurchaseOrderFormComponent from "../../components/PurchaseOrderFormComponent/PurchaseOrderFormComponent";
import { LoadingOutlined } from "@ant-design/icons";
import type { PurchaseOrderDto } from "@/dtos/purchaseOrderDto";
import usePurchaseOrder from "./usePurchaseOrder";

const PurchaseOrderPage = () => {

    const searchbarRef = useRef<SearchBarHandle>(null);

    const {
        docId,
        isLoading,
        open,
        purchaseOrders,
        purchaseOrdersColumns,
        purchaseOrdersDetailsColumns,
        setDocId,
        setOpen,
        onSearch
    } = usePurchaseOrder({ searchbarRef });

    const onCreateClick = () => {
        setOpen(true);
        setDocId(null)
    }

    const reload = async () => {
        searchbarRef.current?.triggerSearch();
    }

    return (<>
        <Title className="text-center">Ordenes de Compra</Title>

        <Row justify="space-between" gutter={[16, 5]}>
            <Col>
                <Button type="primary" onClick={onCreateClick}>
                    Crear una Orden
                </Button>
            </Col>
            <Col>
                <Searchbar ref={searchbarRef} placeholder={"Nombre, Email, Teléfono, Dirección"} searchFunction={onSearch} />
            </Col>
        </Row>

        {
            isLoading
                ? <Flex
                    justify="center"
                    align="center"
                    style={{ height: '50vh' }}
                >
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                </Flex>
                : <Table<PurchaseOrderDto>
                    className="mt-2"
                    dataSource={purchaseOrders}
                    columns={purchaseOrdersColumns}
                    scroll={{ x: 1000 }}
                    rowKey="id"
                    expandable={{
                        expandedRowRender: (record) => (
                            <Table
                                rowKey="id"
                                pagination={false}
                                dataSource={record.purchaseOrderDetails}
                                columns={purchaseOrdersDetailsColumns}
                            />
                        ),
                    }}
                />
        }

        <PurchaseOrderFormComponent
            open={open}
            docId={docId}
            setOpen={(open: boolean) => setOpen(open)}
            reload={reload}
        />
    </>)
}

export default PurchaseOrderPage;