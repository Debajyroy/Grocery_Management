import * as yup from "yup";

export const createAdminSchema = yup.object({
    username: yup.string().required("username is required"),
    password: yup.string().required("password is required"),
    firstName: yup.string().required("firstName is required"),
    middleName: yup.string().optional(),
    lastName: yup.string().required("lastName is required"),
    email: yup.string().email("Invalid email format").required("email is required"),
    phoneNo: yup.string().matches(/^\d{10}$/,"Phone no must be exactly 10 digits").required("Phone no is required")
})

export const loginSchema = yup.object({
    username: yup.string().required("username is required"),
    password: yup.string().required("password is required"),
})