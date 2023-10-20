export interface AuthenticationInterface {
  message: string;
  data:    Data;
}

export interface Data {
  user:       User;
  accesToken: string;
}

export interface User {
  id:        string;
  name:      string;
  last_name: string;
  password:  string;
  phone:     string;
  address:   string;
  email:     string;
  rol:       string;
  status:    boolean;
  createAt:  Date;
  updateAt:  Date;
}
