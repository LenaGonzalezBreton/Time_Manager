import { AppDataSource } from "../data-source";
import { Indicateur } from "../entities/Indicateur";

export type KpiAutorise = "taux_presence" | "taux_retard" | "minutes_travaillees" | "minutes_retards";
export type Granularite = "summary" | "daily"; // valeurs internes conservées pour compatibilité

export interface FiltresRapport {
  userId?: number;
  teamId?: number;
  startDate?: string | null; // YYYY-MM-DD
  endDate?: string | null;   // YYYY-MM-DD
  kpis?: KpiAutorise[];      // si non défini -> tous
  granularity?: Granularite; // par défaut : summary
}

export interface ReponseRapport {
  scope: {
    userId: number | null;
    teamId: number | null;
    startDate: string | null;
    endDate: string | null;
    kpis: KpiAutorise[];
    source: "indicateurs";
    aggregation: Record<KpiAutorise, "avg" | "sum">;
  };
  period: {
    daysCount: number;
    firstDate: string | null;
    lastDate: string | null;
  };
  kpis: Partial<Record<KpiAutorise, number | null>>;
  daily?: Array<{ date: string } & Partial<Record<KpiAutorise, number | null>>>;
}

const TOUS_KPIS: KpiAutorise[] = [
  "taux_presence",
  "taux_retard",
  "minutes_travaillees",
  "minutes_retards",
];

const AGREGATION: Record<KpiAutorise, "avg" | "sum"> = {
  taux_presence: "avg",
  taux_retard: "avg",
  minutes_travaillees: "sum",
  minutes_retards: "sum",
};

export async function getRapport(filters: FiltresRapport): Promise<ReponseRapport> {
  const kpis = (filters.kpis && filters.kpis.length ? filters.kpis : TOUS_KPIS).slice();
  const granularity: Granularite = filters.granularity ?? "summary";

  const repo = AppDataSource.getRepository(Indicateur);
  const qb = repo
    .createQueryBuilder("i")
    .innerJoin("i.cible_indicateur", "c");

  // Filtres de portée
  if (filters.userId) {
    qb.andWhere("c.type_cible = :tc AND c.id_cible = :id", { tc: "utilisateur", id: filters.userId });
  }
  if (filters.teamId) {
    qb.andWhere("c.type_cible = :tc AND c.id_cible = :id", { tc: "equipe", id: filters.teamId });
  }

  // Filtres de dates
  if (filters.startDate && filters.endDate) {
    qb.andWhere("i.date_periode BETWEEN :start AND :end", {
      start: filters.startDate,
      end: filters.endDate,
    });
  } else if (filters.startDate) {
    qb.andWhere("i.date_periode = :start", { start: filters.startDate });
  } else if (filters.endDate) {
    qb.andWhere("i.date_periode = :end", { end: filters.endDate });
  }

  // Agrégats de synthèse
  const summaryQb = qb.clone();
  summaryQb.select([]);
  summaryQb.addSelect("MIN(i.date_periode)", "first_date");
  summaryQb.addSelect("MAX(i.date_periode)", "last_date");
  summaryQb.addSelect("COUNT(DISTINCT i.date_periode)", "days_count");

  for (const k of kpis) {
    if (AGREGATION[k] === "avg") {
      summaryQb.addSelect(`AVG(i.${k})`, `avg_${k}`);
    } else {
      summaryQb.addSelect(`SUM(i.${k})`, `sum_${k}`);
    }
  }

  const rawSummary = await summaryQb.getRawOne<{ [key: string]: any }>();

  const daysCount = rawSummary?.days_count ? Number(rawSummary.days_count) : 0;
  const firstDate = rawSummary?.first_date ?? null;
  const lastDate = rawSummary?.last_date ?? null;

  const kpiValues: Partial<Record<KpiAutorise, number | null>> = {};
  for (const k of kpis) {
    const key = (AGREGATION[k] === "avg" ? `avg_${k}` : `sum_${k}`) as string;
    const raw = rawSummary ? rawSummary[key] : null;
    if (AGREGATION[k] === "avg") {
      // Moyenne -> null si aucune donnée
      kpiValues[k] = raw == null ? null : Number(raw);
    } else {
      // Somme -> 0 si aucune donnée
      const num = raw == null ? 0 : Number(raw);
      kpiValues[k] = Number.isFinite(num) ? num : 0;
    }
  }

  const response: ReponseRapport = {
    scope: {
      userId: filters.userId ?? null,
      teamId: filters.teamId ?? null,
      startDate: filters.startDate ?? null,
      endDate: filters.endDate ?? null,
      kpis,
      source: "indicateurs",
      aggregation: AGREGATION,
    },
    period: {
      daysCount,
      firstDate,
      lastDate,
    },
    kpis: kpiValues,
  };

  if (granularity === "daily") {
    const dailyQb = qb.clone();
    dailyQb.select(["i.date_periode AS date"]);
    for (const k of kpis) {
      if (AGREGATION[k] === "avg") {
        dailyQb.addSelect(`AVG(i.${k})`, `${k}`);
      } else {
        dailyQb.addSelect(`SUM(i.${k})`, `${k}`);
      }
    }
    dailyQb.groupBy("i.date_periode");
    dailyQb.orderBy("i.date_periode", "ASC");

    const rawDaily = await dailyQb.getRawMany<{ [key: string]: any }>();
    response.daily = rawDaily.map(r => {
      const entry: any = { date: r.date };
      for (const k of kpis) {
        const val = r[k as string];
        if (AGREGATION[k] === "avg") {
          entry[k] = val == null ? null : Number(val);
        } else {
          const num = val == null ? 0 : Number(val);
          entry[k] = Number.isFinite(num) ? num : 0;
        }
      }
      return entry as { date: string } & Partial<Record<KpiAutorise, number | null>>;
    });
  }

  return response;
}
