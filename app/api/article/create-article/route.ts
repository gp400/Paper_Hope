import { NextRequest, NextResponse } from "next/server";
import globalErrorHandler from "../../../../exception/GlobalErrorHandler";
import { ArticleService } from "@/services/backend/articleService";
import { ArticleRepository } from "@/repositories/backend/articleRepository";

export async function createArticle(request: NextRequest) {
    const articleDto = await request.json();
    const articleService = new ArticleService(new ArticleRepository());
    const article = await articleService.createArticle(articleDto);
    return NextResponse.json(article, { status: 201 });
}

export const POST = globalErrorHandler(createArticle);