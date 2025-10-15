import { Router } from "express";
import healthRouter from "./health";
import rolesRouter from "./roles";
import equipesRouter from "./equipes";
import utilisateursRouter from "./utilisateurs";
import horairesRouter from "./horaires";
import indicateursRouter from "./indicateurs";

const apiRouter = Router();

// On appelle les différents routeurs (/routes)
apiRouter.use("/health", healthRouter);
apiRouter.use("/roles", rolesRouter);
apiRouter.use("/equipes", equipesRouter);
apiRouter.use("/utilisateurs", utilisateursRouter);
apiRouter.use("/horaires", horairesRouter);
apiRouter.use("/indicateurs", indicateursRouter);

export default apiRouter;