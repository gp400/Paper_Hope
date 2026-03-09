import { PurchaseOrderDto } from "@/dtos/purchaseOrderDto";
import axios from "axios";

export class PurchaseOrderRepository {
    async getPurchaseOrders(filter: string): Promise<PurchaseOrderDto[]> {
        let { data } = await axios.get('/api/purchase-order/get-purchase-orders', {
            params: {
                filter
            }
        });

        return data;
    }

    async getPurchaseOrderById(id: number): Promise<PurchaseOrderDto> {
        const { data } = await axios.get(`/api/purchase-order/get-purchase-order-by-id/${id}`);
        return data;
    }

    async createPurchaseOrder(purchaseOrderDto: PurchaseOrderDto): Promise<PurchaseOrderDto> {
        const { data } = await axios.post('/api/purchase-order/create-purchase-order', purchaseOrderDto);
        return data;
    }

    async updatePurchaseOrder(purchaseOrderDto: PurchaseOrderDto): Promise<PurchaseOrderDto> {
        const { data } = await axios.put('/api/purchase-order/update-purchase-order', purchaseOrderDto);
        return data;
    }

    async deletePurchaseOrder(id: number): Promise<PurchaseOrderDto> {
        const { data } = await axios.delete(`/api/purchase-order/delete-purchase-order/${id}`);
        return data;
    }
}