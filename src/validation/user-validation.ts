import * as yup from "yup";

export const createUserSchema = yup.object({
    location: yup.string().required("location is required"),
    password: yup.string().required("password is required"),
    name: yup.string().required("firstName is required"),
    email: yup.string().email("Invalid email format").required("email is required"),
})

export const UserloginSchema = yup.object({
    id: yup.number().required("id is required"),
    password: yup.string().required("password is required"),
})