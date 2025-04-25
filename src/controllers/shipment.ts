import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();


export const shipmentStatistics = async (req: Request, res: Response) : Promise<void> =>{
    try {
        
        const shipmentStat = await prisma.shipmentSnapTable.findUnique({
            where: {
                id: 1
            }
        });

        const data = {
            Total: (shipmentStat?.Complete! + shipmentStat?.Failed! + shipmentStat?.In_Transit! + shipmentStat?.Pending!).toString(),
            Completed: (shipmentStat?.Complete)?.toString(),
            In_Transit: shipmentStat?.In_Transit?.toString(),
            Pending: shipmentStat?.Pending?.toString(),
            Failed: shipmentStat?.Failed?.toString()
        }

        res.status(200).json({status: 200,data})

    } catch (error) {
        // console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}



export const shipmentDetails = async (req: Request, res: Response) : Promise<void> =>{
    try {

        const pageNumber = parseInt(req.query.pageNumber as string) || 1;
        const offset = parseInt(req.query.offset as string) || 10;
        const statusParam = (req.query.status as string)?.toLowerCase();

        const status = 
            statusParam === "in-transit" ? "In_Transit" : 
            statusParam === "complete" ? "Complete" : 
            statusParam === "pending" ? "Pending" : 
            statusParam === "failed" ? "Failed" : undefined

        if(!status){
            res.status(400).json({message: "Invalid status value"});
            return;
        }

        const skip = (pageNumber - 1) * offset;

        const shipments = await prisma.shipment.findMany({
            where: {
                shipmentStatus: status
            },
            skip,
            take: offset,
            include:{
                order:{
                    select:{
                        quantity: true,
                        product:{
                            select:{
                                productId: true,
                                productName: true,
                                sellingPrice: true,
                                supplierId: true,
                                supplier:{
                                    select:{
                                        supplierName: true,
                                    }
                                }
                            }
                        },
                        user:{
                            select:{
                                location:true
                            }
                        }
                    }
                },
                shipper:{
                    select:{
                        shipperName: true
                    }
                }
            }
        });


        const result = shipments.map((shipment) => ({
            shipmentId: shipment.shipmentId,
            productId: shipment.order.product.productId,
            productName: shipment.order.product.productName,
            supplierId: shipment.order.product.supplierId,
            supplierName: shipment.order.product.supplier.supplierName,
            quantity: shipment.order.quantity,
            price: shipment.order.product.sellingPrice,
            DeliveryDate: shipment.deliveryDate,
            shipperId: shipment.shipmentId,
            shipperName: shipment.shipper.shipperName,
            shipmentDestination: shipment.order.user.location,
            shipmentStatus: shipment.shipmentStatus,
            lat: shipment.lat,
            long: shipment.long
        }));


        res.status(200).json({status:200,data:{
            shipment: result
        }});
        
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}