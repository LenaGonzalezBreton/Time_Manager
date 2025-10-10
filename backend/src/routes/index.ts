import { Router } from "express";
import healthRouter from "./health";
import rolesRouter from "./roles";

const apiRouter = Router();

// On appelle les différents routeurs (/routes)
apiRouter.use("/health", healthRouter);
apiRouter.use("/roles", rolesRouter);

export default apiRouter;