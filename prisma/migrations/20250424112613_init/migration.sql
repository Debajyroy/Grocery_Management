-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Available', 'Closed', 'Failed');

-- CreateEnum
CREATE TYPE "shipmentStatusEnum" AS ENUM ('Complete', 'In_Transit', 'Pending', 'Failed');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "supplierId" SERIAL NOT NULL,
    "supplierName" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("supplierId")
);

-- CreateTable
CREATE TABLE "Shipper" (
    "shipperId" SERIAL NOT NULL,
    "shipperName" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Shipper_pkey" PRIMARY KEY ("shipperId")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "taskId" SERIAL NOT NULL,
    "taskType" TEXT NOT NULL,
    "assignee" TEXT NOT NULL,
    "priorityLevel" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("taskId")
);

-- CreateTable
CREATE TABLE "Product" (
    "productId" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "sellingPrice" INTEGER NOT NULL,
    "dateAdded" TIMESTAMP(3) NOT NULL,
    "totalOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "useId" INTEGER NOT NULL,
    "dateOfEntry" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL,
    "cashier" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'Available',

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "shipmentId" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "long" DOUBLE PRECISION NOT NULL,
    "shipmentStatus" "shipmentStatusEnum" NOT NULL DEFAULT 'In_Transit',
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "shipperId" INTEGER NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("shipmentId")
);

-- CreateTable
CREATE TABLE "OrderSnapshot" (
    "date" TIMESTAMP(3) NOT NULL,
    "totalActive" BIGINT NOT NULL DEFAULT 0,
    "totalInActive" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "OrderSnapshot_pkey" PRIMARY KEY ("date")
);

-- CreateTable
CREATE TABLE "ShipmentSnapTable" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "Complete" BIGINT NOT NULL DEFAULT 0,
    "In_Transit" BIGINT NOT NULL DEFAULT 0,
    "Pending" BIGINT NOT NULL DEFAULT 0,
    "Failed" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "ShipmentSnapTable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_email_key" ON "Supplier"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Shipper_email_key" ON "Shipper"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_orderId_key" ON "Shipment"("orderId");

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("supplierId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_useId_fkey" FOREIGN KEY ("useId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_shipperId_fkey" FOREIGN KEY ("shipperId") REFERENCES "Shipper"("shipperId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
