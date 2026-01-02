import { Router } from "express";
import { createUser, logInUser } from "../controller/user.controller";

const router = Router();

router.post("/", createUser);
router.post("/login", logInUser);

export default router;
