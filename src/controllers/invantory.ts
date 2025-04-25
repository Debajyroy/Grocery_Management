import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

interface ProductSchema{
    productType: string,
    productName: string,
    supplierId: number,
    quantity: number,
    price: number,
    sellingPrice: number,
    dateAdded: Date
}

export const createProduct = async (req: Request, res: Response) : Promise<void> => {
    try {
        
        const product: ProductSchema = req.body;

        const newProduct = await prisma.product.create({
            data: {
                ...product
            }
        });

        res.status(201).json({
            status: 201,
            message: "Stock created successfully",
            data: {productId: newProduct.productId}
        })

    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const getNewStock = async (req: Request, res: Response) : Promise<void> => {
    try {
        
        const product = await prisma.product.findMany({
            orderBy: [
                {dateAdded: 'desc'},
                {productId: 'desc'}
            ],
            take: 10
        });

        res.status(200).json({
            status: 200,
            data: {newStock: product}
        })

    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}


export const dailyOrderList = async (req: Request, res: Response) : Promise<void> => {
    try {

        if(req.query.view != "daily"){
            res.status(404).json({message: "Invalid query"})
        }

        const orders = await prisma.orderSnapshot.findMany({
            orderBy: {
                date: 'asc'
            }
        });



        let previousActive = BigInt(0);

        const dailyOrder = orders.map((order)=>{
            const todaysOrder = order.totalActive - previousActive;
            previousActive = order.totalActive;
            return {
                date: order.date,
                totalOrder: todaysOrder.toString()
            }
        });

        res.status(200).json({status:200, data:{orders: dailyOrder}});

    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}




export const summary = async (req: Request, res: Response) : Promise<void> => {
    try {

        const [lowStock, outOfStock, totalStock, highDemandOrders] = await Promise.all([
            prisma.product.count({
                where: {
                    quantity: {
                        lt: 10,
                        gt:0
                    }
                }
            }),



            prisma.product.count({
                where: {
                    quantity: 0
                }
            }),


            prisma.product.aggregate({
                _sum: {
                    quantity: true,
                }
            }),

            prisma.product.count({
                where: {
                    totalOrder:{
                        gt: 100
                    }
                }
            }),

        ]);


        res.status(200).json({lowStock, outOfStock, totalStock: totalStock._sum.quantity, highDemandOrders})
        
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}