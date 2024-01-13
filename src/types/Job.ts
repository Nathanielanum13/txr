export interface Job {
  id: string;
  seq_id: string;
  to: string;
  type: string;
  options: { [x: string]: any };
  created_at: string;
  updated_at: string;
  traceid: string;
}
