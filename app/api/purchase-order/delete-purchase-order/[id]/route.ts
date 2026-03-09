import { NextRequest, NextResponse } from "next/server";
import { PurchaseOrderService } from "@/services/backend/purchaseOrderService";
import globalErrorHandler from "@/exception/GlobalErrorHandler";
import { PurchaseOrderRepository } from "@/repositories/backend/purchaseOrderRepository";

async function deletePurchaseOrder(request: Request, context: { params: Record<string, string> }) {
    const { id } = await context.params;
    const purchaseOrderService = new PurchaseOrderService(new PurchaseOrderRepository());
    const purchaseOrder = await purchaseOrderService.deletePurchaseOrder(Number(id));
    return NextResponse.json(purchaseOrder);
}

export const DELETE = globalErrorHandler(deletePurchaseOrder);