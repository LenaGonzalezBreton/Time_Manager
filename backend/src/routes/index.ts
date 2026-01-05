import { Router } from "express";
import healthRouter from "./health";
import rolesRouter from "./roles";
import equipesRouter from "./equipes";
import utilisateursRouter from "./utilisateurs";
import horairesRouter from "./horaires";
import indicateursRouter from "./indicateurs";
import absencesRouter from "./absences";
import ciblesIndicateurRouter from "./cibles_indicateur";
import joursFeriesRouter from "./jours_feries";
import planningsRouter from "./plannings";
import typesAbsenceRouter from "./types_absence";
import typesHoraireRouter from "./types_horaire";
import rapportsRouter from "./rapports";

const apiRouter = Router();

// On appelle les différents routeurs (/routes)
apiRouter.use("/health", healthRouter);
apiRouter.use("/roles", rolesRouter);
apiRouter.use("/equipes", equipesRouter);
apiRouter.use("/utilisateurs", utilisateursRouter);
apiRouter.use("/horaires", horairesRouter);
apiRouter.use("/indicateurs", indicateursRouter);
apiRouter.use("/absences", absencesRouter);
apiRouter.use("/cibles-indicateur", ciblesIndicateurRouter);
apiRouter.use("/jours-feries", joursFeriesRouter);
apiRouter.use("/plannings", planningsRouter);
apiRouter.use("/types-absence", typesAbsenceRouter);
apiRouter.use("/types-horaire", typesHoraireRouter);
apiRouter.use("/rapports", rapportsRouter);

export default apiRouter;