import { Router } from "express";
import healthRouter from "./health";

const apiRouter = Router();

// On appelle les différents routeurs (/routes)
apiRouter.use("/health", healthRouter);

export default apiRouter;