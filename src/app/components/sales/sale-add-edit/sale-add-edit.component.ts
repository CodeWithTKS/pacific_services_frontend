import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { salesService } from '../../../services/sales.service';
import { serviceService } from '../../../services/service.service';
import { userService } from '../../../services/user.service';
import { UserAddEditComponent } from '../../users/user-add-edit/user-add-edit.component';

@Component({
  selector: 'app-sale-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    RouterModule, MatSelectModule, MatIconModule, MatDialogModule],
  templateUrl: './sale-add-edit.component.html',
  styleUrl: './sale-add-edit.component.css'
})
export class SaleAddEditComponent implements OnInit {
  myForm!: FormGroup;
  isEditMode: boolean = false; // Default to 'false' for adding a Service
  Data: any;
  ServiceList: any[] = [];
  UserList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private serviceService: serviceService,
    private salesService: salesService,
    private userService: userService,
    private dialog: MatDialog,
    private router: Router) {
    this.createForm();
  }

  ngOnInit(): void {
    this.Getuser();
    this.Getservices();
  }

  createForm(): void {
    this.myForm = this.fb.group({
      user_id: ['', [Validators.required]],
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

  get FormArray(): FormArray {
    return this.myForm.get('services') as FormArray;
  }

  addRow(): void {
    const newRow = this.fb.group({
      serviceId: [null],
      portalId: [0],
      description: [null],
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
        portalId: selectedService.portalId,
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

  addCustomer(): void {
    const dialogRef = this.dialog.open(UserAddEditComponent, {
      width: '400px',
      height: '300px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.Getuser();
    })
  }

  // Submit function
  onSubmit(): void {
    if (this.myForm.valid) {
      console.log(this.myForm.value);

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
