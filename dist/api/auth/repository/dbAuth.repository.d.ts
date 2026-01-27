import { AuthRepository } from "./auth.repository";
export declare class DbAuthRepository implements AuthRepository {
    findByEmail(email: string): Promise<IAuth>;
    save(auth: Omit<IAuth, "id">): Promise<IAuth>;
    findAll(): Promise<IAuth>;
    findById(id: string): Promise<IAuth | null>;
    update(id: string, authInfo: Partial<Omit<IAuth, "id" | "user_id">>): Promise<IAuth>;
    delete(id: string): Promise<void>;
}
