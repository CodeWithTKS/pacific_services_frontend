import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MoneyTransferService } from '../../../services/moneyTransfer.service';
import { portalService } from '../../../services/portal.service';

@Component({
  selector: 'app-money-add-edit',
  standalone: true,

  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatSelectModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, RouterModule, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './money-add-edit.component.html',
  styleUrl: './money-add-edit.component.css'
})
export class MoneyAddEditComponent implements OnInit {
  transactionForm!: FormGroup;
  isEditMode: boolean = false; // Default to 'false' for adding a portal
  portalList: any[] = [];
  moneyData: any;
  cashDenominations = [
    { label: 'Cash 500', name: 'Cash500', placeholder: 'Enter Cash 500 Amount' },
    { label: 'Cash 100', name: 'Cash100', placeholder: 'Enter Cash 100 Amount' },
    { label: 'Cash 50', name: 'Cash50', placeholder: 'Enter Cash 50 Amount' },
    { label: 'Cash 20', name: 'Cash20', placeholder: 'Enter Cash 20 Amount' },
    { label: 'Cash 10', name: 'Cash10', placeholder: 'Enter Cash 10 Amount' },
    { label: 'Cash 5', name: 'Cash5', placeholder: 'Enter Cash 5 Amount' },
    { label: 'Cash 1', name: 'Cash1', placeholder: 'Enter Cash 1 Amount' },
    { label: 'TotalCash', name: 'TotalCash', placeholder: 'Enter Total Cash' },
  ];

  constructor(private fb: FormBuilder,
    private portalService: portalService,
    private moneyTransferService: MoneyTransferService,
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
      TransactionType: ['', Validators.required],
      Type: ['', Validators.required],
      Cash1: ['', [Validators.pattern(/^\d+$/)]],
      Cash500: ['', [Validators.pattern(/^\d+$/)]],
      Cash100: ['', [Validators.pattern(/^\d+$/)]],
      Cash50: ['', [Validators.pattern(/^\d+$/)]],
      Cash20: ['', [Validators.pattern(/^\d+$/)]],
      Cash10: ['', [Validators.pattern(/^\d+$/)]],
      Cash5: ['', [Validators.pattern(/^\d+$/)]],
      TotalCash: [{ value: '' }], // Calculated field
      CollectionAmt: ['', Validators.required],
      SalasarFixedAmt: ['', Validators.required],
      BankCharge: ['', Validators.required],
      SalasarCharge: ['', Validators.required],
      SalasarExtra: ['', Validators.required],
      BankDeposit: ['', Validators.required],
      CustDeposit: ['', Validators.required]
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
      TransactionType: money.TransactionType,
      Type: money.Type,
      Cash1: money.Cash1,
      Cash500: money.Cash500,
      Cash100: money.Cash100,
      Cash50: money.Cash50,
      Cash20: money.Cash20,
      Cash10: money.Cash10,
      Cash5: money.Cash5,
      TotalCash: money.TotalCash,
      CollectionAmt: money.CollectionAmt,
      SalasarFixedAmt: money.SalasarFixedAmt,
      BankCharge: money.BankCharge,
      SalasarCharge: money.SalasarCharge,
      SalasarExtra: money.SalasarExtra,
      BankDeposit: money.BankDeposit,
      CustDeposit: money.CustDeposit,
    });
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

    // Sum up the values of cash fields, considering their multipliers
    cashFields.forEach(({ field, multiplier }) => {
      const value = parseInt(this.transactionForm.get(field)?.value || '0', 10);
      if (!isNaN(value)) {
        totalCash += value * multiplier;
      }
    });

    // Update the TotalCash field
    this.transactionForm.get('TotalCash')?.setValue(totalCash, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formData = this.transactionForm.value;
      if (this.moneyData && this.moneyData.TransferID) {
        // Update an existing money-transfer
        this.moneyTransferService.UpdateMoneyTransfer(this.moneyData.TransferID, formData).subscribe({
          next: (response) => {
            console.log('money-transfer updated successfully', response);
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
            console.log('money-transfer added successfully', response);
            this.router.navigate(['/admin/money-transfer']); // Navigate back to the money-transfer list
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
