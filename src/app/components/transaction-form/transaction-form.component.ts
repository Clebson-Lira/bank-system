import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  standalone: true, // Adicione se não estiver
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Adicione ReactiveFormsModule aqui
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {
  transactionType: 'deposit' | 'withdrawal' | 'transfer' = 'deposit';

  transactionForm: FormGroup;
  submitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private transactionService: TransactionService, private route: ActivatedRoute, private accountService: AccountService) {
    this.transactionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      destinationAgency: [''],
      destinationAccount: ['']
    });
  }

 ngOnInit(): void {
    // Ouça as mudanças do parâmetro da rota
    this.route.paramMap.subscribe(params => {
      const type = params.get('type');
      if (type === 'deposit' || type === 'withdrawal' || type === 'transfer') {
        this.transactionType = type;
      } else {
        this.transactionType = 'deposit';
      }

      // Atualize as validações conforme o tipo
      if (this.transactionType === 'transfer') {
        this.transactionForm.get('destinationAgency')?.setValidators([Validators.required, Validators.pattern(/^\d{4}$/)]);
        this.transactionForm.get('destinationAccount')?.setValidators([Validators.required, Validators.pattern(/^\d+$/)]);
      } else {
        this.transactionForm.get('destinationAgency')?.clearValidators();
        this.transactionForm.get('destinationAccount')?.clearValidators();
      }
      this.transactionForm.get('destinationAgency')?.updateValueAndValidity();
      this.transactionForm.get('destinationAccount')?.updateValueAndValidity();
    });
  }
  onSubmit() {
    if (this.transactionForm.invalid) return;

    this.submitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const amount = this.transactionForm.value.amount;

    switch(this.transactionType) {
      case 'deposit':
        this.accountService.deposit(amount).subscribe({
          next: () => {
            this.successMessage = 'Depósito realizado com sucesso!';
            this.transactionForm.reset();
            this.submitting = false;
          },
          error: (err: { error: { message: string; }; }) => {
            this.errorMessage = err.error?.message || 'Erro no depósito.';
            this.submitting = false;
          }
        });
        break;

      case 'withdrawal':
        this.accountService.withdraw(amount).subscribe({
          next: () => {
            this.successMessage = 'Saque realizado com sucesso!';
            this.transactionForm.reset();
            this.submitting = false;
          },
          error: (err: { error: { message: string; }; }) => {
            this.errorMessage = err.error?.message || 'Erro no saque.';
            this.submitting = false;
          }
        });
        break;

      case 'transfer':
      const targetAgency = this.transactionForm.value.destinationAgency;
      const targetAccountNumber = this.transactionForm.value.destinationAccount;
      this.accountService.transfer(targetAgency, targetAccountNumber, amount).subscribe({
        next: () => {
          this.successMessage = 'Transferência realizada com sucesso!';
          this.transactionForm.reset();
          this.submitting = false;
        },
        error: (err: { error: { message: string } }) => {
          this.errorMessage = err.error?.message || 'Erro na transferência.';
          this.submitting = false;
        }
      });
      break;

    }
  }
}
