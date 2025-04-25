import * as yup from "yup";

export const productSchema = yup.object({
    productType: yup.string().required("productType is required"),
    productName: yup.string().required("productName is required"),
    supplierId: yup.number().required("supplierId is required"),
    quantity: yup.number().required("quantity is required"),
    price: yup.number().required("price is required"),
    sellingPrice: yup.number().required("sellingPrice is required"),
    dateAdded: yup.date().required("dateAdded is required")
})