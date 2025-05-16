import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfileUpdate {
  fullName?: string;
  email?: string;
  birthDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile`);
  }
  private baseUrl = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) {}

  updateProfile(data: UserProfileUpdate, selectedFile: File | null): Observable<any> {
    return this.http.put(`${this.baseUrl}/profile`, data);
  }

  uploadPhoto(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('photo', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload-photo`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
}
