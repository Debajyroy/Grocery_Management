import * as yup from "yup";

export const taskSchema = yup.object({
    taskType: yup.string().required("taskType is required"),
    assignee: yup.string().required("assignee is required"),
    priorityLevel: yup.string().required("priorityLevel is required"),
    description: yup.string().required("description is required"),
    dueDate: yup.date().required("dueDate is required"),
    location: yup.string().required("location is required")
})