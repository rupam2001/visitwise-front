export interface Response {
  success: Boolean;
  message: String;
  data: Map<String, any>;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface UserTableProps {
  userData: User[];
}

export interface InviteData {
  date: string;
  time: string;
  purpose: string;
  //location
}

export interface VisitorData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
}
