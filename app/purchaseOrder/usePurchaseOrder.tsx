import { useContext, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Col, Row, type TableColumnsType } from "antd";
import type { SearchBarHandle } from "../../components/Searchbar/Searchbar";
import { ArticleDto } from "@/dtos/articleDto";
import { PurchaseOrderDto } from "@/dtos/purchaseOrderDto";
import { ServicesContext } from "@/providers/servicesProvider";
import { PurchaseOrderDetailDto } from "@/dtos/PurchaseOrderDetailDto";

interface usePurchaseOrderProps {
    searchbarRef: React.RefObject<SearchBarHandle | null>
}

const usePurchaseOrder = ({ searchbarRef }: usePurchaseOrderProps) => {

    const { articleService, purchaseOrderService } = useContext(ServicesContext)!;
    const [docId, setDocId] = useState<number | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [articles, setArticles] = useState<ArticleDto[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderDto[]>([]);

    useEffect(() => {
        (async () => {
            onSearch("")
            let data = await articleService.getArticles("")
            setArticles(data);
        })()
    }, [])

    const purchaseOrdersColumns: TableColumnsType<PurchaseOrderDto> = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Teléfono',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Dirección',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Fecha',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (_: any, record: PurchaseOrderDto) => (
                <span>
                    {new Date(record.createdAt!).toLocaleDateString()}
                </span>
            )
        },
        {
            title: 'Acción',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: PurchaseOrderDto) => (
                <div key={record.id}>
                    <Row gutter={15} justify="center">
                        <Col>
                            <EditOutlined
                                className="cursor-pointer"
                                onClick={() => onEditClick(record.id!)}
                                style={{ fontSize: '17px' }}
                            />
                        </Col>
                        <Col>
                            <DeleteOutlined
                                className="cursor-pointer"
                                onClick={() => onDeleteClick(record.id!)}
                                style={{ fontSize: '17px' }}
                            />
                        </Col>
                    </Row>
                </div>
            )
        },
    ]

    const purchaseOrdersDetailsColumns: TableColumnsType<PurchaseOrderDetailDto> = [
        {
            title: 'Nombre del Artículo',
            dataIndex: 'articleName',
            key: 'articleName',
            render: (_: any, record: PurchaseOrderDetailDto) => {
                return <span>{record.article?.name}</span>
            }
        },
        {
            title: 'Cantidad',
            dataIndex: 'amount',
            key: 'amount',
        }
    ]

    const onEditClick = async (docId: number) => {
        setOpen(true);
        setDocId(docId);
    }

    const onDeleteClick = async (docId: number) => {
        setIsLoading(true);
        await purchaseOrderService.deletePurchaseOrder(docId);
        await searchbarRef.current?.triggerSearch()
        setArticles(await articleService.getArticles(""));
        setIsLoading(false)
    }

    const onSearch = async (filter: string) => {
        setIsLoading(true);
        setPurchaseOrders(await purchaseOrderService.getPurchaseOrders(filter))
        setIsLoading(false);
    }

    return {
        docId,
        isLoading,
        articles,
        open,
        purchaseOrders,
        purchaseOrdersColumns,
        purchaseOrdersDetailsColumns,
        setIsLoading,
        setDocId,
        setOpen,
        setPurchaseOrders,
        onSearch
    }
}

export default usePurchaseOrder;