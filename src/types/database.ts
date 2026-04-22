export type UserPreferences = {
  theme: 'dark' | 'light';
  accentColor: string;
};

export type DatabaseUser = {
  uid: string;
  name: string;
  email: string;
  created_at: Date;
  preferences: UserPreferences;
};

export type Habit = {
  id: string;
  user_id: string;
  title: string;
  icon: string;
  logs: string[]; // ISODate strings like "2026-04-22"
};

export type TaskOrEvent = {
  id: string;
  user_id: string;
  title: string;
  date: Date; // Timestamp
  status: 'pendente' | 'em_andamento' | 'concluido';
};

export type WheelOfLifeScore = {
  health: number;
  spirituality: number;
  business: number;
  relationships: number;
  finances: number;
};

export type WheelOfLife = {
  id: string;
  user_id: string;
  month_year: string; // "04-2026"
  scores: WheelOfLifeScore;
};

export type ReadingLog = {
  book_title: string;
  cover_url: string;
  rating: number; // 1 to 5
  review: string;
};

export type JournalEntry = {
  id: string;
  user_id: string;
  date: Date;
  best_thing: string;
  gratitude_list: string[];
  reading_log?: ReadingLog;
};

export type DeepWorkSession = {
  id: string;
  user_id: string;
  project_title: string;
  duration_minutes: number;
  date: Date;
};

export type FinancialMetrics = {
  id: string;
  user_id: string;
  month_year: string; // "04-2026"
  revenue: number;
  ad_spend: number;
  fixed_costs: number;
  net_profit: number; // revenue - ad_spend - fixed_costs
};
