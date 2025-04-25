import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { sendCookie } from "../utils/cookies";
import bcrypt from "bcrypt";


const prisma = new PrismaClient();


export const createUser = async (req: Request, res: Response) : Promise<void> => {
    try {
        const {password,...rest} = req.body;

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await prisma.user.create({
            data:{
                password: hashedPassword,
                ...rest
            }
        });

        res.status(201).json({message: "Success", id: user.id});
    } catch (error:any) {
        if(error.code==="P2002"){
            res.status(409).json({message: "email exist"});
            return;
        }
        res.status(500).json({error: "Internal Server Error"});
    }
}


export const loginUser = async (req: Request, res: Response) : Promise<void> => {
    try {
        const {password,id} = req.body;

        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });

        if(user === null){
            res.status(404).json({message: "Invalid username"});
            return;
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            res.status(404).json({message: "Wrong Password"});
        }

        sendCookie(user.id,res,"Login Successfully",200);

    } catch (error:any) {

        res.status(500).json({error: "Internal Server Error"});
    }
}

export const logoutUser = (req:Request,res:Response) => {
    res.status(200).cookie("token","",{
        expires: new Date(Date.now()),
        sameSite: process.env.NODE_ENV === "Dev" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Dev" ? false : true
    }).json({
        success: true,
        message: "Logged out successfully"
    })
}