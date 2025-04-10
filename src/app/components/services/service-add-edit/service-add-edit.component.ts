import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { portalService } from '../../../services/portal.service';
import { serviceService } from '../../../services/service.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-service-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatFormFieldModule, MatSelectModule, MatSnackBarModule,
    MatInputModule, MatButtonModule, RouterModule],
  templateUrl: './service-add-edit.component.html',
  styleUrl: './service-add-edit.component.css'
})
export class ServiceAddEditComponent implements OnInit {
  myForm!: FormGroup;
  isEditMode: boolean = false; // Default to 'false' for adding a Service
  Data: any;
  PortalList: any[] = [];

  constructor(private fb: FormBuilder,
    private portalService: portalService,
    private serviceService: serviceService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ServiceAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createForm();
  }

  ngOnInit(): void {
    this.GetPortals();
    // If editing an existing Service, set isEditMode to true and load the data
    this.Data = this.data;
    if (this.Data?.id) {
      this.isEditMode = true
      this.populateForm(this.Data);
    }
  }

  GetPortals() {
    this.portalService.GetPortals().subscribe({
      next: (res: any) => {
        this.PortalList = res;
      }
    })
  }
  // Creating the form group with validations
  createForm(): void {
    this.myForm = this.fb.group({
      portalId: ['0'],
      service_name: ['', [Validators.required]],
      purchase_price: ['', [Validators.required]],
    });
  }

  populateForm(data: any): void {
    this.myForm.patchValue({
      portalId: data.portalId || '',
      service_name: data.service_name || '',
      purchase_price: data.purchase_price || '',
    });
  }
  // Submit function
  onSubmit(): void {
    if (this.myForm.valid) {
      const obj = {
        ...this.myForm.value
      }

      if (this.Data && this.Data.id) {
        // Update an existing Service
        this.serviceService.Updateservices(this.Data.id, obj).subscribe({
          next: (response) => {
            this.openSnackBar('Updated successfully!', 'Close');
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.openSnackBar(`${error}`, 'Close');
            console.error('Error updating Service', error);
          }
        });
      } else {
        // Add a new Service
        this.serviceService.Addservices(obj).subscribe({
          next: (response) => {
            this.openSnackBar('Added successfully!', 'Close');
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.openSnackBar(`${error}`, 'Close');
            console.error('Error adding Service', error);
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