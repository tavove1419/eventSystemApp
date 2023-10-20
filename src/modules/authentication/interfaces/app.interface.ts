import { UserInterface } from 'src/modules/administration/interfaces/user.interface';

export interface AppStateInterface{
  isAuthenticated: boolean;
  accesToken: string | null;
  userInfo: UserInterface | null;
}
