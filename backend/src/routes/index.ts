import { Router } from "express";
import healthRouter from "./health.js";
import rolesRouter from "./roles.js";
import equipesRouter from "./equipes.js";
import utilisateursRouter from "./utilisateurs.js";
import horairesRouter from "./horaires.js";
import indicateursRouter from "./indicateurs.js";
import absencesRouter from "./absences.js";
import ciblesIndicateurRouter from "./cibles_indicateur.js";
import joursFeriesRouter from "./jours_feries.js";
import planningsRouter from "./plannings.js";
import typesAbsenceRouter from "./types_absence.js";
import typesHoraireRouter from "./types_horaire.js";
import rapportsRouter from "./rapports.js";
import authRouter from "./auth.routes.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const apiRouter = Router();

// Routes publiques (sans authentification)
apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);

// Routes protégées (authentification requise)
apiRouter.use("/roles", authenticateToken, rolesRouter);
apiRouter.use("/equipes", authenticateToken, equipesRouter);
apiRouter.use("/utilisateurs", authenticateToken, utilisateursRouter);
apiRouter.use("/horaires", authenticateToken, horairesRouter);
apiRouter.use("/indicateurs", authenticateToken, indicateursRouter);
apiRouter.use("/absences", authenticateToken, absencesRouter);
apiRouter.use("/cibles-indicateur", authenticateToken, ciblesIndicateurRouter);
apiRouter.use("/jours-feries", authenticateToken, joursFeriesRouter);
apiRouter.use("/plannings", authenticateToken, planningsRouter);
apiRouter.use("/types-absence", authenticateToken, typesAbsenceRouter);
apiRouter.use("/types-horaire", authenticateToken, typesHoraireRouter);
apiRouter.use("/rapports", authenticateToken, rapportsRouter);

export default apiRouter;