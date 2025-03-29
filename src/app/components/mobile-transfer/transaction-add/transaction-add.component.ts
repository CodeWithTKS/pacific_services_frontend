import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MobileTransferService } from '../../../services/mobileTransfer.service';

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
    private MobileTransferService: MobileTransferService,
    public dialogRef: MatDialogRef<TransactionAddComponent>,
    private snackBar: MatSnackBar,
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
      if (this.moneyData.TransactionNo === '') {
        const formData = this.transactionForm.value;
        this.MobileTransferService.UpdatemobileTransferNo(this.moneyData.TransferID, formData).subscribe({
          next: (response) => {
            console.log('money-transfer updated successfully', response);
            this.onCancel();
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
}
