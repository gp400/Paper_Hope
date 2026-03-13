import { ArticleDto } from "@/dtos/articleDto";
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
    let purchaseOrder: PurchaseOrderHere[] = [];
    let purchaseOrderDetail: PurchaseOrderDetailHere[] = [];

    let detailMap: any[] = [];

    (await getDocs(collection(db, "article"))).forEach((doc) => {
        articles.push({ ...doc.data(), id: doc.id} as ArticleHere);
    });

    (await getDocs(collection(db, "purchaseOrder"))).forEach((doc) => {
        purchaseOrder.push({ ...doc.data(), id: doc.id} as PurchaseOrderHere);
    });

    (await getDocs(collection(db, "purchaseOrderDetail"))).forEach((doc) => {
        purchaseOrderDetail.push({ ...doc.data(), id: doc.id} as PurchaseOrderDetailHere);
    });

    return NextResponse.json({a: articles[0], po: purchaseOrder[0], pod: purchaseOrderDetail[0]})
};