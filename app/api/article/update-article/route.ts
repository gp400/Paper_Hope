import { NextRequest, NextResponse } from "next/server";
import { ArticleRepository } from "@/repositories/backend/articleRepository";
import { ArticleService } from "@/services/backend/articleService";
import globalErrorHandler from "@/exception/GlobalErrorHandler";

async function updateArticle(request: NextRequest) {
    const articleDto = await request.json();
    const articleService = new ArticleService(new ArticleRepository());
    const articles = await articleService.updateArticle(articleDto);
    return NextResponse.json(articles);
}

export const PUT = globalErrorHandler(updateArticle);