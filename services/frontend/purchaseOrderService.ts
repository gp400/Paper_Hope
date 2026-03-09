import { PurchaseOrderDto } from "@/dtos/purchaseOrderDto";
import { PurchaseOrderRepository } from "@/repositories/frontend/purchaseOrderRepository";

export class PurchaseOrderService {
    constructor(private readonly purchaseOrderRepository: PurchaseOrderRepository) { }

    async getPurchaseOrders(filter: string): Promise<PurchaseOrderDto[]> {
        return await this.purchaseOrderRepository.getPurchaseOrders(filter);
    }

    async getPurchaseOrderById(id: number): Promise<PurchaseOrderDto> {
        return await this.purchaseOrderRepository.getPurchaseOrderById(id);
    }

    async createPurchaseOrder(purchaseOrder: PurchaseOrderDto): Promise<PurchaseOrderDto> {
        return await this.purchaseOrderRepository.createPurchaseOrder(purchaseOrder);
    }

    async updatePurchaseOrder(purchaseOrder: PurchaseOrderDto): Promise<PurchaseOrderDto> {
        return await this.purchaseOrderRepository.updatePurchaseOrder(purchaseOrder);
    }

    async deletePurchaseOrder(id: number): Promise<PurchaseOrderDto> {
        return await this.purchaseOrderRepository.deletePurchaseOrder(id);
    }
}