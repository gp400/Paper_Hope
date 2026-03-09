import { NextRequest, NextResponse } from "next/server";
import globalErrorHandler from "../../../../exception/GlobalErrorHandler";
import { ArticleRepository } from "@/repositories/backend/articleRepository";
import { ArticleService } from "@/services/backend/articleService";

async function getArticles(request: NextRequest) {
    const filter: string = request.nextUrl.searchParams.get("filter") ?? '';
    const articleService = new ArticleService(new ArticleRepository());
    const articles = await articleService.getArticles(filter.trim());
    return NextResponse.json(articles);
}

export const GET = globalErrorHandler(getArticles);