import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { portalService } from '../../../services/portal.service';

@Component({
  selector: 'app-portal-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatFormFieldModule, MatDatepickerModule,
    MatInputModule, MatButtonModule, RouterModule],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './portal-add-edit.component.html',
  styleUrl: './portal-add-edit.component.css'
})
export class PortalAddEditComponent implements OnInit {
  myForm!: FormGroup;
  isEditMode: boolean = false; // Default to 'false' for adding a portal
  portalData: any;

  constructor(private fb: FormBuilder,
    private portalService: portalService,
    private router: Router, private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit(): void {
    // If editing an existing portal, set isEditMode to true and load the data
    this.portalData = history.state.portalData;
    if (this.portalData?.PortalID) {
      this.isEditMode = true
      this.populateForm(this.portalData);
    }
  }

  // Creating the form group with validations
  createForm(): void {
    this.myForm = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      contactNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Contact no must be 10 digits
      contactPerson: ['', [Validators.required]],
      email: [''],
      fax: [''],
      acNo: [''],
      balance: [''],
      transactionLimit: [''],
      serviceTax: [''],
      tdsRate: [''],
      openingBalanceDate: ['', [Validators.required]]
    });
  }

  populateForm(portal: any): void {
    this.myForm.patchValue({
      name: portal.Name || '',
      code: portal.Code || '',
      contactNo: portal.ContactNo || '',
      contactPerson: portal.ContactPerson || '',
      email: portal.Email || '',
      fax: portal.Fax || '',
      acNo: portal.ACNo || '',
      balance: portal.Balance || '',
      transactionLimit: portal.TransactionLimit || '',
      serviceTax: portal.ServiceTax || '',
      tdsRate: portal.TDSRate || '',
      openingBalanceDate: portal.OpeningBalanceDate
        ? new Date(portal.OpeningBalanceDate)
        : ''
    });
  }
  // Submit function
  onSubmit(): void {
    if (this.myForm.valid) {
      const formData = this.myForm.value;

      if (this.portalData && this.portalData.PortalID) {
        // Update an existing portal
        this.portalService.UpdatePortal(this.portalData.PortalID, formData).subscribe({
          next: (response) => {
            console.log('Portal updated successfully', response);
            this.router.navigate(['/admin/portal']); // Navigate back to the portal list
          },
          error: (error) => {
            console.error('Error updating portal', error);
          }
        });
      } else {
        // Add a new portal
        this.portalService.AddPortal(formData).subscribe({
          next: (response) => {
            console.log('Portal added successfully', response);
            this.router.navigate(['/admin/portal']); // Navigate back to the portal list
          },
          error: (error) => {
            console.error('Error adding portal', error);
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