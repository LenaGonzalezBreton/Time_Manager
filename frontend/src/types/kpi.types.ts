// Type pour l'entité Utilisateur (correspond à la structure du backend)
export interface KPI {
    id_kpi: number;
    target: 'user' | 'group';
    name: string;
    start_date: Date;
    end_date: Date;
    type: 'absence' | 'retard';
}