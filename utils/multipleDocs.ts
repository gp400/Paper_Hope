import { QuerySnapshot, type DocumentData } from "firebase/firestore";

export const handleMultipleDocs = async( docs: Promise<QuerySnapshot<DocumentData, DocumentData>>[] ) => {
    const snaps = await Promise.all(docs);

    const results:any[] = [];

    snaps.map(snap => {
        results.push(...snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() })))
    })

    const unique = Array.from(new Map(results.map(r => [r.id, r])).values());

    return unique;
}