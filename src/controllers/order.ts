import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

interface Order{
    dateOfEntry?: string,
    quantity: number,
    productId: number
}

export const createOrder = async (req: Request, res: Response) : Promise<void> => {
    try {
 
        const {dateOfEntry, quantity, productId} : Order = req.body;
        const id = req.id;
        const newDate = new Date(dateOfEntry!);

        if(!id){
            res.status(201).json({message:"Order Created Successfully"});
            return;
        }

        const productExist = await prisma.product.findUnique({
            where:{
                productId:productId
            }
        });

        if(productExist === null){
            res.status(404).json({message: "ProductId not valid"});
            return;
        }

        if(productExist?.quantity<quantity){
            res.status(404).json({message: "Less Stock available"});
            return;
        }

        await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    useId: id,
                    cashier: 1,
                    dateOfEntry: newDate,
                    productId,
                    quantity
                }
            });

            const newShipment = await tx.shipment.create({
                data:{
                    orderId: newOrder.id,
                    lat: 2.983,
                    long: 38.28,
                    deliveryDate: new Date(2025,3,29),
                    shipperId: 1,
                }
            });

            const newProduct = await tx.product.update({
                where: {
                    productId: newOrder.productId
                },
                data: {
                    quantity: {
                        decrement: quantity,
                    },
                    totalOrder:{
                        increment: 1
                    }
                }
            });


            await tx.shipmentSnapTable.update({
                where: {
                    id: 1
                },
                data:{
                    In_Transit: {
                        increment: 1
                    }
                }
            });


            const update = await tx.orderSnapshot.updateMany({
                where: {
                    date: newOrder.dateOfEntry,
                },
                data: {
                    totalActive: {
                        increment: 1
                    }
                }
            });

            if(update.count === 0){
                const lastSnap = await tx.orderSnapshot.findFirst({
                    where: {
                        date: {
                            lt: newOrder.dateOfEntry
                        }
                    },
                    orderBy: {
                        date: 'desc'
                    }
                });

                const newTotalActive = lastSnap ? lastSnap.totalActive + BigInt(1) : 1;
                const newTotalInActive = lastSnap ? lastSnap.totalInActive : 0;

                await tx.orderSnapshot.create({
                    data:{
                        date: newOrder.dateOfEntry,
                        totalActive: newTotalActive,
                        totalInActive: newTotalInActive
                    }
                })
            }


        });

        res.status(201).json({message:"Order Created Successfully"});
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}






export const getStockDetails = async (req: Request, res: Response) : Promise<void> => {
    try {
        
        const pageNumber = parseInt(req.query.pageNumber as string) || 1;
        const offset = parseInt(req.query.offset as string) || 10;
        const statusParam = (req.query.status as string)?.toLowerCase();

        const status = 
            statusParam === "available" ? "Available" : 
            statusParam === "failed" ? "Failed" : 
            statusParam === "closed" ? "Closed" : undefined

        if(!status){
            res.status(400).json({message: "Invalid status value"});
            return;
        }

        const skip = (pageNumber - 1) * offset;


        const orders = await prisma.order.findMany({
            where: {
                status
            },
            skip,
            take: offset,
            include: {
                product: {
                    select: {
                        productId: true,
                        productName: true,
                        price: true,
                        sellingPrice: true,
                        supplier:{
                            select:{
                                supplierName: true
                            }
                        }
                    }
                },
                user: {
                    select:{
                        name: true
                    }
                },
            }
        });

        const stockDetails = orders.map((order)=>({
            productId : order.productId,
            productName : order.product.productName,
            consumerName : order.user.name,
            supplierName: order.product.supplier.supplierName,
            dateOfEntry : order.dateOfEntry,
            quantity : order.quantity,
            price : order.product.price,
            sellingPrice : order.product.sellingPrice,
            cashier : "Suman",
            status : order.status
        }))


        res.status(200).json({status:200,data:{
            stock : stockDetails
        }});

    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}





export const getOrderSnapshot = async (req: Request, res: Response) : Promise<void> =>{
    try {

        const type = (req.query.type as string)?.toLowerCase();
        const startDateStr = req.query.startDate as string;
        const endDateStr = req.query.endDate as string;

        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        if(startDate<new Date("2025-04-01")){
            res.status(400).json({message: "Our Order Operation starts from 2025-04-01. Please provide date after that"});
            return;
        }

        let daysArray = [];

        if(type == "weekly"){
            daysArray = getSunday(startDate,endDate)
        }
        else{
            daysArray = getLastDayOfMonth(startDate,endDate)
        }


        const result = await Promise.all(daysArray.map(async(date) => {
            const value = await prisma.orderSnapshot.findFirst({
                where: {
                    OR: [
                        {date},
                        {date: {lt: date}},
                    ],
                },
                orderBy: {
                    date: 'desc'
                }
            });

            return value;
        }));

        const data = result.map((val)=>({
            Active: (val?.totalActive! - val?.totalInActive!).toString(),
            Inactive: (val?.totalInActive)?.toString()
        }))

        res.status(200).json({status: 200, data})
        
        
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}


const getSunday = (startDate:Date, endDate:Date) => {
    let currentDate = new Date(startDate);

    const sunday = [];

    if(currentDate.getDay() !== 0){
        currentDate.setDate(currentDate.getDate() + (7 - currentDate.getDay()));
    }

    while(currentDate <= endDate){
        sunday.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate()+7);
    }
    return sunday;
}

const getLastDayOfMonth = (startDate:Date, endDate:Date) => {
    let currentDate = new Date(startDate);

    const lastdays = [];

    while(currentDate<=endDate){
        const lastday = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        lastdays.push(new Date(lastday));

        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return lastdays;
    
}