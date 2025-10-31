import { AuthResponseDTO } from "../dto/authResponse.dto";

export interface AuthService {
  login(email: string, password: string): Promise<string>;

  getAuthById(idl: string): Promise<AuthResponseDTO>;

  createAuth(auth: Omit<IAuth, "id">): Promise<AuthResponseDTO>;

  updateAuth(id: string, authInfo: Omit<IAuth, "id" | "email">): Promise<void>;

  deleteAuth(id: string): Promise<void>;
}
