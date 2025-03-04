import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { userService } from '../../../services/user.service';

@Component({
  selector: 'app-update-vendor-balance',
  standalone: true,
  imports: [MatButtonModule, CommonModule, ReactiveFormsModule,
    FormsModule, MatFormFieldModule, MatInputModule,],
  templateUrl: './update-vendor-balance.component.html',
  styleUrl: './update-vendor-balance.component.css'
})
export class UpdateVendorBalanceComponent implements OnInit {
  transactionForm!: FormGroup;
  afterBalance: number = 0; // Variable to store calculated after balance
  portalData: any;

  constructor(private fb: FormBuilder,
    private userService: userService,
    public dialogRef: MatDialogRef<UpdateVendorBalanceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.portalData = data
  }

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      Balance: ['', Validators.required],
    });

    // Initialize the afterBalance with the before balance
    this.afterBalance = this.data?.main_balance;

    // Subscribe to the Balance form control changes
    this.transactionForm.get('Balance')?.valueChanges.subscribe(value => {
      if (value) {
        this.afterBalance = this.data?.main_balance + +value; // Calculate the after balance
      } else {
        this.afterBalance = this.data?.main_balance; // Reset to before balance if input is cleared
      }
    });
  }

  onConfirm(): void {
    const obj = {
      main_balance: this.afterBalance,
      virtual_balance: this.afterBalance,
    }
    // Get the updated balance from the form
    this.userService.updateBalance(this.portalData.id, obj).subscribe({
      next: (response) => {
        this.addVendorLog();
      },
      error: (error) => {
        console.error('Error updating portal', error);
      }
    });
  }

  addVendorLog() {
    const logs = {
      vendorId: this.portalData.id,
      beforeBalance: this.data?.main_balance,
      balance: this.transactionForm.value?.Balance,
      type: 'Add Balance',
      afterBalance: this.afterBalance,
      createdAt: new Date()
    }
    this.userService.addVendorLog(logs).subscribe({
      next: (response) => {
        console.log('Portal updated successfully', response);
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error updating portal', error);
      }
    });
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
