import { NextRequest, NextResponse } from "next/server";
import globalErrorHandler from "../../../../exception/GlobalErrorHandler";
import { PurchaseOrderService } from "@/services/backend/purchaseOrderService";
import { PurchaseOrderRepository } from "@/repositories/backend/purchaseOrderRepository";

async function getPurchaseOrders(request: NextRequest) {
    const filter: string = request.nextUrl.searchParams.get("filter") ?? '';
    const purchaseOrderService = new PurchaseOrderService(new PurchaseOrderRepository());
    const purchaseOrders = await purchaseOrderService.getPurchaseOrders(filter.trim());
    return NextResponse.json(purchaseOrders);
}

export const GET = globalErrorHandler(getPurchaseOrders);