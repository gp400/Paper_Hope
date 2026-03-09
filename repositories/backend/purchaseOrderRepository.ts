import { PurchaseOrderDetailDto } from "@/dtos/PurchaseOrderDetailDto";
import { PurchaseOrderDto } from "@/dtos/purchaseOrderDto";
import { HttpException } from "@/exception/HttpException";
import { prisma } from "@/lib/prisma";

export class PurchaseOrderRepository {

    private notFoundMessage = "Orden de compra no encontrada";
    private invalidArticlesMessage = "Alguno de los articulos esta deshabilitado";

    async getPurchaseOrders(filter: string): Promise<PurchaseOrderDto[]> {
        const purchaseOrders = await prisma.purchaseOrder.findMany({
            include: {
                purchaseOrderDetails: {
                    include: {
                        article: true
                    }
                }
            },
            where: {
                AND: [
                    { state: true },
                    filter
                        ? {
                            OR: [
                                { name: { contains: filter } },
                                { email: { contains: filter } },
                                { address: { contains: filter } },
                                { phoneNumber: { contains: filter } }
                            ]
                        }
                        : {}
                ]
            }
        });
        return purchaseOrders.map((purchaseOrder) => ({
            id: purchaseOrder.id,
            name: purchaseOrder.name,
            email: purchaseOrder.email,
            address: purchaseOrder.address,
            phoneNumber: purchaseOrder.phoneNumber,
            state: purchaseOrder.state,
            createdAt: purchaseOrder.createdAt,
            purchaseOrderDetails: purchaseOrder.purchaseOrderDetails

        }));
    }

    async getPurchaseOrderById(id: number): Promise<PurchaseOrderDto> {
        const purchaseOrder = await this.getById(id);

        if (!purchaseOrder) throw new HttpException(this.notFoundMessage, 404);

        return {
            id: purchaseOrder.id,
            name: purchaseOrder.name,
            email: purchaseOrder.email,
            address: purchaseOrder.address,
            phoneNumber: purchaseOrder.phoneNumber,
            state: purchaseOrder.state,
            createdAt: purchaseOrder.createdAt,
            purchaseOrderDetails: purchaseOrder.purchaseOrderDetails
        };
    }

    async createPurchaseOrder(purchaseOrderDto: PurchaseOrderDto): Promise<PurchaseOrderDto> {

        const valid = await this.areArticlesValid(purchaseOrderDto.purchaseOrderDetails.map((detail) => detail.articleId));

        if (!valid) throw new HttpException(this.invalidArticlesMessage, 400);

        let response: PurchaseOrderDto;

        await prisma.$transaction(async (transaction) => {

            await this.updateArticlesStock(transaction, purchaseOrderDto.purchaseOrderDetails, 'decrement');

            const purchaseOrder = await transaction.purchaseOrder.create({
                data: {
                    name: purchaseOrderDto.name,
                    email: purchaseOrderDto.email || '',
                    address: purchaseOrderDto.address || '',
                    phoneNumber: purchaseOrderDto.phoneNumber || '',
                    state: true,
                    purchaseOrderDetails: {
                        create: purchaseOrderDto.purchaseOrderDetails.map((detail) => ({
                            articleId: detail.articleId,
                            amount: detail.amount
                        }))
                    }
                },
                include: {
                    purchaseOrderDetails: {
                        include: {
                            article: true
                        }
                    }
                }
            });

            response = {
                id: purchaseOrder.id,
                name: purchaseOrder.name,
                email: purchaseOrder.email,
                address: purchaseOrder.address,
                phoneNumber: purchaseOrder.phoneNumber,
                state: purchaseOrder.state,
                createdAt: purchaseOrder.createdAt,
                purchaseOrderDetails: purchaseOrder.purchaseOrderDetails.map((detail) => ({
                    id: detail.id,
                    articleId: detail.articleId,
                    purchaseOrderId: detail.purchaseOrderId,
                    amount: detail.amount,
                    article: detail.article
                }))
            }
        })

        return response!;
    }

    async updatePurchaseOrder(purchaseOrderDto: PurchaseOrderDto): Promise<PurchaseOrderDto> {

        const exists = await this.getById(purchaseOrderDto.id!);

        if (!exists) throw new HttpException(this.notFoundMessage, 404);

        const valid = await this.areArticlesValid(purchaseOrderDto.purchaseOrderDetails.map((detail) => detail.articleId));

        if (!valid) throw new HttpException(this.invalidArticlesMessage, 400);

        let response: PurchaseOrderDto;

        await prisma.$transaction(async (transaction) => {

            const oldDetails = await transaction.purchaseOrder.findUnique({
                where: {
                    id: purchaseOrderDto.id,
                    state: true
                },
                include: {
                    purchaseOrderDetails: {
                        include: {
                            article: true
                        }
                    }
                }
            });

            await this.updateArticlesStock(transaction, oldDetails?.purchaseOrderDetails!, 'increment');

            await this.updateArticlesStock(transaction, purchaseOrderDto.purchaseOrderDetails, 'decrement');

            const purchaseOrder = await transaction.purchaseOrder.update({
                where: {
                    id: purchaseOrderDto.id
                },
                data: {
                    name: purchaseOrderDto.name,
                    email: purchaseOrderDto.email || '',
                    address: purchaseOrderDto.address || '',
                    phoneNumber: purchaseOrderDto.phoneNumber || '',
                    state: true,
                    purchaseOrderDetails: {
                        deleteMany: {},
                        create: purchaseOrderDto.purchaseOrderDetails.map((detail) => ({
                            articleId: detail.articleId,
                            amount: detail.amount
                        }))
                    }
                },
                include: {
                    purchaseOrderDetails: {
                        include: {
                            article: true
                        }
                    }
                }
            });

            response = {
                id: purchaseOrder.id,
                name: purchaseOrder.name,
                email: purchaseOrder.email,
                address: purchaseOrder.address,
                phoneNumber: purchaseOrder.phoneNumber,
                state: purchaseOrder.state,
                createdAt: purchaseOrder.createdAt,
                purchaseOrderDetails: purchaseOrder.purchaseOrderDetails.map((detail) => ({
                    id: detail.id,
                    articleId: detail.articleId,
                    purchaseOrderId: detail.purchaseOrderId,
                    amount: detail.amount,
                    article: detail.article
                }))
            }
        })

        return response!;
    }

    async deletePurchaseOrder(id: number): Promise<PurchaseOrderDto> {

        const exists = await this.getById(id);

        if (!exists) throw new HttpException(this.notFoundMessage, 404);

        let response: PurchaseOrderDto;

        await prisma.$transaction(async (transaction) => {

            const oldDetails = await transaction.purchaseOrder.findUnique({
                where: {
                    id,
                    state: true
                },
                include: {
                    purchaseOrderDetails: {
                        include: {
                            article: true
                        }
                    }
                }
            });

            await this.updateArticlesStock(transaction, oldDetails?.purchaseOrderDetails!, 'increment');

            const purchaseOrder = await transaction.purchaseOrder.update({
                where: {
                    id
                },
                data: {
                    state: false
                },
                include: {
                    purchaseOrderDetails: {
                        include: {
                            article: true
                        }
                    }
                }
            });

            response = {
                id: purchaseOrder.id,
                name: purchaseOrder.name,
                email: purchaseOrder.email,
                address: purchaseOrder.address,
                phoneNumber: purchaseOrder.phoneNumber,
                state: purchaseOrder.state,
                createdAt: purchaseOrder.createdAt,
                purchaseOrderDetails: purchaseOrder.purchaseOrderDetails.map((detail) => ({
                    id: detail.id,
                    articleId: detail.articleId,
                    purchaseOrderId: detail.purchaseOrderId,
                    amount: detail.amount,
                    article: detail.article
                }))
            };
        })

        return response!;
    }

    private async getById(id: number) {
        const purchaseOrder = await prisma.purchaseOrder.findUnique({
            include: {
                purchaseOrderDetails: {
                    include: {
                        article: true
                    }
                }
            },
            where: {
                id,
                state: true
            }
        });

        return purchaseOrder;
    }

    private async areArticlesValid(articleIdList: number[]): Promise<boolean> {
        const articles = await prisma.article.findMany({
            where: {
                id: {
                    in: articleIdList
                },
                state: true
            },
            select: {
                id: true
            }
        });

        return articleIdList.length === articles.length;
    }

    private async updateArticlesStock(transaction: any, purchaseOrderDetails: PurchaseOrderDetailDto[], operation: 'increment' | 'decrement') {
        for (const detail of purchaseOrderDetails) {
            await transaction.article.update({
                where: {
                    id: detail.articleId
                },
                data: {
                    stock: {
                        [operation]: detail.amount
                    }
                }
            });
        }
    }
}