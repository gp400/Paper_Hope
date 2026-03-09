import { NextRequest, NextResponse } from "next/server";
import globalErrorHandler from "../../../../exception/GlobalErrorHandler";
import { PurchaseOrderService } from "@/services/backend/purchaseOrderService";
import { PurchaseOrderRepository } from "@/repositories/backend/purchaseOrderRepository";

export async function createPurchaseOrder(request: NextRequest) {
    const purchaseOrderDto = await request.json();
    const purchaseOrderService = new PurchaseOrderService(new PurchaseOrderRepository());
    const purchaseOrder = await purchaseOrderService.createPurchaseOrder(purchaseOrderDto);
    return NextResponse.json(purchaseOrder, { status: 201 });
}

export const POST = globalErrorHandler(createPurchaseOrder);