import { ArticleDto } from "@/dtos/articleDto";
import { ArticleRepository } from "@/repositories/frontend/articleRepository";

export class ArticleService {
    constructor(private readonly articleRepository: ArticleRepository) { }

    async getArticles(filter: string): Promise<ArticleDto[]> {
        return await this.articleRepository.getArticles(filter);
    }

    async getArticleById(id: number): Promise<ArticleDto> {
        return await this.articleRepository.getArticleById(id);
    }

    async createArticle(article: ArticleDto): Promise<ArticleDto> {
        return await this.articleRepository.createArticle(article);
    }

    async updateArticle(article: ArticleDto): Promise<ArticleDto> {
        return await this.articleRepository.updateArticle(article);
    }

    async deleteArticle(id: number): Promise<ArticleDto> {
        return await this.articleRepository.deleteArticle(id);
    }
}