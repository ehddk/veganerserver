import { AuthResponseDTO } from "../dto/authResponse.dto";
import { AuthRepository } from "../repository/auth.repository";
import { AuthService } from "./auth.service.type";
export declare class AuthServicesImpl implements AuthService {
    private readonly _authRepository;
    constructor(authRepository: AuthRepository);
    login(email: string, password: string): Promise<string>;
    getAuthById(id: string): Promise<AuthResponseDTO>;
    createAuth(auth: Omit<IAuth, "id">): Promise<AuthResponseDTO>;
    updateAuth(id: string, authInfo: Omit<IAuth, "id" | "email">): Promise<void>;
    deleteAuth(id: string): Promise<void>;
}
