import { Request, Response } from "express";
import { getRapport, KpiAutorise, Granularite, FiltresRapport } from "../services/rapports.service";

const KPIS_AUTORISES: KpiAutorise[] = [
  "taux_presence",
  "taux_retard",
  "minutes_travaillees",
  "minutes_retards",
];

function isIsoDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export async function getRapports(req: Request, res: Response) {
  const { userId, teamId, startDate, endDate, kpis, granularity } = req.query as Record<string, string | undefined>;

  // Exclusivité userId/teamId
  if (userId && teamId) {
    return res.status(400).json({ message: "userId et teamId sont exclusifs" });
    }

  // Parse IDs
  const parsedUserId = userId ? Number(userId) : undefined;
  const parsedTeamId = teamId ? Number(teamId) : undefined;
  if (userId && (!Number.isInteger(parsedUserId!) || parsedUserId! <= 0)) {
    return res.status(400).json({ message: "userId invalide" });
  }
  if (teamId && (!Number.isInteger(parsedTeamId!) || parsedTeamId! <= 0)) {
    return res.status(400).json({ message: "teamId invalide" });
  }

  // Dates
  let sd = startDate || undefined;
  let ed = endDate || undefined;

  if (sd && !isIsoDate(sd)) return res.status(400).json({ message: "startDate doit être au format YYYY-MM-DD" });
  if (ed && !isIsoDate(ed)) return res.status(400).json({ message: "endDate doit être au format YYYY-MM-DD" });

  if (sd && !ed) ed = sd;
  if (ed && !sd) sd = ed;

  if (sd && ed && sd > ed) {
    return res.status(400).json({ message: "startDate ne peut pas être supérieure à endDate" });
  }

  // KPIs
  let selectedKpis: KpiAutorise[] | undefined = undefined;
  if (kpis && kpis.trim().length) {
    const parts = kpis.split(",").map(s => s.trim()).filter(Boolean);
    const invalid = parts.filter(p => !KPIS_AUTORISES.includes(p as KpiAutorise));
    if (invalid.length) {
      return res.status(400).json({ message: `KPI(s) invalide(s): ${invalid.join(", ")}` });
    }
    selectedKpis = parts as KpiAutorise[];
  }

  // Granularité
  let g: Granularite | undefined = undefined;
  if (granularity) {
    if (granularity !== "summary" && granularity !== "daily") {
      return res.status(400).json({ message: "granularity doit être 'summary' ou 'daily'" });
    }
    g = granularity as Granularite;
  }

  // Construire l'objet de filtres sans undefined explicite
  const filters: FiltresRapport = {};
  if (parsedUserId !== undefined) filters.userId = parsedUserId;
  if (parsedTeamId !== undefined) filters.teamId = parsedTeamId;
  if (sd) filters.startDate = sd;
  if (ed) filters.endDate = ed;
  if (selectedKpis) filters.kpis = selectedKpis;
  if (g) filters.granularity = g;

  const rapport = await getRapport(filters);

  return res.status(200).json(rapport);
}

export async function postRapportsRecompute(_req: Request, res: Response) {
  // Stub: pas d'effet de bord, ne recalcul rien pour le moment
  return res.status(202).json({ message: "Recalcul des rapports non implémenté pour le moment" });
}
