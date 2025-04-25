import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();


export const getAdminProfile = async (req: Request, res: Response) : Promise<void> => {
    try {
        const username  = req.username;

        const admin = await prisma.admin.findUnique({
            where: {
                username
            }
        });

        if(admin === null){
            res.status(500).json({error: "Internal Server Error"});
        }

        const data = {
            username : admin?.username,
            firstName: admin?.firstName,
            middleName: admin?.middleName,
            lastName: admin?.lastName,
            email: admin?.email,
            phone: admin?.phoneNo
        };

        res.status(200).json({status: 200, message:"Profile details fetched successfully", data})
        
        
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}