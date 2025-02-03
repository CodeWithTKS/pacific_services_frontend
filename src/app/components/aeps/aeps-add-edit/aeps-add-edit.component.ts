import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AepsService } from '../../../services/aeps.service';
import { CommissionService } from '../../../services/commission.service';
import { portalService } from '../../../services/portal.service';

@Component({
  selector: 'app-aeps-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatSelectModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, RouterModule, MatCardModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './aeps-add-edit.component.html',
  styleUrl: './aeps-add-edit.component.css'
})
export class AepsAddEditComponent implements OnInit {
  transactionForm!: FormGroup;
  isEditMode: boolean = false; // Default to 'false' for adding a portal
  portalList: any[] = [];
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
  transactionTypeList = [
    { value: 'aeps_withdrawal', label: 'AEPS Withdrawal' },
    { value: 'aeps_deposit', label: 'AEPS Deposit' },
    { value: 'account_opening', label: 'A/C Opening' },
    { value: 'other', label: 'Other' }
  ];
  isOtherSelected = false;
  otherTypeList = [
    { value: 'debit', label: 'Debit' },
    { value: 'credit', label: 'Credit' }
  ];

  constructor(private fb: FormBuilder,
    private portalService: portalService,
    private AepsService: AepsService,
    private commissionService: CommissionService,
    private router: Router, private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit(): void {
    // If editing an existing portal, set isEditMode to true and load the data
    this.moneyData = history.state.moneyData;
    if (this.moneyData?.TransferID) {
      console.log(this.moneyData);
      this.isEditMode = true;
      this.populateForm(this.moneyData);
    }
    this.GetPortals();
    this.GetCommissions();
    // Subscribe to valueChanges for cash denomination fields
    this.transactionForm.valueChanges.subscribe(() => {
      this.updateTotalCash();
    });
  }

  createForm(): void {
    this.transactionForm = this.fb.group({
      portalId: ['', Validators.required],
      ACNo: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      ContactNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      IFSCNo: ['', Validators.required],
      TransactionDate: [''],
      Cash1: ['', [Validators.pattern(/^\d+$/)]],
      Cash500: ['', [Validators.pattern(/^\d+$/)]],
      Cash100: ['', [Validators.pattern(/^\d+$/)]],
      Cash50: ['', [Validators.pattern(/^\d+$/)]],
      Cash20: ['', [Validators.pattern(/^\d+$/)]],
      Cash10: ['', [Validators.pattern(/^\d+$/)]],
      Cash5: ['', [Validators.pattern(/^\d+$/)]],
      TotalCash: [{ value: '0' }], // Calculated field
      CollectionAmt: ['', Validators.required],
      Extra: ['', Validators.required],
      CustDeposit: ['', Validators.required],
      TransactionType: ['', Validators.required],
      OtherType: [''],
      OtherName: [''],
    });
  }

  populateForm(money: any): void {
    this.transactionForm.patchValue({
      portalId: money.portalId,
      ACNo: money.ACNo,
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
      Extra: money.Extra,
      CustDeposit: money.CustDeposit,
      TransactionType: money.TransactionType,
      OtherType: money.OtherType,
      OtherName: money.OtherName,
    });
    this.GetCommissions();
    this.updateTotalCash();
  }

  GetPortals() {
    this.portalService.GetPortals().subscribe({
      next: (res: any) => {
        console.log('Response Data:', res);
        this.portalList = res;
        if (this.moneyData?.TransferID) {
          this.transactionForm.patchValue({
            portalId: parseInt(this.moneyData?.portalId) || '',
          })
        }
      },
      error: (err: any) => {
        console.error('Error fetching portals:', err);
      },
    });
  }

  GetCommissions() {
    this.commissionService.GetCommissions().subscribe({
      next: (res: any) => {
        console.log('Response Data:', res);
        this.commissionList = res;
      }
    })
  }

  updateDenominationTotal(field: string, multiplier: number): void {
    const value = this.transactionForm.get(field)?.value || 0; // Get current value or 0
    this.denominationTotals[field] = value * multiplier; // Calculate the denomination total
    this.updateTotalCash(); // Recalculate the total cash
  }

  onTransactionTypeChange(selectedValue: string) {
    this.isOtherSelected = selectedValue === 'other';

    if (this.isOtherSelected) {
      // Add required validators when "Other" is selected
      this.transactionForm.get('OtherType')?.setValidators(Validators.required);
      this.transactionForm.get('OtherName')?.setValidators(Validators.required);
    } else {
      // Remove validators when "Other" is not selected
      this.transactionForm.get('OtherType')?.clearValidators();
      this.transactionForm.get('OtherName')?.clearValidators();
    }

    // Update form validation
    this.transactionForm.get('OtherType')?.updateValueAndValidity();
    this.transactionForm.get('OtherName')?.updateValueAndValidity();
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

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formData = this.transactionForm.value;
      if (this.moneyData && this.moneyData.TransferID) {
        // Update an existing money-transfer
        this.AepsService.UpdateMoneyTransfer(this.moneyData.TransferID, formData).subscribe({
          next: (response) => {
            console.log('money-transfer updated successfully', response);
            this.router.navigate(['/admin/aeps']); // Navigate back to the money-transfer list
          },
          error: (error) => {
            console.error('Error updating money-transfer', error);
          }
        });
      } else {
        // Add a new money-transfer
        this.AepsService.AddMoneyTransfer(formData).subscribe({
          next: (response) => {
            console.log('money-transfer added successfully', response);
            this.router.navigate(['/admin/aeps']); // Navigate back to the money-transfer list
          },
          error: (error) => {
            console.error('Error adding money-transfer', error);
          }
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }

  get formControls() {
    return this.transactionForm.controls;
  }
}
