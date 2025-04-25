import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();


interface MyPayload extends jwt.JwtPayload{
    id: string | number
}

export const isAdminAuthenticated = async(req:Request,res:Response,next:NextFunction) => {
    try {

        const {token} = req.cookies;

        if(!token){
            res.status(401).json({
                success: false,
                message: "Unauthorized access. Login required"
            });
            return;
        }

        const decoded = jwt.verify(token,process.env.AUTH_SECRET!) as MyPayload;

       if(typeof decoded.id === "number"){
            res.status(401).json({
                success: false,
                message: "Unauthorized access. Login required"
            });
            return;
        }


        const admin = await prisma.admin.findUnique({
            where: {
                username: decoded.id
            }
        })

        if(admin===null){
            res.status(401).json({
                success: false,
                message: "Unauthorized token. Logout first then login again"
            })
            return;
        }

        req.username = decoded.id;

        next();
        
    } catch (error:any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message:"Internal Server Error"
        });
        return;
    }
}







export const isUserAuthenticated = async(req:Request,res:Response,next:NextFunction) => {
    try {

        const {token} = req.cookies;

        if(!token){
            res.status(401).json({
                success: false,
                message: "Unauthorized access. Login required"
            });
            return;
        }

        const decoded = jwt.verify(token,process.env.AUTH_SECRET!) as MyPayload;

       if(typeof decoded.id === "string"){
            res.status(401).json({
                success: false,
                message: "Unauthorized access. Login required"
            });
            return;
        }


        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        })

        if(user===null){
            res.status(401).json({
                success: false,
                message: "Unauthorized token. Logout first then login again"
            })
            return;
        }

        req.id = decoded.id;

        next();
        
    } catch (error:any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message:"Internal Server Error"
        });
        return;
    }
}