import express from "express";
import { isAdminAuthenticated, isUserAuthenticated } from "../middleware/auth";
import { blogSchema } from "../validation/blog-validation";
import SchemaValidator from "../middleware/schema-validator"
import { createBlog, findAllBlogs, findBlogById, findAllBlogsWithFilter } from "../controllers/blog";

const router = express.Router();

router.post("/blog/create",isUserAuthenticated,SchemaValidator(blogSchema),createBlog);
router.get("/blogs",isAdminAuthenticated, findAllBlogs);
router.get("/blog/:id",isAdminAuthenticated, findBlogById);
router.get("/blogs/all",isAdminAuthenticated,findAllBlogsWithFilter);

export default router;