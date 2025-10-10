import { Router } from "express";
import healthRouter from "./health";
import rolesRouter from "./roles";
import equipesRouter from "./equipes";

const apiRouter = Router();

// On appelle les différents routeurs (/routes)
apiRouter.use("/health", healthRouter);
apiRouter.use("/roles", rolesRouter);
apiRouter.use("/equipes", equipesRouter);

export default apiRouter;