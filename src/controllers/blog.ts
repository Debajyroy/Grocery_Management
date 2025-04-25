import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

interface BlogSchema{
    image: string,
    title: string,
    description: string
}

export const createBlog = async (req: Request, res: Response) : Promise<void> => {
    try {
        const id = req.id;
        const {image, description, title} : BlogSchema = req.body;

        if(typeof id === "undefined"){
            res.status(500).json({error: "Internal Server Error"});
            return;
        }

        const blog = await prisma.blog.create({
            data: {
                createdBy: id,
                title,
                description,
                image
            }
        })

        res.status(201).json({message:"New Blog Created", blog})
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}


export const findAllBlogs = async (req: Request, res: Response) : Promise<void> => {
    try {
        const all_blogs = await prisma.blog.findMany();

        const blogs = all_blogs.map(({createdDate, id, image, title, description})=>({
            id,
            image,
            title,
            description,
            date: createdDate
        }));

        const data = {
            Blogs: blogs
        }
        res.status(200).json({status: 200, data});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}


export const findBlogById = async (req: Request, res: Response) : Promise<void> => {
    try {
        const {id} = req.params;

        if(!/^\d+$/.test(id)){
            res.status(400).json({message: "Invalid Id, id must be an integer"});
            return;
        }

        const Id = parseInt(id);

        const blog = await prisma.blog.findUnique({
            where: {
                id: Id
            },
            include: {
                user: {
                    select: {name: true}
                }
            }
        });

        if(blog===null){
            res.status(404).json({message: `id ${id} not exist`});
            return;
        }

        const modifiedBlog = {
            id: blog.id,
            Image: blog.image,
            title: blog.title,
            description: blog.description,
            createdBy: blog.user.name,
            createdDate: blog.createdDate
        }

        const data = {
            Blog: modifiedBlog
        }
        res.status(200).json({status: 200, data});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}





export const findAllBlogsWithFilter = async (req: Request, res: Response) : Promise<void> => {
    try {

        const temp_pageNumber = req.query.pageNumber as string;
        const temp_offset = req.query.Offset as string;

        if(!/^\d+$/.test(temp_pageNumber) || !/^\d+$/.test(temp_offset)){
            res.status(400).json({message: "Invalid pageNumber or Offset"});
            return;
        }



        const pageNumber = parseInt(temp_pageNumber);
        const Offset = parseInt(temp_offset);

        if(pageNumber<1 || Offset<=0){
            res.status(400).json({message: "Invalid pageNumber or Offset"});
            return;
        }


        const skip = (pageNumber - 1) * Offset;

        const all_blogs = await prisma.blog.findMany({
            skip,
            take: Offset,
            include: {
                user:{
                    select:{
                        name: true
                    }
                }
            }
        });


        const blogs = all_blogs.map(({...all})=>({
            id: all.id,
            Image: all.image,
            title: all.title,
            description: all.description,
            createdBy: all.user.name,
            createdDate: all.createdDate
        }));

        res.status(200).json({status: 200, data: {Blogs: blogs}})

    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}