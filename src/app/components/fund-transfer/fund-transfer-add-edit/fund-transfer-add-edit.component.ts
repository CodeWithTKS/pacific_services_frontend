import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { fundTransferService } from '../../../services/fundTransfer.service';
import { portalService } from '../../../services/portal.service';
import { userService } from '../../../services/user.service';
import moment from 'moment';

@Component({
  selector: 'app-fund-transfer-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatSelectModule, MatFormFieldModule, MatInputModule, MatIconModule,
    MatCheckboxModule, MatSnackBarModule,
    MatButtonModule, RouterModule, MatCardModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fund-transfer-add-edit.component.html',
  styleUrl: './fund-transfer-add-edit.component.css'
})
export class FundTransferAddEditComponent implements OnInit {
  transactionForm!: FormGroup;
  isEditMode: boolean = false; // Default to 'false' for adding a portal
  portalList: any[] = [];
  VendorList: any[] = [];
  fundData: any;
  cashDenominations = [
    { name: 'Cash500', label: '₹500', placeholder: 'Enter number of notes', multiplier: 500 },
    { name: 'Cash100', label: '₹100', placeholder: 'Enter number of notes', multiplier: 100 },
    { name: 'Cash50', label: '₹50', placeholder: 'Enter number of notes', multiplier: 50 },
    { name: 'Cash20', label: '₹20', placeholder: 'Enter number of notes', multiplier: 20 },
    { name: 'Cash10', label: '₹10', placeholder: 'Enter number of notes', multiplier: 10 },
    { name: 'Cash5', label: '₹5', placeholder: 'Enter number of notes', multiplier: 5 },
    { name: 'Cash1', label: '₹1', placeholder: 'Enter number of notes', multiplier: 1 }
  ];
  denominationTotals: { [key: string]: number } = {};

  constructor(private fb: FormBuilder,
    private portalService: portalService,
    private userService: userService,
    private snackBar: MatSnackBar,
    private fundtransferService: fundTransferService,
    private router: Router, private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit(): void {
    // If editing an existing portal, set isEditMode to true and load the data
    this.fundData = history.state.fundData;
    if (this.fundData?.TransferID) {
      this.isEditMode = true;
      this.populateForm(this.fundData);
    }
    this.GetPortals();
    this.GetVendor();
    // Subscribe to valueChanges for cash denomination fields
    this.transactionForm.valueChanges.subscribe(() => {
      this.updateTotalCash();
    });
  }

  createForm(): void {
    this.transactionForm = this.fb.group({
      TransactionNo: [''],
      portalId: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: [''],
      TransactionDate: [new Date(), Validators.required],
      ContactNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      IFSCNo: ['', Validators.required],
      customerUID: ['', Validators.required],
      beneficiaryUID: ['', Validators.required],
      TransactionType: ['', Validators.required], // Mono QR, UPI, etc.
      TransactionCategory: ['', Validators.required], // Credit or Debit
      Cash500: ['', [Validators.pattern(/^\d+$/)]],
      Cash100: ['', [Validators.pattern(/^\d+$/)]],
      Cash50: ['', [Validators.pattern(/^\d+$/)]],
      Cash20: ['', [Validators.pattern(/^\d+$/)]],
      Cash10: ['', [Validators.pattern(/^\d+$/)]],
      Cash5: ['', [Validators.pattern(/^\d+$/)]],
      Cash1: ['', [Validators.pattern(/^\d+$/)]],
      TotalCash: [{ value: '0' }], // Calculated field
      CollectionAmt: ['', Validators.required],
      Discount: [0, [Validators.min(0), Validators.pattern(/^\d+$/)]], // Added discount field
      Extra: ['', Validators.required],
      HighlightEntry: [false]
    });
  }

  populateForm(fund: any): void {
    this.transactionForm.patchValue({
      TransactionNo: fund.TransactionNo,
      portalId: fund.portalId,
      FirstName: fund.FirstName,
      LastName: fund.LastName,
      TransactionDate: fund.TransactionDate,
      ContactNo: fund.ContactNo,
      IFSCNo: fund.IFSCNo,
      customerUID: fund.customerUID,
      beneficiaryUID: fund.beneficiaryUID,
      TransactionType: fund.TransactionType,
      TransactionCategory: fund.TransactionCategory,
      Cash500: fund.Cash500,
      Cash100: fund.Cash100,
      Cash50: fund.Cash50,
      Cash20: fund.Cash20,
      Cash10: fund.Cash10,
      Cash5: fund.Cash5,
      Cash1: fund.Cash1,
      TotalCash: fund.TotalCash,
      CollectionAmt: fund.CollectionAmt,
      Extra: fund.Extra,
      HighlightEntry: fund.HighlightEntry,
    });
    this.updateTotalCash();
  }

  GetPortals() {
    this.portalService.GetPortals().subscribe({
      next: (res: any) => {
        this.portalList = res;
        if (this.fundData?.TransferID) {
          this.transactionForm.patchValue({
            portalId: parseInt(this.fundData?.portalId) || '',
          })
        }
      }
    });
  }

  GetVendor() {
    this.userService.Getuser().subscribe({
      next: (res: any) => {
        this.VendorList = res;
      }
    })
  }

  updateDenominationTotal(field: string, multiplier: number): void {
    const value = this.transactionForm.get(field)?.value || 0; // Get current value or 0
    this.denominationTotals[field] = value * multiplier; // Calculate the denomination total
    this.updateTotalCash(); // Recalculate the total cash
  }

  // Method to calculate and update TotalCash
  updateTotalCash(): void {
    const cashFields = [
      { field: 'Cash500', multiplier: 500 },
      { field: 'Cash100', multiplier: 100 },
      { field: 'Cash50', multiplier: 50 },
      { field: 'Cash20', multiplier: 20 },
      { field: 'Cash10', multiplier: 10 },
      { field: 'Cash5', multiplier: 5 },
      { field: 'Cash1', multiplier: 1 }
    ];

    let totalCash = 0;

    // Calculate the total cash based on the fields and their multipliers
    cashFields.forEach(cash => {
      const value = this.transactionForm.get(cash.field)?.value || 0;
      totalCash += value * cash.multiplier;
    });

    const totalCashControl = this.transactionForm.get('TotalCash');
    const collectionAmtControl = this.transactionForm.get('CollectionAmt');

    // Update TotalCash and CollectionAmt
    totalCashControl?.setValue(totalCash, { emitEvent: false });
    collectionAmtControl?.setValue(totalCash, { emitEvent: false });
  }

  updateExtra() {
    const discountValue = this.transactionForm.get('Discount')?.value || 0;
    const extraControl = this.transactionForm.get('Extra');
    const extraValue = extraControl?.value || 0;

    if (!isNaN(discountValue) && extraControl) {
      extraControl.setValue(Math.max(extraValue - discountValue, 0), { emitEvent: false });
    }
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formData = {
        ...this.transactionForm.value,
        TransactionDate: moment(this.transactionForm.value.TransactionDate).format('YYYY-MM-DD HH:mm:ss')
      };
      if (this.fundData && this.fundData.TransferID) {
        // Update an existing fund-transfer
        this.fundtransferService.UpdatefundTransfer(this.fundData.TransferID, formData).subscribe({
          next: (response) => {
            this.router.navigate(['/admin/fund-transfer']); // Navigate back to the fund-transfer list
            this.openSnackBar('Updated successfully!', 'Close');
          },
          error: (error) => {
            console.error('Error updating fund-transfer', error);
            this.openSnackBar(`${error}`, 'Close');
          }
        });
      } else {
        // Add a new fund-transfer
        this.fundtransferService.AddfundTransfer(formData).subscribe({
          next: (response) => {
            this.router.navigate(['/admin/fund-transfer']); // Navigate back to the fund-transfer list
            this.openSnackBar('Added successfully!', 'Close');
          },
          error: (error) => {
            console.error('Error adding fund-transfer', error);
            this.openSnackBar(`${error}`, 'Close');
          }
        });
      }
    } else {

    }
  }

  get formControls() {
    return this.transactionForm.controls;
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar will auto-dismiss after 3 seconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'bottom' // Show on top
    });
  }
}
