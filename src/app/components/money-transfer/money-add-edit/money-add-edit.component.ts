import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommissionService } from '../../../services/commission.service';
import { MoneyTransferService } from '../../../services/moneyTransfer.service';
import { portalService } from '../../../services/portal.service';
import { userService } from '../../../services/user.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-money-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatSelectModule, MatFormFieldModule, MatInputModule, MatIconModule,
    MatCheckboxModule,
    MatButtonModule, RouterModule, MatCardModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './money-add-edit.component.html',
  styleUrl: './money-add-edit.component.css'
})
export class MoneyAddEditComponent implements OnInit {
  transactionForm!: FormGroup;
  isEditMode: boolean = false; // Default to 'false' for adding a portal
  portalList: any[] = [];
  VendorList: any[] = [];
  commissionList: any[] = [];
  moneyData: any;
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
  selectedPortalId: any;

  constructor(private fb: FormBuilder,
    private portalService: portalService,
    private userService: userService,
    private moneyTransferService: MoneyTransferService,
    private commissionService: CommissionService,
    private router: Router, private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit(): void {
    // If editing an existing portal, set isEditMode to true and load the data
    this.moneyData = history.state.moneyData;
    if (this.moneyData?.TransferID) {
      this.isEditMode = true;
      this.populateForm(this.moneyData);
    }
    this.GetPortals();
    this.GetVendor();
    this.GetCommissions();
    // Subscribe to valueChanges for cash denomination fields
    this.transactionForm.valueChanges.subscribe(() => {
      this.updateTotalCash();
    });
  }

  createForm(): void {
    this.transactionForm = this.fb.group({
      portalId: ['', Validators.required],
      VendorID: [''],
      ACNo: [''],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      ContactNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      IFSCNo: [''],
      TransactionDate: [new Date()],
      Cash1: ['', [Validators.pattern(/^\d+$/)]],
      Cash500: ['', [Validators.pattern(/^\d+$/)]],
      Cash100: ['', [Validators.pattern(/^\d+$/)]],
      Cash50: ['', [Validators.pattern(/^\d+$/)]],
      Cash20: ['', [Validators.pattern(/^\d+$/)]],
      Cash10: ['', [Validators.pattern(/^\d+$/)]],
      Cash5: ['', [Validators.pattern(/^\d+$/)]],
      TotalCash: [{ value: '0' }], // Calculated field
      self: [false],
      HighlightEntry: [false],
      comments: [''],
      CollectionAmt: ['', Validators.required],
      Discount: ['0'],
      FixedAmt: ['', Validators.required],
      BankCharge: ['', Validators.required],
      Extra: ['', Validators.required],
      BankDeposit: ['', Validators.required],
      CustDeposit: ['', Validators.required]
    });
  }

  populateForm(money: any): void {
    this.transactionForm.patchValue({
      portalId: money.portalId,
      VendorID: money.VendorID,
      ACNo: money.ACNo,
      self: money.self,
      HighlightEntry: money.HighlightEntry,
      comments: money.comments,
      FirstName: money.FirstName,
      LastName: money.LastName,
      ContactNo: money.ContactNo,
      IFSCNo: money.IFSCNo,
      TransactionDate: money.TransactionDate,
      Cash1: money.Cash1,
      Cash500: money.Cash500,
      Cash100: money.Cash100,
      Cash50: money.Cash50,
      Cash20: money.Cash20,
      Cash10: money.Cash10,
      Cash5: money.Cash5,
      TotalCash: money.TotalCash,
      CollectionAmt: money.CollectionAmt,
      Discount: money.Discount,
      FixedAmt: money.FixedAmt,
      BankCharge: money.BankCharge,
      Extra: money.Extra,
      BankDeposit: money.BankDeposit,
      CustDeposit: money.CustDeposit,
    });
    this.GetCommissions();
    this.updateTotalCash();
  }

  GetPortals() {
    this.portalService.GetPortals().subscribe({
      next: (res: any) => {
       
        this.portalList = res;
        if (this.moneyData?.TransferID) {
          this.transactionForm.patchValue({
            portalId: parseInt(this.moneyData?.portalId) || '',
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

  GetCommissions() {
    this.commissionService.GetCommissions().subscribe({
      next: (res: any) => {
       
        this.commissionList = res;
      }
    })
  }

  updateDenominationTotal(field: string, multiplier: number): void {
    const value = this.transactionForm.get(field)?.value || 0; // Get current value or 0
    this.denominationTotals[field] = value * multiplier; // Calculate the denomination total
    this.updateTotalCash(); // Recalculate the total cash
  }

  onPortalSelect(event: MatSelectChange): void {
    this.selectedPortalId = event.value;
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

    if (this.selectedPortalId && this.portalList?.length) {
      // Filter portalList by selectedPortalId
      const portal = this.portalList.filter(
        c => String(c.PortalID) === String(this.selectedPortalId) // Convert both to strings for comparison
      );

      // Ensure total cash does not exceed the limit
      const cashLimit = portal[0].TransactionLimit;
      if (totalCash > cashLimit) {
        totalCash = cashLimit;
        alert(`Total cash exceeds the limit of ${cashLimit}. It has been set to the maximum limit.`);
      }

      const totalCashControl = this.transactionForm.get('TotalCash');
      const collectionAmtControl = this.transactionForm.get('CollectionAmt');
      const FixedAmtControl = this.transactionForm.get('FixedAmt');
      const bankChargeControl = this.transactionForm.get('BankCharge');
      const ExtraControl = this.transactionForm.get('Extra');
      const bankDepositControl = this.transactionForm.get('BankDeposit');
      const custDepositControl = this.transactionForm.get('CustDeposit');

      // Update TotalCash and CollectionAmt
      totalCashControl?.setValue(totalCash, { emitEvent: false });
      collectionAmtControl?.setValue(totalCash, { emitEvent: false });

      // Determine FixedAmt based on CollectionAmt and commissionList
      const collectionAmt = totalCash; // Assuming CollectionAmt equals TotalCash
      if (this.selectedPortalId && this.commissionList?.length) {
        // Filter commissionList by selectedPortalId
        const portalCommissions = this.commissionList.filter(
          c => String(c.portalId) === String(this.selectedPortalId) // Convert both to strings for comparison
        );

        let vendorCommissions: any[] = [];
        let selfCommissions: any[] = [];
        let commission: any | undefined;

        const vendorID = +this.transactionForm.value?.VendorID;

        if (vendorID > 0) {
          // Vendor mode
          vendorCommissions = portalCommissions.filter(c => c.VendorID == vendorID);

          if (vendorCommissions.length) {
            commission = vendorCommissions.find(
              c => +collectionAmt >= +c.FromAmount && +collectionAmt <= +c.ToAmount
            );
          }
        } else {
          // Self mode
          selfCommissions = portalCommissions.filter(c => c.VendorID === 0);

          if (selfCommissions.length) {
            commission = selfCommissions.find(
              c => +collectionAmt >= +c.FromAmount && +collectionAmt <= +c.ToAmount
            );
          }
        }

        if (commission) {
          if (commission.VendorID === vendorID) {
            if (commission.VendorID > 0) {
              FixedAmtControl?.setValue(commission.PacificFixedAmount || 0, { emitEvent: false });
              bankChargeControl?.setValue(commission.PacificAmount || 0, { emitEvent: false });
              ExtraControl?.setValue(
                commission.Percentage ? (totalCash * commission.Percentage / 100) : commission.PacificExtraAmount,
                { emitEvent: false }
              );
              bankDepositControl?.setValue(totalCash, { emitEvent: false });
              custDepositControl?.setValue(totalCash, { emitEvent: false });
            } else {
              FixedAmtControl?.setValue(commission.PacificFixedAmount || 0, { emitEvent: false });
              bankChargeControl?.setValue(commission.PacificAmount || 0, { emitEvent: false });
              ExtraControl?.setValue(commission.PacificExtraAmount || 0, { emitEvent: false });
              bankDepositControl?.setValue(totalCash - (commission.PacificExtraAmount || 0), { emitEvent: false });
              custDepositControl?.setValue(totalCash - (commission.PacificFixedAmount || 0), { emitEvent: false });
            }
          }
        }
      }
    }
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
      if (this.moneyData && this.moneyData.TransferID) {
        // Update an existing money-transfer
        this.moneyTransferService.UpdateMoneyTransfer(this.moneyData.TransferID, formData).subscribe({
          next: (response) => {
            this.router.navigate(['/admin/money-transfer']); // Navigate back to the money-transfer list
          },
          error: (error) => {
            console.error('Error updating money-transfer', error);
          }
        });
      } else {
        // Add a new money-transfer
        this.moneyTransferService.AddMoneyTransfer(formData).subscribe({
          next: (response) => {
            this.router.navigate(['/admin/money-transfer']); // Navigate back to the money-transfer list
          },
          error: (error) => {
            console.error('Error adding money-transfer', error);
          }
        });
      }
    } else {
      
    }
  }

  get formControls() {
    return this.transactionForm.controls;
  }
}
