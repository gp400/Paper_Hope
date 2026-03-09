import globalErrorHandler from "@/exception/GlobalErrorHandler";
import { PurchaseOrderRepository } from "@/repositories/backend/purchaseOrderRepository";
import { PurchaseOrderService } from "@/services/backend/purchaseOrderService";
import { NextRequest, NextResponse } from "next/server";

async function getPurchaseOrderById(request: NextRequest, context: { params: Record<string, string> }) {
    const { id } = await context.params;
    const purchaseOrderService = new PurchaseOrderService(new PurchaseOrderRepository());
    const purchaseOrder = await purchaseOrderService.getPurchaseOrderById(Number(id));
    return NextResponse.json(purchaseOrder);
}

export const GET = globalErrorHandler(getPurchaseOrderById);