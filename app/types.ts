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

export interface Belongings {
  name: string;
  description: string;
  identifier_code: string;
}

export type InvitationStatusData = {
  current_status: string;
  created_at: string;
};

export type InvitationPassData = {
  id: number;
  valid_from: string;
  valid_till: string;
  purpose: string;
  checked_in_at: string;
  checked_out_at: string;
  visitor: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
    company: string;
  };
  visiting_person: {
    emai: string;
    first_name: string;
    last_name: string;
    role: string;
  };
  invitationstatus_set: [InvitationStatusData];
  belongings: [Belongings];
};

export type InvitationPassResponse = {
  success: boolean;
  message: string;
  data: InvitationPassData[];
};

export type NotificationData = {
  text: string;
  created_at: string;
  notification_type: string;
  is_read: boolean;
};
