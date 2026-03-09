import { ArticleDto } from "./articleDto";

export interface PurchaseOrderDetailDto {
    id?: number;
    articleId: number;
    purchaseOrderId?: number;
    amount: number;
    article?: ArticleDto;
}