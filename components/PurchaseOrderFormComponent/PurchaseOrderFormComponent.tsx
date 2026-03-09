import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Table } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import usePurchaseOrderFormComponent from "./usePurchaseOrderFormComponent";
import { PurchaseOrderDto } from "@/dtos/purchaseOrderDto";

interface PurchaseOrderValues {
    id?: number;
    name: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
}

interface Props {
    open: boolean;
    docId?: number;
    articleId?: number;
    setOpen: (open: boolean) => void;
    reload?: () => void;
}


const PurchaseOrderFormComponent = ({ open, docId, articleId, setOpen, reload }: Props) => {

    const [disabled, setDisabled] = useState<boolean>(true);
    const [maxAmount, setMaxAmount] = useState<number>(Number.MAX_VALUE);
    const [showDetailError, setShowDetailError] = useState<boolean>(false);

    const {
        purchaseOrderService,
        form,
        articles,
        details,
        formArticleColumns,
        setIsUpdate,
        setNotUpdateList,
        setDetails,
        getFormArticleValues,
        getArticleOptions,
        fillForm
    } = usePurchaseOrderFormComponent({ articleId });

    useEffect(() => {
        if (open && docId)
            fillForm(docId);
    }, [open])

    const handleOk = () => {
        setShowDetailError(true);
        form.submit();
    };

    const handleCancel = () => {
        clearFields();
    };

    const checkArticle = () => {
        let amount = form.getFieldValue('amount');
        let articleId = form.getFieldValue('articleId');

        setDisabled(!(amount > 0 && !!articleId));
    }

    const addArticle = () => {
        let amount = form.getFieldValue('amount');
        let articleId = form.getFieldValue('articleId');
        setDetails([...details, { articleId, amount }]);
        form.resetFields(['articleId', 'amount']);
        setDisabled(true);
        setMaxAmount(Number.MAX_VALUE);
    }

    const onArticleChange = (articleId: number) => {
        const article = articles.find(a => a.id === articleId);
        const newAmount = article?.stock ?? Number.MAX_VALUE;
        setMaxAmount(newAmount);
        if (form.getFieldValue('amount') > newAmount) {
            form.setFieldValue('amount', 0);
        }
        checkArticle();
    }

    const onFinish = async (values: PurchaseOrderValues) => {

        let purchaseOrder: PurchaseOrderDto = {
            name: values.name,
            address: values.address ?? '',
            phoneNumber: values.phoneNumber ?? '',
            email: values.email ?? '',
            state: true,
            purchaseOrderDetails: details
        }

        if (!values.id) {
            await purchaseOrderService.createPurchaseOrder(purchaseOrder);
        } else {
            await purchaseOrderService.updatePurchaseOrder({ id: Number(values.id), ...purchaseOrder });
        }

        if (reload) reload();

        clearFields();
    };

    const onFinishFailed = (_: any) => { };

    const clearFields = () => {
        setIsUpdate(false);
        setNotUpdateList([]);
        setOpen(false);
        setShowDetailError(false);
        setMaxAmount(Number.MAX_VALUE);
        setDetails([]);
        form.resetFields();
    }

    return (<>
        <Modal
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Guardar"
            cancelText="Cancelar"
        >
            <Title className="text-center" level={3}>Llene los campos</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    name="id"
                    className="d-none"
                >
                    <Input type="hidden" />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={24} lg={12}>
                        <Form.Item
                            label="Nombre o Razón Social"
                            name="name"
                            rules={[{ required: true, message: 'Ingrese el nombre o razón social' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} lg={12}>
                        <Form.Item
                            label="Dirección"
                            name="address"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} lg={12}>
                        <Form.Item
                            label="Teléfono"
                            name="phoneNumber"
                            rules={[
                                { pattern: /^[0-9-()\s]+$/, message: 'Asegurese que es un numero de teléfono valido' },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} lg={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { type: "email", message: "Ingrese un email valido" },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} lg={5}>
                        <Form.Item
                            label="Cantidad"
                            name="amount"
                        >
                            <InputNumber min={0} max={maxAmount} onChange={checkArticle} className="w-100" />
                        </Form.Item>
                    </Col>
                    <Col span={24} lg={19}>
                        <Row align="bottom" gutter={5}>
                            <Col flex={1}>
                                <Form.Item
                                    name="articleId"
                                    label="Articulo"
                                    rules={[
                                        {
                                            validator: (_, __) => {
                                                if (showDetailError && details.length === 0) {
                                                    return Promise.reject(new Error("Es necesario agregar al menos un articulo"));
                                                }
                                                return Promise.resolve();
                                            }
                                        }
                                    ]}
                                >
                                    <Select
                                        onChange={onArticleChange}
                                        allowClear
                                        placeholder="Seleccione un articulo"
                                        options={getArticleOptions()}
                                        showSearch={{ optionFilterProp: 'label' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Button
                                    disabled={disabled}
                                    type="primary"
                                    style={{ marginBottom: '24px' }}
                                    onClick={addArticle}
                                >
                                    <PlusOutlined />
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {
                    details.length > 0
                    &&
                    <Table
                        pagination={false}
                        dataSource={getFormArticleValues()}
                        columns={formArticleColumns}
                    />
                }
            </Form>
        </Modal>
    </>)
}

export default PurchaseOrderFormComponent;