import { PurchaseOrderDto } from "@/dtos/purchaseOrderDto";
import { HttpException } from "@/exception/HttpException";
import { PurchaseOrderRepository } from "@/repositories/backend/purchaseOrderRepository";
import { z } from "zod";

const createPurchaseOrderSchema = z.object({
    name: z.string(),
    email: z.email().optional().or(z.literal("")),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
    createdAt: z.date().optional(),
    purchaseOrderDetails: z.array(z.object({
        id: z.number().optional(),
        articleId: z.number(),
        purchaseOrderId: z.number().optional(),
        amount: z.number()
    }))
});

const updatePurchaseOrderSchema = createPurchaseOrderSchema.extend({
    id: z.number()
});

export class PurchaseOrderService {
    constructor(private readonly purchaseOrderRepository: PurchaseOrderRepository) { }

    async getPurchaseOrders(filter: string): Promise<PurchaseOrderDto[]> {
        return await this.purchaseOrderRepository.getPurchaseOrders(filter);
    }

    async getPurchaseOrderById(id: number): Promise<PurchaseOrderDto> {
        return await this.purchaseOrderRepository.getPurchaseOrderById(id);
    }

    async createPurchaseOrder(purchaseOrder: PurchaseOrderDto): Promise<PurchaseOrderDto> {

        const result = createPurchaseOrderSchema.safeParse(purchaseOrder);

        if (!result.success) throw new HttpException(result.error.message, 400);

        return await this.purchaseOrderRepository.createPurchaseOrder(purchaseOrder);
    }

    async updatePurchaseOrder(purchaseOrder: PurchaseOrderDto): Promise<PurchaseOrderDto> {

        const result = updatePurchaseOrderSchema.safeParse(purchaseOrder);

        if (!result.success) throw new HttpException(result.error.message, 400);

        return await this.purchaseOrderRepository.updatePurchaseOrder(purchaseOrder);
    }

    async deletePurchaseOrder(id: number): Promise<PurchaseOrderDto> {
        return await this.purchaseOrderRepository.deletePurchaseOrder(id);
    }
}