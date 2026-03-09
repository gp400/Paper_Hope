import { PurchaseOrderDetailDto } from "./PurchaseOrderDetailDto";

export interface ArticleDto {
    id?: number;
    name: string;
    price: number;
    barcode: string | null;
    stock: number;
    minStock: number;
    maxStock: number;
    image?: string;
    state: boolean;
    createdAt?: Date;
    purchaseOrderDetails?: PurchaseOrderDetailDto[];
}