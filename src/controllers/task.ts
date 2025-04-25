import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

interface TaskSchema{
    taskType: string,
    assignee: string,
    priorityLevel: string,
    description: string,
    dueDate: string,
    location: string
}

export const createTask = async (req: Request, res: Response) : Promise<void> => {
    try {
        
        const task : TaskSchema = req.body;

        const createdTask = await prisma.task.create({
            data: {
                ...task
            }
        });

        res.status(201).json({
            status: 201,
            message: "Task created successfully",
            data: {taskId: createdTask.taskId}
        });

    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}