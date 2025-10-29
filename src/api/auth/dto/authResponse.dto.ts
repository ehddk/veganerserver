export class AuthResponseDTO {
  id: string;
  name: string;
  email: string;
  password: string;

  constructor(params: IAuth) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.password = params.password;
  }
}
