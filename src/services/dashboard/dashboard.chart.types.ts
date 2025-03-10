import { R } from "@/types/response";

export type ResponseDashboardChart = R<Data>;

export interface Data {
  friday: Day;
  monday: Day;
  saturday: Day;
  thursday: Day;
  tuesday: Day;
  wednesday: Day;
}

export interface Day {
  close: number;
  dayName: string;
  inProgress: number;
  open: number;
  resolve: number;
}

export interface Validation {}
