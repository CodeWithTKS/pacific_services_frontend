import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { portalService } from '../../../services/portal.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-balance',
  standalone: true,
  imports: [MatButtonModule, CommonModule, ReactiveFormsModule,
    MatSnackBarModule,
    FormsModule, MatFormFieldModule, MatInputModule,],
  templateUrl: './update-balance.component.html',
  styleUrl: './update-balance.component.css'
})
export class UpdateBalanceComponent implements OnInit {
  transactionForm!: FormGroup;
  afterBalance: number = 0; // Variable to store calculated after balance
  portalData: any;

  constructor(private fb: FormBuilder,
    private portalService: portalService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UpdateBalanceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.portalData = data
  }

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      Balance: ['', Validators.required],
    });

    // Initialize the afterBalance with the before balance
    this.afterBalance = this.data?.Balance;

    // Subscribe to the Balance form control changes
    this.transactionForm.get('Balance')?.valueChanges.subscribe(value => {
      if (value) {
        this.afterBalance = this.data?.Balance + +value; // Calculate the after balance
      } else {
        this.afterBalance = this.data?.Balance; // Reset to before balance if input is cleared
      }
    });
  }

  onConfirm(): void {
    const obj = {
      Balance: this.afterBalance
    }
    // Get the updated balance from the form
    this.portalService.updateBalancePortal(this.portalData.PortalID, obj).subscribe({
      next: (response) => {
        this.addSalaryLogs();
      },
      error: (error) => {
        console.error('Error updating portal', error);
      }
    });
  }

  addSalaryLogs() {
    const logs = {
      portalId: this.portalData.PortalID,
      beforeBalance: this.data?.Balance,
      balance: this.transactionForm.value?.Balance,
      transactionType: 'Update Balance',
      type: 'Add Balance',
      afterBalance: this.afterBalance,
      createdAt: new Date()
    }
    this.portalService.addPortalLog(logs).subscribe({
      next: (response) => {
        this.dialogRef.close(true);
        this.openSnackBar('Updated successfully!', 'Close');
      },
      error: (error) => {
        console.error('Error updating portal', error);
        this.openSnackBar(`${error}`, 'Close');
      }
    });
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
