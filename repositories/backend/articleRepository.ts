import { prisma } from "@/lib/prisma";
import { ArticleDto } from "@/dtos/articleDto";
import { HttpException } from "../../exception/HttpException";

export class ArticleRepository {

    private notFoundMessage = "Articulo no encontrado";

    async getArticles(filter: string): Promise<ArticleDto[]> {
        const articles = await prisma.article.findMany({
            where: {
                AND: [
                    { state: true },
                    filter
                        ? {
                            OR: [
                                { name: { contains: filter, mode: "insensitive" } },
                                { barcode: { contains: filter, mode: "insensitive" } }
                            ]
                        } : {}
                ]
            },
            orderBy: {
                name: "asc"
            }
        });

        return articles.map((article) => ({
            id: article.id,
            name: article.name,
            barcode: article.barcode,
            stock: article.stock,
            maxStock: article.maxStock,
            minStock: article.minStock,
            price: article.price,
            image: article.image,
            state: article.state,
            createdAt: article.createdAt,
        }));
    }

    async getArticleById(id: number): Promise<ArticleDto> {
        const article = await this.getById(id);

        if (!article) throw new HttpException(this.notFoundMessage, 404);

        return {
            id: article.id,
            name: article.name,
            barcode: article.barcode,
            stock: article.stock,
            maxStock: article.maxStock,
            minStock: article.minStock,
            price: article.price,
            image: article.image,
            state: article.state,
            createdAt: article.createdAt
        };
    }

    async createArticle(articleDto: ArticleDto): Promise<ArticleDto> {

        const article = await prisma.article.create({
            data: {
                name: articleDto.name,
                barcode: articleDto.barcode || "",
                stock: articleDto.stock,
                maxStock: articleDto.maxStock,
                minStock: articleDto.minStock,
                price: articleDto.price,
                image: articleDto.image || "",
                state: true
            }
        });

        return {
            id: article.id,
            name: article.name,
            barcode: article.barcode,
            stock: article.stock,
            maxStock: article.maxStock,
            minStock: article.minStock,
            price: article.price,
            image: article.image,
            state: article.state,
            createdAt: article.createdAt
        };
    }

    async updateArticle(articleDto: ArticleDto): Promise<ArticleDto> {

        const exists = await this.getById(articleDto.id!);

        if (!exists) throw new HttpException(this.notFoundMessage, 404);

        const article = await prisma.article.update({
            where: { id: articleDto.id },
            data: {
                name: articleDto.name,
                barcode: articleDto.barcode || "",
                stock: articleDto.stock,
                maxStock: articleDto.maxStock,
                minStock: articleDto.minStock,
                price: articleDto.price,
                image: articleDto.image || "",
            }
        });

        return {
            id: article.id,
            name: article.name,
            barcode: article.barcode,
            stock: article.stock,
            maxStock: article.maxStock,
            minStock: article.minStock,
            price: article.price,
            image: article.image,
            state: article.state,
            createdAt: article.createdAt
        };
    }

    async deleteArticle(id: number): Promise<ArticleDto> {

        const exists = await this.getById(id);

        if (!exists) throw new HttpException(this.notFoundMessage, 404);

        const article = await prisma.article.update({
            where: { id },
            data: {
                state: false
            }
        });

        return {
            id: article.id,
            name: article.name,
            barcode: article.barcode,
            stock: article.stock,
            maxStock: article.maxStock,
            minStock: article.minStock,
            price: article.price,
            image: article.image,
            state: article.state,
            createdAt: article.createdAt
        };
    }

    private async getById(id: number) {
        const article = await prisma.article.findUnique({
            where: {
                id
            }
        });

        return article;
    }
}