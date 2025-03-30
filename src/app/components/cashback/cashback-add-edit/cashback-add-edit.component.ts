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

@Component({
  selector: 'app-cashback-add-edit',
  standalone: true,
  imports: [MatButtonModule, CommonModule, ReactiveFormsModule,
    FormsModule, MatFormFieldModule, MatInputModule,
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
