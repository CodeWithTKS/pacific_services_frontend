import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { portalService } from '../../../services/portal.service';
import { MatSelectModule } from '@angular/material/select';
import { cashBackService } from '../../../services/cashBack.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cashback-add-edit',
  standalone: true,
  imports: [MatButtonModule, CommonModule, ReactiveFormsModule,
    FormsModule, MatFormFieldModule, MatInputModule, MatSnackBarModule,
    MatSelectModule],
  templateUrl: './cashback-add-edit.component.html',
  styleUrl: './cashback-add-edit.component.css'
})
export class CashbackAddEditComponent implements OnInit {
  transactionForm!: FormGroup;
  portalData: any;
  paymentTypes: string[] = ['Cash', 'Online'];
  portalList: any[] = [];

  constructor(private fb: FormBuilder,
    private portalService: portalService,
    private cashBackService: cashBackService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CashbackAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.portalData = data
  }

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      balance: ['', Validators.required],
      portalId: ['', Validators.required],
      type: ['', Validators.required],
      remark: ['', Validators.required],
    });
    this.GetPortals();

  }

  GetPortals() {
    this.portalService.GetPortals().subscribe({
      next: (res: any) => {
        this.portalList = res;
      }
    })
  }

  onConfirm(): void {
    const obj = {
      ...this.transactionForm.value
    }
    // Get the updated balance from the form
    this.cashBackService.Addcashback(obj).subscribe({
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
