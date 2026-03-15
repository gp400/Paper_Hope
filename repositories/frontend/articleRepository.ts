import { ArticleDto } from "@/dtos/articleDto";
import axios from "axios";

const headers = {
    "X-API-KEY": "df9648f4-cecb-4485-89a0-22cae00e8304"
}

export class ArticleRepository {

    async getArticles(filter: string): Promise<ArticleDto[]> {
        let { data } = await axios.get('/api/article/get-articles', {
            params: {
                filter
            },
            headers
        });

        return data;
    }

    async getArticleById(id: number): Promise<ArticleDto> {
        const { data } = await axios.get(`/api/article/get-article-by-id/${id}`, {
            headers
        });
        return data;
    }

    async createArticle(articleDto: ArticleDto): Promise<ArticleDto> {
        const { data } = await axios.post('/api/article/create-article', articleDto, {
            headers
        });
        return data;
    }

    async updateArticle(articleDto: ArticleDto): Promise<ArticleDto> {
        const { data } = await axios.put('/api/article/update-article', articleDto, {
            headers
        });
        return data;
    }

    async deleteArticle(id: number): Promise<ArticleDto> {
        const { data } = await axios.delete(`/api/article/delete-article/${id}`, {
            headers
        });
        return data;
    }
}