import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommissionService } from '../../../services/commission.service';
import { portalService } from '../../../services/portal.service';

@Component({
  selector: 'app-commission-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatSelectModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule],
  templateUrl: './commission-add-edit.component.html',
  styleUrl: './commission-add-edit.component.css'
})
export class CommissionAddEditComponent implements OnInit {
  myForm!: FormGroup;
  isEditMode: boolean = false; // Default to 'false' for adding a portal
  commissionData: any;
  portalList: any[] = [];

  constructor(private fb: FormBuilder,
    private commissionService: CommissionService,
    private portalService: portalService,
    private router: Router, private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit(): void {
    // If editing an existing portal, set isEditMode to true and load the data
    this.commissionData = history.state.commissionData;
    if (this.commissionData?.CommissionID) {
      console.log(this.commissionData);
      this.isEditMode = true;
      this.populateForm(this.commissionData);
    }
    this.GetPortals();
  }

  // Creating the form group with validations
  createForm(): void {
    this.myForm = this.fb.group({
      portalId: ['', [Validators.required]],
      FromAmount: ['', [Validators.required]],
      ToAmount: ['', [Validators.required]],
      BankType: ['', [Validators.required]],
      Amount: ['', [Validators.required]],
      Percentage: ['', [Validators.required]],
      PacificType: ['', [Validators.required]],
      PacificFixedAmount: [''],
      PacificAmount: [''],
      PacificExtraAmount: [''],
      CommissionType: ['', [Validators.required]],
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
      PacificType: commission.PacificType || '0',
      PacificFixedAmount: commission.PacificFixedAmount || '0',
      PacificAmount: commission.PacificAmount || '0',
      PacificExtraAmount: commission.PacificExtraAmount || '0',
      CommissionType: commission.CommissionType || '',
    });
  }

  GetPortals() {
    this.portalService.GetPortals().subscribe({
      next: (res: any) => {
        console.log('Response Data:', res);
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

  // Submit function
  onSubmit(): void {
    if (this.myForm.valid) {
      const formData = this.myForm.value;

      if (this.commissionData && this.commissionData.CommissionID) {
        // Update an existing commission
        this.commissionService.UpdateCommission(this.commissionData.CommissionID, formData).subscribe({
          next: (response) => {
            console.log('commission updated successfully', response);
            this.router.navigate(['/admin/commission']); // Navigate back to the commission list
          },
          error: (error) => {
            console.error('Error updating commission', error);
          }
        });
      } else {
        // Add a new commission
        this.commissionService.AddCommission(formData).subscribe({
          next: (response) => {
            console.log('commission added successfully', response);
            this.router.navigate(['/admin/commission']); // Navigate back to the commission list
          },
          error: (error) => {
            console.error('Error adding commission', error);
          }
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }

  // Getter for easy access to form controls in the template
  get formControls() {
    return this.myForm.controls;
  }
}
