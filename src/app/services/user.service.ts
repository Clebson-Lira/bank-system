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
  private baseUrl = 'http://localhost:3000/profile';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  updateProfile(data: UserProfileUpdate, file?: File): Observable<any> {
    const formData = new FormData();
    if (data.fullName) formData.append('fullName', data.fullName);
    if (data.email) formData.append('email', data.email);
    if (data.birthDate) formData.append('birthDate', data.birthDate);
    if (file) formData.append('profilePicture', file);

    return this.http.put(`${this.baseUrl}/update`, formData);
  }

  uploadPhoto(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload-picture`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  updatePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-password`, { currentPassword, newPassword });
  }
}
