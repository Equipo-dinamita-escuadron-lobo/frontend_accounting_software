
export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    password: string | null;
    email: string;
    roles: string[];
    username: string;
  }
