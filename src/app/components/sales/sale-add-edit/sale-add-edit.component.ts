import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { serviceService } from '../../../services/service.service';
import { portalService } from '../../../services/portal.service';
import { userService } from '../../../services/user.service';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { salesService } from '../../../services/sales.service';

@Component({
  selector: 'app-sale-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    RouterModule, MatSelectModule, MatIconModule],
  templateUrl: './sale-add-edit.component.html',
  styleUrl: './sale-add-edit.component.css'
})
export class SaleAddEditComponent implements OnInit {
  myForm!: FormGroup;
  isEditMode: boolean = false; // Default to 'false' for adding a Service
  Data: any;
  ServiceList: any[] = [];
  PortalList: any[] = [];
  UserList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private serviceService: serviceService,
    private salesService: salesService,
    private portalService: portalService,
    private userService: userService,
    private router: Router) {
    this.createForm();
  }

  ngOnInit(): void {
    this.Getuser();
    this.GetPortals();
    this.Getservices();
  }

  createForm(): void {
    this.myForm = this.fb.group({
      user_id: ['', [Validators.required]],
      portalId: ['', [Validators.required]],
      services: this.fb.array([]), // FormArray for the table rows
      total_price: ['', [Validators.required]]
    })
  }

  Getuser() {
    this.userService.Getuser().subscribe({
      next: (res: any) => {
        console.log('Response Data:', res);
        this.UserList = res;
      }
    })
  }

  Getservices() {
    this.serviceService.Getservices().subscribe({
      next: (res: any) => {
        console.log('Response Data:', res);
        this.ServiceList = res;
      },
    });
  }

  GetPortals() {
    this.portalService.GetPortals().subscribe({
      next: (res: any) => {
        console.log('Response Data:', res);
        this.PortalList = res;
      }
    })
  }

  get FormArray(): FormArray {
    return this.myForm.get('services') as FormArray;
  }

  addRow(): void {
    const newRow = this.fb.group({
      serviceId: [null],
      price: [0],
      commission_price: [0],
      amount: [0]
    });
    this.FormArray.push(newRow);
    this.calculateTotalPrice(); // Update total when adding a row
  }

  removeRow(index: number): void {
    this.FormArray.removeAt(index);
    this.calculateTotalPrice(); // Update total when removing a row
  }

  onServiceSelect(event: MatSelectChange, index: number) {
    const selectedId = event.value; // Directly get the selected value
    const selectedService = this.ServiceList.find(service => service.id == selectedId);

    if (selectedService) {
      console.log("Selected Service Object:", selectedService);

      // Patch values into the form array
      this.FormArray.at(index).patchValue({
        price: selectedService.price,
        commission_price: selectedService.commission_price,
        amount: selectedService.price - selectedService.commission_price
      });

      // Recalculate total price
      this.calculateTotalPrice();
    } else {
      console.log("Service not found.");
    }
  }

  calculateTotalPrice() {
    let total = this.FormArray.controls.reduce((sum, control) => {
      return sum + (control.get('amount')?.value || 0);
    }, 0);

    this.myForm.patchValue({ total_price: total });
  }

  // Submit function
  onSubmit(): void {
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      console.log(formData);

      if (this.Data && this.Data.id) {
        // Update an existing Service
        this.salesService.Updatesales(this.Data.id, formData).subscribe({
          next: (response) => {
            console.log('sales updated successfully', response);
            this.router.navigate(['/admin/sales']); // Navigate back to the  list
          },
          error: (error) => {
            console.error('Error updating sales', error);
          }
        });
      } else {
        // Add a new Service
        this.salesService.Addsales(formData).subscribe({
          next: (response) => {
            console.log('sales added successfully', response);
            this.router.navigate(['/admin/sales']); // Navigate back to the list
          },
          error: (error) => {
            console.error('Error adding sales', error);
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
