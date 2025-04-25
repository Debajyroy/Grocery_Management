import * as yup from "yup";

export const orderSchema = yup.object({
    productId: yup.number().required("productId is required"),
    quantity: yup.number().required("quantity is required"),
    dateOfEntry: yup.string().optional()
})