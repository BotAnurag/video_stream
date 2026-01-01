import { Router } from "express";
import { createUser } from "../controller/user.controller";

const router = Router();

router.post("/", createUser);

export default router;
