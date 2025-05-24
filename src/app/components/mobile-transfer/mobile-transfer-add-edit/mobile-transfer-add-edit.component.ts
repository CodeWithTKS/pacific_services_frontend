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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MobileTransferService } from '../../../services/mobileTransfer.service';
import { portalService } from '../../../services/portal.service';
import { userService } from '../../../services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mobile-transfer-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatSelectModule, MatFormFieldModule, MatInputModule, MatIconModule,
    MatCheckboxModule, MatSnackBarModule,
    MatButtonModule, RouterModule, MatCardModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mobile-transfer-add-edit.component.html',
  styleUrl: './mobile-transfer-add-edit.component.css'
})
export class MobileTransferAddEditComponent implements OnInit {
  transactionForm!: FormGroup;
  isEditMode: boolean = false; // Default to 'false' for adding a portal
  portalList: any[] = [];
  VendorList: any[] = [];
  mobileData: any;
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
    private MobileTransferService: MobileTransferService,
    private router: Router, private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit(): void {
    // If editing an existing portal, set isEditMode to true and load the data
    this.mobileData = history.state.mobileData;
    if (this.mobileData?.TransferID) {
      this.isEditMode = true;
      this.populateForm(this.mobileData);
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
      TransferType: ['', Validators.required], // Google Pay, PhonePe, Paytm, etc.
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
      Extra: ['0', Validators.required],
      HighlightEntry: [false],
      self: [false],
      selfPortalId: ['']
    });
  }

  populateForm(mobile: any): void {
    this.transactionForm.patchValue({
      TransactionNo: mobile.TransactionNo,
      portalId: mobile.portalId,
      FirstName: mobile.FirstName,
      LastName: mobile.LastName,
      TransactionDate: mobile.TransactionDate,
      ContactNo: mobile.ContactNo,
      TransferType: mobile.TransferType,
      TransactionType: mobile.TransactionType,
      TransactionCategory: mobile.TransactionCategory,
      Cash500: mobile.Cash500,
      Cash100: mobile.Cash100,
      Cash50: mobile.Cash50,
      Cash20: mobile.Cash20,
      Cash10: mobile.Cash10,
      Cash5: mobile.Cash5,
      Cash1: mobile.Cash1,
      TotalCash: mobile.TotalCash,
      CollectionAmt: mobile.CollectionAmt,
      Extra: mobile.Extra,
      HighlightEntry: mobile.HighlightEntry,
      self: mobile.self,
      selfPortalId: mobile.selfPortalId,
    });
    this.updateTotalCash();
  }

  GetPortals() {
    this.portalService.GetPortals().subscribe({
      next: (res: any) => {
        this.portalList = res;
        if (this.mobileData?.TransferID) {
          this.transactionForm.patchValue({
            portalId: parseInt(this.mobileData?.portalId) || '',
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
      const formData = this.transactionForm.value;
      if (this.mobileData && this.mobileData.TransferID) {
        // Update an existing mobile-transfer
        this.MobileTransferService.UpdatemobileTransfer(this.mobileData.TransferID, formData).subscribe({
          next: (response) => {
            this.router.navigate(['/admin/mobile-transfer']); // Navigate back to the mobile-transfer list
            this.openSnackBar('Updated successfully!', 'Close');
          },
          error: (error) => {
            this.openSnackBar(`${error}`, 'Close');
            console.error('Error updating mobile-transfer', error);
          }
        });
      } else {
        // Add a new mobile-transfer
        this.MobileTransferService.AddmobileTransfer(formData).subscribe({
          next: (response) => {
            this.router.navigate(['/admin/mobile-transfer']); // Navigate back to the mobile-transfer list
            this.openSnackBar('Added successfully!', 'Close');
          },
          error: (error) => {
            this.openSnackBar(`${error}`, 'Close');
            console.error('Error adding mobile-transfer', error);
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
