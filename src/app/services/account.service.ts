import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  createdAt: string;
  description?: string;
  fromAccount?: string;
  toAccount?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

private baseUrl = 'http://localhost:3000/account'; // Ajuste para sua API

  constructor(private http: HttpClient) {}

  deposit(amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/deposit`, { amount });
  }

  withdraw(amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/withdraw`, { amount });
  }

  transfer(targetAgency: string, targetAccountNumber: string, amount: number): Observable<any> {
  return this.http.post(`${this.baseUrl}/transfer`, { targetAgency, targetAccountNumber, amount });
}

  getTransactions(startDate?: string, endDate?: string): Observable<Transaction[]> {
    let params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return this.http.get<Transaction[]>(this.baseUrl, { params });
  }

  getAccount(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`);
  }

}
