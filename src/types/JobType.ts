export interface JobType {
  id: string;
  name: string;
  options: { [x: string]: any };
  type: JobTypeType;
  created_at: string;
  updated_at: string;
  traceid: string;
}

export type JobTypeType = "TXR_JOB_TYPE" | "CUSTOM_JOB_TYPE"
