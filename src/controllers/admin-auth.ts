import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/cookies";

const prisma = new PrismaClient();


interface AdminCreate{
    username: string,
    password: string,
    firstName: string,
    middleName?: string,
    lastName: string,
    email: string,
    phoneNo: string,
}
interface AdminLogin{
    username: string,
    password: string
}

export const createAdmin = async (req: Request, res: Response) : Promise<void> => {
    try {

        const {username, password, email, ...rest} : AdminCreate = req.body;

        const usernameExist = await prisma.admin.findUnique({
            where: {
                username
            }
        });

        if(usernameExist !== null){
            res.status(404).json({message: "Usename already taken. Use some other username"});
            return;
        }

        const emailExist = await prisma.admin.findUnique({
            where: {
                email
            }
        });

        if(emailExist !== null){
            res.status(404).json({message: "This is registered email"});
            return;
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const admin = await prisma.admin.create({
            data: {
                username,
                email,
                password: hashedPassword,
                ...rest
            }
        });

        res.status(201).json({message:"Admin Created", username:admin.username});

    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}




export const loginAdmin = async (req: Request, res: Response) : Promise<void> => {
    try {
        
        const {username, password} : AdminLogin = req.body;

        const findAdmin = await prisma.admin.findUnique({
            where: {
                username
            }
        });

        if(findAdmin === null){
            res.status(404).json({message: "Invalid username"});
            return;
        }

        const isMatch = await bcrypt.compare(password,findAdmin.password);

        if(!isMatch){
            res.status(404).json({message: "Wrong Password"});
        }

        sendCookie(findAdmin.username,res,"Login Successfully",200);

    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}


export const logoutAdmin = (req:Request,res:Response) => {
    res.status(200).cookie("token","",{
        expires: new Date(Date.now()),
        sameSite: process.env.NODE_ENV === "Dev" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Dev" ? false : true
    }).json({
        status: 200,
        success: true,
        message: "Logged out successfully"
    })
}