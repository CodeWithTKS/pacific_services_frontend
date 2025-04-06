import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MoneyTransferService } from '../../../services/moneyTransfer.service';

@Component({
  selector: 'app-transaction-add',
  standalone: true,
  imports: [MatButtonModule, CommonModule, ReactiveFormsModule,
    FormsModule, MatFormFieldModule, MatInputModule, MatSnackBarModule
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
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.moneyData = data
  }

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      TransactionNo: ['', Validators.required],
    })
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      if (this.moneyData.TransactionNo === null) {
        const formData = this.transactionForm.value;
        this.moneyTransferService.UpdateMoneyTransferNo(this.moneyData.TransferID, formData).subscribe({
          next: (response) => {
            this.onCancel();
            this.openSnackBar('Updated successfully!', 'Close');
          },
          error: (error) => {
            console.error('Error updating money-transfer', error);
            // Show error message using MatSnackBar
            this.snackBar.open('Insufficient balance in the portal', 'Close', {
              duration: 3000, // Duration in ms
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar will auto-dismiss after 3 seconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'bottom' // Show on top
    });
  }
}
