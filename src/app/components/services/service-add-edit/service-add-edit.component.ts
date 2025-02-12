import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { serviceService } from '../../../services/service.service';

@Component({
  selector: 'app-service-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatFormFieldModule,
    MatInputModule, MatButtonModule, RouterModule],
  templateUrl: './service-add-edit.component.html',
  styleUrl: './service-add-edit.component.css'
})
export class ServiceAddEditComponent implements OnInit {
  myForm!: FormGroup;
  isEditMode: boolean = false; // Default to 'false' for adding a Service
  Data: any;

  constructor(private fb: FormBuilder,
    private serviceService: serviceService,
    public dialogRef: MatDialogRef<ServiceAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createForm();
  }

  ngOnInit(): void {
    // If editing an existing Service, set isEditMode to true and load the data
    this.Data = this.data;
    if (this.Data?.id) {
      this.isEditMode = true
      this.populateForm(this.Data);
    }
  }

  // Creating the form group with validations
  createForm(): void {
    this.myForm = this.fb.group({
      service_name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      commission_price: ['', [Validators.required]],
    });
  }

  populateForm(data: any): void {
    this.myForm.patchValue({
      service_name: data.service_name || '',
      price: data.price || '',
      commission_price: data.commission_price || '',
    });
  }
  // Submit function
  onSubmit(): void {
    if (this.myForm.valid) {
      const formData = this.myForm.value;

      if (this.Data && this.Data.id) {
        // Update an existing Service
        this.serviceService.Updateservices(this.Data.id, formData).subscribe({
          next: (response) => {
            console.log('Service updated successfully', response);
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating Service', error);
          }
        });
      } else {
        // Add a new Service
        this.serviceService.Addservices(formData).subscribe({
          next: (response) => {
            console.log('Service added successfully', response);
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error adding Service', error);
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