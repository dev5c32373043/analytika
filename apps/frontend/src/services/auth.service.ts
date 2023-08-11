import { request } from '../utils';

interface LoginData {
  email: string;
  passcode: string;
}

interface SignUpData extends LoginData {
  name: string;
}

export class AuthService {
  async login(data: LoginData) {
    const resp = await request.post('/api/customers/auth/sign-in', data);
    if (resp.status !== 200) {
      throw new Error(resp.data.message);
    }

    return resp.data;
  }

  async signUp(data: SignUpData) {
    const resp = await request.post('/api/customers/auth/sign-up', data);
    if (resp.status !== 201) {
      throw new Error(resp.data.message);
    }

    return resp.data;
  }

  async logout(): Promise<void> {
    const resp = await request.delete('/api/customers/auth/logout');
    if (resp.status !== 200) {
      throw new Error(resp.data.message);
    }
  }
}
