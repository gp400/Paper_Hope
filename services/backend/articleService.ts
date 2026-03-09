import { ArticleDto } from "@/dtos/articleDto";
import { HttpException } from "@/exception/HttpException";
import { ArticleRepository } from "@/repositories/backend/articleRepository";
import { z } from "zod";

const createArticleSchema = z.object({
    name: z.string(),
    price: z.number(),
    barcode: z.string().optional(),
    stock: z.number(),
    minStock: z.number(),
    maxStock: z.number(),
    createdAt: z.date().optional(),
    image: z.string().optional()
});

const updateArticleSchema = createArticleSchema.extend({
    id: z.number()
});

export class ArticleService {
    constructor(private readonly articleRepository: ArticleRepository) { }

    async getArticles(filter: string): Promise<ArticleDto[]> {
        return await this.articleRepository.getArticles(filter);
    }

    async getArticleById(id: number): Promise<ArticleDto> {
        return await this.articleRepository.getArticleById(id);
    }

    async createArticle(article: ArticleDto): Promise<ArticleDto> {

        const result = createArticleSchema.safeParse(article);

        if (!result.success) throw new HttpException(result.error.message, 400);

        return await this.articleRepository.createArticle(article);
    }

    async updateArticle(article: ArticleDto): Promise<ArticleDto> {

        const result = updateArticleSchema.safeParse(article);

        if (!result.success) throw new HttpException(result.error.message, 400);

        return await this.articleRepository.updateArticle(article);
    }

    async deleteArticle(id: number): Promise<ArticleDto> {
        return await this.articleRepository.deleteArticle(id);
    }
}