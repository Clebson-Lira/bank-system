import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    photoUrl?: string;
  };
}

interface RegisterData {
  fullName: string;
  email: string;
  cpf: string;
  birthDate: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth'; // Ajuste para sua API

  constructor(private http: HttpClient) {}

   // Método de login fake para testes
  fakeLogin(email: string, password: string): Observable<LoginResponse> {
    // Defina aqui o usuário e senha de teste
    if (email === 'teste@teste.com' && password === '123456') {
      const response: LoginResponse = {
        token: 'fake-token',
        user: {
          id: '1',
          fullName: 'Usuário Teste',
          email: 'teste@teste.com'
        }
      };
      // Salva no localStorage como o login real
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return of(response);
    } else {
      // Simula erro de login
      throw new Error('Usuário ou senha inválidos');
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        })
      );
  }

  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // isLoggedIn(): boolean {
  //   return !!localStorage.getItem('token');
  // }
  isLoggedIn(): boolean {
  return !!localStorage.getItem('user');
}

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/change-password`, { currentPassword, newPassword });
  }
}
