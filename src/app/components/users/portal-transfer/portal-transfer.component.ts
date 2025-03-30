import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { userService } from '../../../services/user.service';
import { portalService } from '../../../services/portal.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-portal-transfer',
  standalone: true,
  imports: [MatButtonModule, CommonModule, ReactiveFormsModule,
    FormsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule],
  templateUrl: './portal-transfer.component.html',
  styleUrl: './portal-transfer.component.css'
})
export class PortalTransferComponent implements OnInit {
  transferForm: FormGroup;
  vendors: any[] = [];
  portals: any[] = [];

  constructor(
    private fb: FormBuilder,
    private portalService: portalService,
    private userService: userService,
    public dialogRef: MatDialogRef<PortalTransferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    

    this.transferForm = this.fb.group({
      vendorId: [this.data.id, Validators.required],
      portalId: ['', Validators.required],
      transferAmount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.GetVendor();
    this.GetPortals();
  }

  GetPortals() {
    this.portalService.GetPortals().subscribe({
      next: (res: any) => {
       
        this.portals = res;
      }
    });
  }

  GetVendor() {
    this.userService.Getuser().subscribe({
      next: (res: any) => {
        this.vendors = res;
      }
    })
  }

  onConfirm(): void {
    if (this.transferForm.valid) {
      this.userService.transferBalance(this.transferForm.value).subscribe({
        next: (response) => {
          this.dialogRef.close(true);
          this.addVendorLog();
        },
        error: (error) => {
          console.error('Error updating portal', error);
        }
      })
    }
  }

  onCancel(): void {
    this.transferForm.reset();
  }

  addVendorLog() {
    const afterBalance = +this.data?.virtual_balance - +this.transferForm.value?.transferAmount
    const logs = {
      vendorId: this.transferForm.value?.vendorId,
      beforeBalance: this.data?.virtual_balance,
      balance: this.transferForm.value?.transferAmount,
      type: 'Remove Virtual Balance',
      afterBalance: afterBalance,
      createdAt: new Date()
    }
    this.userService.addVendorLog(logs).subscribe({
      next: (response) => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error updating portal', error);
      }
    });
  }
}
