"use client"

import PurchaseOrderFormComponent from "@/components/PurchaseOrderFormComponent/PurchaseOrderFormComponent";
import Searchbar, { SearchBarHandle } from "@/components/Searchbar/Searchbar";
import { ArticleDto } from "@/dtos/articleDto";
import { formatCurrency } from "@/utils/currency";
import { nullToNS } from "@/utils/nullToNS";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Col, Flex, Form, Input, InputNumber, Modal, Row, Skeleton, Spin, Upload, type UploadFile } from "antd";
import { Gutter } from "antd/es/grid/row";
import { Meta } from "antd/es/list/Item";
import Title from "antd/es/typography/Title";
import { useEffect, useRef, useState } from "react";
import useCatalog from "./useCatalog";
import styles from "./page.module.scss";
import { preventChars } from "@/utils/preventChars";

interface Image {
    file: UploadFile;
    fileList: UploadFile[]
}

interface ArticleValues {
    id: number;
    name: string;
    price: number;
    barcode: string;
    stock: number;
    minStock: number;
    maxStock: number;
    image: Image;
}

const gutter: [Gutter, Gutter] = [16, 16];
const invalidKeys = ['-'];

export default function CatalogPage() {

    const [form] = Form.useForm();
    const searchbarRef = useRef<SearchBarHandle>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [stockClass, setStockClass] = useState<string>("");
    const [showSkeleton, setShowSkeleton] = useState<boolean>(false);

    const {
        isLoading,
        articleId,
        articles,
        fileList,
        isModalOpen,
        isPOModalOpen,
        contextHolder,
        setIsLoading,
        setFileList,
        setIsModalOpen,
        setIsPOModalOpen,
        getArticleById,
        createArticle,
        updateArticle,
        deleteArticle,
        onCreatePO,
        onSearch
    } = useCatalog();

    useEffect(() => {
        if (isModalOpen) {
            validateStock();
        }
    }, [isModalOpen])

    const validateStock = () => {
        let currentArticle = form.getFieldsValue() as ArticleDto;

        currentArticle.minStock ??= Number.MIN_SAFE_INTEGER
        currentArticle.maxStock ??= Number.MAX_SAFE_INTEGER

        let className = ""

        if (currentArticle.stock >= currentArticle.maxStock) className = "bd-blue"
        else if (currentArticle.minStock < currentArticle.stock && currentArticle.stock < currentArticle.maxStock) className = "bd-green"
        else if (currentArticle.minStock >= currentArticle.stock) className = "bd-red"
        else className = ""

        setStockClass(styles[className])
    }

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        clearFields();
    };

    const onEdit = async (id: number) => {
        setIsModalOpen(true);
        setShowSkeleton(true);
        const article = await getArticleById(id);

        if (article.image) {
            setFileList([{
                uid: '-1',
                name: '',
                status: 'done',
                url: article.image,
                thumbUrl: article.image,
            }])
        }

        form.setFieldsValue(article);
        setShowSkeleton(false);
    }

    const onDelete = async (id: number) => {
        setIsLoading(true)
        await deleteArticle(id);
        setIsLoading(false)
        await searchbarRef.current?.triggerSearch();
    }

    const onFinish = async (values: ArticleValues) => {

        let article: ArticleDto = {
            id: values.id,
            name: values.name,
            price: values.price,
            barcode: values.barcode ?? '',
            stock: values.stock,
            minStock: values.minStock,
            maxStock: values.maxStock,
            state: true
        };

        if (fileList.length > 0) {
            article.image = fileList[0].thumbUrl!;
        }

        setIsSaving(true);
        if (!values.id) {
            await createArticle(article);
        } else {
            await updateArticle(article);
        }
        setIsSaving(false);

        clearFields();
        await searchbarRef.current?.triggerSearch()
    };

    const onFinishFailed = (_: any) => { };

    const onChange = ({ fileList }: { fileList: UploadFile[] }) => {
        setFileList(fileList);
    };

    const clearFields = () => {
        setStockClass("");
        setIsModalOpen(false);
        setFileList([]);
        form.resetFields();
    };

    const reload = async () => {
        searchbarRef.current?.triggerSearch();
    }

    const getContent = () => {
        if (articles.length === 0) {
            return <p className="text-center mt-5">No se encontraron productos</p>
        } else {

            const notFoundImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAOVBMVEXz9Pa5vsq2u8jN0dnV2N/o6u7w8fTi5OnFydO+ws3f4ee6v8vY2+H29/jy9Pbu7/LJztbCx9HR1ty/NMEIAAACq0lEQVR42u3cYXaqMBBA4cyEgEAi4P4X+34oLSra9IA9E979FtDj7SAJUOocAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAqrQ3Y311iH5fsaktBTYn3d/Y2JljlM/orAR2IsdOHNqPFbY2TqKdXj/Orl/C24/sLHwV0ygiIv2466n0+kNlNFHYiohotfNyWKmIyKm2U9jsffqyU+gopLDMwiGE+sCFjRdV1SkOxyw8X2Rer6cNe2e7hfVJv3ddGg9YeNHlxrIPhyvs9GHvXB+sMJ2eLoDSsQrDwwhF/cFm+HiQikxvP+Prk63RwhSfCtt3i6J/fbK1Wlj9qvCiIjEd9yg9e32zZFotHPLPNOd55VyfotnVYsq9XVZ7fbvxsbviZx6kZ7+Y9toU7e7a/P1x+mI5qP3doRyLuraYlokxY4LrUzRcOPj56knaxmVMcP1XYfkKODW+VVWZqiHlTXBtisbvYgwhhKF22RNcmWLBd6JWJ/g8xXIL64u+eg5zl1huodfXj5riAQrPF333NG0xxVILvb5/YBhLKxzC8+XSD4mpqMLQt2F59hj158e+saDCFFrRacj9Dj5MsYTC0IuIfk9xzAoU7QopTKG93dq/7d3yJiiiVSqjMPTzJ25Dcu6cOUERjUUUzhP8mmLuBIsp/Jrg9Soq+OzAMgqXE7wm/uKvhIoovJ/gLxVQ+DTBwxVummABhRsnWEDhxgmaL9w8QfOFmydovTDlb11KLawopJBCCimk8E8Kbd+nGcJ2Q9F39fNRSKH5wtSZeyvI7/sm8O053MnCCOc/C/7Iu2vexIuyn3z/sLEQ6Orp4O+QOtf0HwrsGyOFrhP9QJ+qmUDnwtju/jp+PwZT/1chdNW+YuMAAAAAAAAAAAAAAAAAAAAAAAAAAACA/9s/LTI30XlcBHoAAAAASUVORK5CYII='

            return <div>
                <Row gutter={gutter} id="product-cards" className={styles['mt-05']}>
                    {
                        articles.map((article, index) => (
                            <Col span={24} md={12} lg={8} key={index}>
                                <Card
                                    hoverable
                                    style={{ height: '100%' }}
                                    cover={
                                        <img
                                            draggable={false}
                                            src={article.image ? article.image : notFoundImage}
                                        />
                                    }
                                >
                                    <Meta title={article.name} />
                                    <p><span className="fw-bold">Precio: </span>{formatCurrency(article.price)}</p>
                                    <p><span className="fw-bold">Código de Barra: </span>{nullToNS(article.barcode)}</p>
                                    <Row gutter={[5, 16]} className="mt-1">
                                        <Col span={24} md={8}>
                                            <Button type="primary" className="btn-warning w-100" onClick={() => onEdit(article.id!)}>Editar</Button>
                                        </Col>
                                        <Col span={24} md={8}>
                                            <Button color="danger" variant="solid" className="w-100" onClick={async () => await onDelete(article.id!)}>Eliminar</Button>
                                        </Col>
                                        <Col span={24} md={8}>
                                            <Button disabled={article.stock === 0} color="green" variant="solid" className="w-100" onClick={() => onCreatePO(article.id!)}>Crear Orden</Button>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
            </div >
        }
    }

    return (<>
        {contextHolder}
        <Title className="text-center">Catalogo</Title>

        <Row justify="space-between" gutter={[16, 5]}>
            <Col>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Agregar un Producto
                </Button>
            </Col>
            <Col>
                <Searchbar ref={searchbarRef} placeholder="Nombre o Codigo de barra" searchFunction={onSearch} />
            </Col>
        </Row>

        <Modal
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={ isSaving ? <Spin indicator={<LoadingOutlined className="white" spin />} /> : "Guardar" }
            cancelText="Cancelar"
        >
            <Title className="text-center" level={3}>Llene los campos</Title>
            <Form
                form={form}
                name="articleForm"
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
                <Row gutter={[16, 0]}>
                    <Col span={24} lg={12}>
                        <Form.Item
                            label="Nombre"
                            name="name"
                            rules={[{ required: true, message: 'Ingrese el nombre' }]}
                        >
                            {showSkeleton ? <Skeleton.Button active block /> : <Input />}
                        </Form.Item>
                    </Col>
                    <Col span={24} lg={12}>
                        <Form.Item
                            label="Precio"
                            name="price"
                            rules={[{ required: true, message: 'Ingrese el precio' }]}
                        >
                            {showSkeleton ? <Skeleton.Button active block /> : <InputNumber type="number" min={0} className="w-100" onKeyDown={(e) => preventChars(e, invalidKeys)} />}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Codigo de barra"
                            name="barcode"
                        >
                            {showSkeleton ? <Skeleton.Button active block /> : <Input />}
                        </Form.Item>
                    </Col>
                    <Col span={24} lg={8}>
                        <Form.Item
                            label="Stock"
                            name="stock"
                            rules={[{ required: true, message: 'El stock es requerido' }]}
                        >
                            {showSkeleton ? <Skeleton.Button active block /> : <InputNumber type="number" min={0} className={`w-100 ${stockClass}`} onChange={validateStock} onKeyDown={(e) => preventChars(e, invalidKeys)} />}
                        </Form.Item>
                    </Col>
                    <Col span={24} lg={8}>
                        <Form.Item
                            label="Stock minimo"
                            name="minStock"
                            dependencies={["maxStock"]}
                            rules={[
                                { required: true, message: 'El stock minimo es requerido' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const maxStock = getFieldValue('maxStock') ?? Number.MAX_SAFE_INTEGER;

                                        if (value > maxStock) {
                                            return Promise.reject(new Error('El stock minimo debe ser menor o igual al stock maximo'));
                                        }
                                        return Promise.resolve();
                                    }
                                })
                            ]}
                        >
                            {showSkeleton ? <Skeleton.Button active block /> : <InputNumber type="number" min={0} className="w-100" onChange={validateStock} onKeyDown={(e) => preventChars(e, invalidKeys)} />}
                        </Form.Item>
                    </Col>
                    <Col span={24} lg={8}>
                        <Form.Item
                            label="Stock maximo"
                            name="maxStock"
                            dependencies={["minStock"]}
                            rules={[
                                { required: true, message: 'El stock maximo es requerido' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const minStoke = getFieldValue('minStock') ?? Number.MIN_SAFE_INTEGER;

                                        if (value < minStoke) {
                                            return Promise.reject(new Error('El stock maximo debe ser mayor o igual al stock minimo'));
                                        }
                                        return Promise.resolve();
                                    }
                                })
                            ]}
                        >
                            {showSkeleton ? <Skeleton.Button active block /> : <InputNumber type="number" min={0} className="w-100" onChange={validateStock} onKeyDown={(e) => preventChars(e, invalidKeys)} />}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="image"
                        >
                            <Upload
                                listType="picture-card"
                                beforeUpload={() => false}
                                accept="image/*"
                                maxCount={1}
                                fileList={fileList}
                                onChange={onChange}
                                style={{ flex: 1 }}
                            >
                                <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Seleccione una imagen</div>
                                </div>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
        {
            isLoading
                ? <Flex
                    justify="center"
                    align="center"
                    style={{ height: '50vh' }}
                >
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                </Flex>
                : getContent()
        }
        <PurchaseOrderFormComponent
            open={isPOModalOpen}
            setOpen={(open: boolean) => setIsPOModalOpen(open)}
            articleId={articleId}
            reload={reload}
        />
    </>)
}