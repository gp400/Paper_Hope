import { ArticleDto } from "@/dtos/articleDto";
import { prisma } from "@/lib/prisma";
import { ArticleRepository } from "@/repositories/backend/articleRepository";
import { PurchaseOrderRepository } from "@/repositories/backend/purchaseOrderRepository";
import { ArticleService } from "@/services/backend/articleService";
import { PurchaseOrderService } from "@/services/backend/purchaseOrderService";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { NextResponse } from "next/server";

export const GET = async () => {

    const firebaseConfig = {
    apiKey: "AIzaSyDaCiOBKYrLbgfJq6hy0bh9uziRRsfOO-U",
    authDomain: "paper-hope.firebaseapp.com",
    projectId: "paper-hope",
    storageBucket: "paper-hope.firebasestorage.app",
    messagingSenderId: "1088354989364",
    appId: "1:1088354989364:web:5b661d1291135d4b5ee161",
    measurementId: "G-9DS9V5SKXD"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    interface ArticleHere {
        id?: string;
        name: string;
        price: number;
        barcode: string;
        stock: number;
        minStock: number;
        maxStock: number;
        image: string;
    }

    interface PurchaseOrderHere {
        id?: string;
        name: string;
        address?: string;
        phoneNumber?: string;
        email?: string;
        createdAt?: Date;
        details: PurchaseOrderDetailHere[];
    }

    interface PurchaseOrderDetailHere {
        id?: string;
        articleId: string;
        purchaseOrderId?: string;
        amount: number;
    }

    let articles: ArticleHere[] = [];
    let purchaseOrders: PurchaseOrderHere[] = [];
    let purchaseOrderDetails: PurchaseOrderDetailHere[] = [];

    let articleMap = {};
    let purchaseOrderMap= {};

    (await getDocs(collection(db, "article"))).forEach((doc) => {
        articles.push({ ...doc.data(), id: doc.id} as ArticleHere);
    });

    (await getDocs(collection(db, "purchaseOrder"))).forEach((doc) => {
        purchaseOrders.push({ ...doc.data(), id: doc.id, createdAt: doc.data().createdAt?.toDate()} as PurchaseOrderHere);
    });

    (await getDocs(collection(db, "purchaseOrderDetail"))).forEach((doc) => {
        purchaseOrderDetails.push({ ...doc.data(), id: doc.id} as PurchaseOrderDetailHere);
    });

    for (const articleDto of articles) {

        let article = await prisma.article.create({
            data: {
                name: articleDto.name,
                barcode: articleDto.barcode || "",
                stock: articleDto.stock,
                maxStock: articleDto.maxStock,
                minStock: articleDto.minStock,
                price: articleDto.price,
                image: articleDto.image || "",
                state: true
            }
        })

        articleMap[articleDto.id!] = article.id
    }

    for (const purchaseOrderDto of purchaseOrders) {

        const purchaseOrder = await prisma.purchaseOrder.create({
            data: {
                name: purchaseOrderDto.name,
                email: purchaseOrderDto.email || '',
                address: purchaseOrderDto.address || '',
                phoneNumber: purchaseOrderDto.phoneNumber || '',
                createdAt: purchaseOrderDto.createdAt,
                state: true
            }
        });

        purchaseOrderMap[purchaseOrderDto.id!] = purchaseOrder.id
    }

    for (const detail of purchaseOrderDetails) {

        const purchaseOrderDetail = await prisma.purchaseOrderDetail.create({
            data: {
                articleId: articleMap[detail.articleId],
                purchaseOrderId: purchaseOrderMap[detail.purchaseOrderId],
                amount: detail.amount
            }
        })
    }

    return NextResponse.json({articleMap, purchaseOrderMap});
};