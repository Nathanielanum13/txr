import { Job } from "./Job";

export interface Sequence {
  id: string;
  app_id: string;
  app_name: string;
  description: string;
  frequency: string;
  jobs?: Job[]
  created_at: string;
  updated_at: string;
  traceid: string;
}
