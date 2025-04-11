import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommissionService } from '../../../services/commission.service';
import { portalService } from '../../../services/portal.service';
import { userService } from '../../../services/user.service';

@Component({
  selector: 'app-commission-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatSelectModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, RouterModule, MatSnackBarModule],
  templateUrl: './commission-add-edit.component.html',
  styleUrl: './commission-add-edit.component.css'
})
export class CommissionAddEditComponent implements OnInit {
  myForm!: FormGroup;
  isEditMode: boolean = false; // Default to 'false' for adding a portal
  commissionData: any;
  portalList: any[] = [];
  commissionTypes: string[] = ['Fixed', 'Percentage'];
  CommissionFor: string[] = ['self', 'vendor'];
  selectedType: any
  VendorList: any

  constructor(private fb: FormBuilder,
    private commissionService: CommissionService,
    private portalService: portalService,
    private userService: userService,
    private snackBar: MatSnackBar,
    private router: Router, private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit(): void {
    // If editing an existing portal, set isEditMode to true and load the data
    this.commissionData = history.state.commissionData;
    if (this.commissionData?.CommissionID) {
      this.isEditMode = true;
      this.populateForm(this.commissionData);
    }
    this.GetPortals();
    this.GetVendor();
  }

  // Creating the form group with validations
  createForm(): void {
    this.myForm = this.fb.group({
      portalId: ['', [Validators.required]],
      FromAmount: ['', [Validators.required]],
      ToAmount: ['', [Validators.required]],
      BankType: ['no',],
      Amount: ['0'],
      Percentage: [''],
      PacificFixedAmount: [''],
      PacificAmount: [''],
      PacificExtraAmount: [''],
      CommissionType: ['', [Validators.required]],
      CommissionFor: ['', [Validators.required]],
      VendorID: [''],
    });
  }

  populateForm(commission: any): void {
    this.myForm.patchValue({
      portalId: commission.portalId || '',
      FromAmount: commission.FromAmount || '0',
      ToAmount: commission.ToAmount || '',
      BankType: commission.BankType || '',
      Amount: commission.Amount || '',
      Percentage: commission.Percentage || '0',
      PacificFixedAmount: commission.PacificFixedAmount || '0',
      PacificAmount: commission.PacificAmount || '0',
      PacificExtraAmount: commission.PacificExtraAmount || '0',
      CommissionType: commission.CommissionType || '',
      CommissionFor: commission.CommissionFor || '',
      VendorID: commission.VendorID || '',
    });
  }

  GetVendor() {
    this.userService.Getuser().subscribe({
      next: (res: any) => {
        this.VendorList = res;
      }
    })
  }
  GetPortals() {
    this.portalService.GetPortals().subscribe({
      next: (res: any) => {

        this.portalList = res;
        if (this.commissionData?.CommissionID) {
          this.myForm.patchValue({
            portalId: parseInt(this.commissionData?.portalId) || '',
          })
        }
      },
      error: (err: any) => {
        console.error('Error fetching portals:', err);
      },
    });
  }

  onCommissionTypeChange(selectedType: string): void {
    this.selectedType = selectedType
  }

  onPercentageKeyUp(event: KeyboardEvent): void {
    const inputValue = parseFloat((event.target as HTMLInputElement).value); // Convert to number
    if (this.selectedType === "Percentage") {
      const Amount = this.myForm.value?.Amount;
      if (Amount && !isNaN(inputValue)) { // Ensure both are valid numbers
        const PacificAmount = (Amount * inputValue) / 100;
        const PacificExtraAmount = Amount - PacificAmount;
        this.myForm.patchValue({
          PacificFixedAmount: Amount,
          PacificAmount: PacificAmount,
          PacificExtraAmount: PacificExtraAmount
        });
      } else {
        console.error('Invalid PacificFixedAmount or inputValue');
      }
    }
  }


  // Submit function
  onSubmit(): void {
    if (this.myForm.valid) {
      const formData = {
        ...this.myForm.value,
        VendorID: this.myForm.value?.CommissionFor === "self" ? '0' : this.myForm.value?.VendorID
      }

      if (this.commissionData && this.commissionData.CommissionID) {
        // Update an existing commission
        this.commissionService.UpdateCommission(this.commissionData.CommissionID, formData).subscribe({
          next: (response) => {
            this.router.navigate(['/admin/commission']); // Navigate back to the commission list
            this.openSnackBar('Updated successfully!', 'Close');
          },
          error: (error) => {
            this.openSnackBar(`${error}`, 'Close');
            console.error('Error updating commission', error);
          }
        });
      } else {
        // Add a new commission
        this.commissionService.AddCommission(formData).subscribe({
          next: (response) => {
            this.router.navigate(['/admin/commission']); // Navigate back to the commission list
            this.openSnackBar('Added successfully!', 'Close');
          },
          error: (error) => {
            this.openSnackBar(`${error}`, 'Close');
            console.error('Error adding commission', error);
          }
        });
      }
    } else {

    }
  }

  // Getter for easy access to form controls in the template
  get formControls() {
    return this.myForm.controls;
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar will auto-dismiss after 3 seconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'bottom' // Show on top
    });
  }
}
