import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MoneyTransferService } from '../../../services/moneyTransfer.service';

@Component({
  selector: 'app-transaction-add',
  standalone: true,
  imports: [MatButtonModule, CommonModule, ReactiveFormsModule,
    FormsModule, MatFormFieldModule, MatInputModule,
  ],
  templateUrl: './transaction-add.component.html',
  styleUrl: './transaction-add.component.css'
})
export class TransactionAddComponent implements OnInit {
  transactionForm!: FormGroup;
  moneyData: any;

  constructor(
    private fb: FormBuilder,
    private moneyTransferService: MoneyTransferService,
    public dialogRef: MatDialogRef<TransactionAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
    this.moneyData = data
  }

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      TransactionNo: ['', Validators.required],
    })
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formData = this.transactionForm.value;
      this.moneyTransferService.UpdateMoneyTransferNo(this.moneyData.TransferID, formData).subscribe({
        next: (response) => {
          console.log('money-transfer updated successfully', response);
          this.onCancel();
        },
        error: (error) => {
          console.error('Error updating money-transfer', error);
        }
      });
    }
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
