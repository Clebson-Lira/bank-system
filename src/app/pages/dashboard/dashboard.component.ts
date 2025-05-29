import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction, TransactionService } from '../../services/transaction.service';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';

interface Movement {
  id: number;
  type: 'Depósito' | 'Saque' | 'Transferência';
  amount: number;
  date: string;
  description?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true, // Adicione se não estiver
  imports: [CommonModule, RouterModule], // Adicione isto
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  account = {
    fullName: '',
    agency: '1234',
    accountNumber: '',
    balance: 0
  };

  recentMovements: Movement[] = [];

  constructor(private accountService: AccountService,  private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadAccountInfo();
    this.loadRecentMovements();
  }

    loadAccountInfo() {
      this.accountService.getAccount().subscribe({
        next: (accountData) => {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          this.account.fullName = user.fullName || '';
          this.account.accountNumber = accountData.accountNumber || '';
          this.account.agency = accountData.agency || '1234';
          this.account.balance = accountData.balance || 0;
        },
        error: () => {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          this.account.fullName = user.fullName || '';
          this.account.accountNumber = user.accountNumber || '';
          this.account.agency = user.agency || '1234';
          this.account.balance = user.balance || 0;
        }
      });
    }

  loadRecentMovements(startDate?: string, endDate?: string) {
  if (startDate && endDate) {
    this.transactionService.getTransactionsByPeriod(startDate, endDate).subscribe(transactions => {
      this.recentMovements = this.mapTransactions(transactions);
    });
  } else {
    this.transactionService.getAllTransactions().subscribe(transactions => {
      this.recentMovements = this.mapTransactions(transactions);
    });
  }
}

/**
 * Mapeia as transações para o formato esperado no frontend.
 */
private mapTransactions(transactions: Transaction[]): Movement[] {
  return transactions
    .slice() // cria uma cópia para não alterar o array original
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(transaction => ({
      id: Number(transaction.id),
      type: this.mapTransactionType(transaction.type),
      amount: transaction.amount,
      date: transaction.createdAt,
      description: transaction.description
    }));
}


  private mapTransactionType(type: string): 'Depósito' | 'Saque' | 'Transferência' {
    switch (type) {
      case 'deposit':
        return 'Depósito';
      case 'withdrawal':
        return 'Saque';
      case 'transfer':
        return 'Transferência';
      default:
        return 'Depósito'; // fallback or handle error as needed
    }
  }
}
