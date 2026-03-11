import { Form, type TableColumnsType } from "antd";
import { useContext, useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { ArticleDto } from "@/dtos/articleDto";
import { PurchaseOrderDetailDto } from "@/dtos/PurchaseOrderDetailDto";
import { formatCurrency } from "@/utils/currency";
import { ServicesContext } from "@/providers/servicesProvider";

interface FormArticleProps {
    id: number;
    name: string;
    price: string;
    amount: number;
}

interface Props {
    articleId?: number;
}

const usePurchaseOrderFormComponent = ({ articleId }: Props) => {

    const { articleService, purchaseOrderService } = useContext(ServicesContext)!;
    const [form] = Form.useForm();
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [articles, setArticles] = useState<ArticleDto[]>([]);
    const [showSkeleton, setShowSkeleton] = useState<boolean>(false);
    const [notUpdateList, setNotUpdateList] = useState<number[]>([]);
    const [details, setDetails] = useState<PurchaseOrderDetailDto[]>([]);

    useEffect(() => {
        (async () => {
            if (articleId) form.setFieldsValue({ articleId: articleId });
            let articles = await articleService.getArticles("");
            setArticles(articles);
        })()
    }, [articleId])

    const formArticleColumns: TableColumnsType<FormArticleProps> = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Cantidad',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Precio',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Acción',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: FormArticleProps) => (
                <div className="text-center" key={record.id}>
                    <DeleteOutlined className="cursor-pointer" onClick={() => deleteDetail(record.id)} />
                </div>
            )
        },
    ];

    const deleteDetail = (articleId: number) => {
        let newDetails = details.filter(detail => detail.articleId !== articleId);
        setDetails(newDetails);

        if (isUpdate && !notUpdateList.includes(articleId)) {
            let currentDetail = details.find(article => article.articleId === articleId)!;
            let article = articles.find(article => article.id === articleId)!;

            article.stock += currentDetail.amount;

            setArticles([...articles.filter(a => a.id !== article.id), article].sort((a, b) => a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase())));

            setNotUpdateList([...notUpdateList, articleId]);
        }
    }

    const getFormArticleValues = () => {
        let data: FormArticleProps[] = [];
        details.forEach(detail => {
            let article = articles.find(article => article.id === detail.articleId);
            data.push({
                id: article?.id!,
                name: article?.name!,
                price: formatCurrency(article?.price!),
                amount: detail.amount
            });
        });

        return data;
    }

    const getArticleOptions = () => {
        let options = articles.map(article => {

            if (article.stock !== 0 && !details.map(d => d.articleId).includes(article.id!)) {
                return {
                    label: article.name,
                    value: article.id ?? ''
                }
            }
        });

        return options.filter(option => option !== undefined);
    }

    const fillForm = async (docId: number) => {
        setIsUpdate(true);
        setShowSkeleton(true);
        setArticles(await articleService.getArticles(""));
        const purchaseOrder = await purchaseOrderService.getPurchaseOrderById(docId);
        setDetails(purchaseOrder.purchaseOrderDetails);
        form.setFieldsValue(purchaseOrder);
        setShowSkeleton(false);
    }

    return {
        purchaseOrderService,
        form,
        articles,
        showSkeleton,
        details,
        formArticleColumns,
        setIsUpdate,
        setNotUpdateList,
        setArticles,
        setDetails,
        getFormArticleValues,
        getArticleOptions,
        fillForm
    }
}

export default usePurchaseOrderFormComponent;