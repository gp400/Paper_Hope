import { NextRequest, NextResponse } from "next/server";
import { PurchaseOrderService } from "@/services/backend/purchaseOrderService";
import { PurchaseOrderRepository } from "@/repositories/backend/purchaseOrderRepository";
import globalErrorHandler from "../../../../exception/GlobalErrorHandler";

async function updatePurchaseOrder(request: NextRequest) {
    const purchaseOrderDto = await request.json();
    const purchaseOrderService = new PurchaseOrderService(new PurchaseOrderRepository());
    const purchaseOrders = await purchaseOrderService.updatePurchaseOrder(purchaseOrderDto);
    return NextResponse.json(purchaseOrders);
}

export const PUT = globalErrorHandler(updatePurchaseOrder);