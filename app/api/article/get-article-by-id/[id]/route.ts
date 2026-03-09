import globalErrorHandler from "@/exception/GlobalErrorHandler";
import { ArticleRepository } from "@/repositories/backend/articleRepository";
import { ArticleService } from "@/services/backend/articleService";
import { NextResponse } from "next/server";

async function getArticleById(request: Request, context: { params: Record<string, string> }) {
    const { id } = await context.params;
    const articleService = new ArticleService(new ArticleRepository());
    const article = await articleService.getArticleById(Number(id));
    return NextResponse.json(article);
}

export const GET = globalErrorHandler(getArticleById);