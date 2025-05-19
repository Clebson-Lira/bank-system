import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
export class TransactionService {
  private baseUrl = 'http://localhost:3000/transactions';

  constructor(private http: HttpClient) {}

  /**
   * Obtém todas as transações
   */
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.baseUrl);
  }

  /**
   * Obtém transações por período
   * Envia os dados como body JSON
   */
  getTransactionsByPeriod(startDate: string, endDate: string): Observable<Transaction[]> {
    const payload = { startDate, endDate };
    return this.http.post<Transaction[]>(`${this.baseUrl}/period`, payload);
  }
}
