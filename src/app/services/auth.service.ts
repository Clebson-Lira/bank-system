import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    accountNumber: string;
    agency: string;
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
  private baseUrl = 'http://localhost:3000/auth'; // Ajuste para sua API

  constructor(private http: HttpClient) {}


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
