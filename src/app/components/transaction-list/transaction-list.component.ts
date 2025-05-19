import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  createdAt: string; // ISO string
  description?: string;
  fromAccount?: string;
  toAccount?: string;
}

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  standalone: true, // Adicione se não estiver
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Adicione ReactiveFormsModule aqui
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  filterForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(private transactionService: TransactionService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    this.loading = true;
    this.errorMessage = null;

    this.transactionService.getAllTransactions().subscribe({
      next: (txs: Transaction[]) => {
        this.transactions = txs;
        this.applyFilter();
        this.loading = false;
      },
      error: (err: { error: { message: string; }; }) => {
        this.errorMessage = err.error?.message || 'Erro ao carregar transações.';
        this.loading = false;
      }
    });
  }

  applyFilter() {
    const { startDate, endDate } = this.filterForm.value;

    this.filteredTransactions = this.transactions.filter(tx => {
      const txDate = new Date(tx.createdAt);

      if (startDate) {
        const start = new Date(startDate);
        if (txDate < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        // inclui o dia todo até 23:59:59 para o filtro
        end.setHours(23,59,59,999);
        if (txDate > end) return false;
      }

      return true;
    });
  }

  onFilterSubmit() {
    this.applyFilter();
  }

  clearFilter() {
    this.filterForm.reset();
    this.applyFilter();
  }
}
