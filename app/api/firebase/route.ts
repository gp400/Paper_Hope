import { NextResponse } from "next/server";

export const GET = () => {

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

    return NextResponse.json({"success": true})
};