import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import adminAuthRouter from "../grocery_store_management/src/routes/admin-auth";
import adminProfileRouter from "../grocery_store_management/src/routes/admin-profile";
import userAuthRout from "../grocery_store_management/src/routes/user-auth";
import blogRout from "../grocery_store_management/src/routes/blog";
import taskRout from "../grocery_store_management/src/routes/task";
import inventoryRout from "../grocery_store_management/src/routes/inventory";
import shipmentRouter from "../grocery_store_management/src/routes/shipment";
import orderRouter from "../grocery_store_management/src/routes/order";


dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());


app.use("/api/v1/auth/admin",adminAuthRouter);
app.use("/api/v1/admin",adminProfileRouter);
app.use("/api/v1/auth/user",userAuthRout);
app.use("/api/v1",blogRout);
app.use("/api/v1",taskRout);
app.use("/api/v1",inventoryRout);
app.use("/api/v1",shipmentRouter);
app.use("/api/v1",orderRouter);


const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});