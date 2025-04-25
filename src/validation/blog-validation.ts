import * as yup from "yup";

export const blogSchema = yup.object({
    image: yup.string().required("image is required"),
    title: yup.string().required("title is required"),
    description: yup.string().required("description is required")
})