import { PurchaseOrderDetailDto } from "./PurchaseOrderDetailDto";

export interface PurchaseOrderDto {
    id?: number;
    name: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    state: boolean;
    createdAt?: Date;
    purchaseOrderDetails: PurchaseOrderDetailDto[];
}