export interface Application {
  id: string;
  name: string;
  contact: Contact[]
  created_at: string;
  updated_at: string;
  traceid: string
}

interface Contact {
  name: string;
  email: string;
  phone: string;
  type: "PRIMARY" | "SECONDARY" | "TECHNICAL"
}
