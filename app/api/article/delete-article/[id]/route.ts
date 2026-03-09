import globalErrorHandler from "@/exception/GlobalErrorHandler";
import { NextResponse } from "next/server";
import { ArticleService } from "@/services/backend/articleService";
import { ArticleRepository } from "@/repositories/backend/articleRepository";

async function deleteArticle(request: Request, context: { params: Record<string, string> }) {
    const { id } = await context.params;
    const articleService = new ArticleService(new ArticleRepository());
    const article = await articleService.deleteArticle(Number(id));
    return NextResponse.json(article);
}

export const DELETE = globalErrorHandler(deleteArticle);