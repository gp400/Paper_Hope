"use client"

import { useContext, useEffect, useState } from "react";
import { notification, type UploadFile } from "antd";
import { ArticleDto } from "@/dtos/articleDto";
import axios from "axios";
import { ServicesContext } from "@/providers/servicesProvider";

const useCatalog = () => {

    const { articleService } = useContext(ServicesContext)!;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [articleId, setArticleId] = useState<number>(0);
    const [articles, setArticles] = useState<ArticleDto[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isPOModalOpen, setIsPOModalOpen] = useState<boolean>(false);

    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        (async () => {
            await onSearch('')
        })()
    }, [])

    const openNotification = (description: string) => {
        api.warning({
            title: "Alerta",
            description
        });
    };

    const getArticleById = async (id: number): Promise<ArticleDto> => {
        const data = await articleService.getArticleById(id);
        return data;
    }

    const createArticle = async (article: ArticleDto) => {
        try {
            await articleService.createArticle(article);
        } catch (ex) {
            openNotification(ex as string);
        }
    }

    const updateArticle = async (article: ArticleDto) => {
        try {
            await articleService.updateArticle(article);
        } catch (ex) {
            openNotification(ex as string);
        }
    }

    const deleteArticle = async (id: number) => {
        try {
            await articleService.deleteArticle(id);
        } catch (ex) {
            openNotification(ex as string);
        }
    }

    const onCreatePO = (articleId: number) => {
        setArticleId(articleId);
        setIsPOModalOpen(true)
    }

    const onSearch = async (filter: string) => {
        setIsLoading(true)
        setArticles([]);
        const data =await articleService.getArticles(filter);
        setArticles(data);
        setIsLoading(false)
    }

    return {
        isLoading,
        articleId,
        articles,
        fileList,
        isModalOpen,
        isPOModalOpen,
        contextHolder,
        setIsLoading,
        setFileList,
        setIsModalOpen,
        setIsPOModalOpen,
        getArticleById,
        createArticle,
        updateArticle,
        deleteArticle,
        onCreatePO,
        onSearch
    }
}

export default useCatalog;