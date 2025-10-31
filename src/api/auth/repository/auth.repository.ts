export interface AuthRepository {
  findByEmail(email: string): Promise<IAuth>;
  findAll(): Promise<IAuth>;
  findById(id: string): Promise<IAuth | null>;
  save(auth: Omit<IAuth, "id">): Promise<IAuth>;
  update(id: string, authInfo: Partial<IAuth>): Promise<IAuth | null>;
  delete(id: string): Promise<void>;
}
