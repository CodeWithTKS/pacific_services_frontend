import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { salesService } from '../../../services/sales.service';
import { serviceService } from '../../../services/service.service';

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
  paymentTypes: string[] = ['Cash', 'Online'];

  constructor(
    private fb: FormBuilder,
    private serviceService: serviceService,
    private salesService: salesService,
    private router: Router) {
    this.createForm();
  }

  ngOnInit(): void {
    this.Getservices();
  }

  createForm(): void {
    this.myForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: [''],
      paymentType: [''],
      services: this.fb.array([]), // FormArray for the table rows
      subtotal_price: ['', [Validators.required]],
      total_price: ['', [Validators.required]]
    })
  }

  Getservices() {
    this.serviceService.Getservices().subscribe({
      next: (res: any) => {
       
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
      discount: [0],
      commission_price: [0],
      subamount: [0],
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

      // Patch values into the form array
      this.FormArray.at(index).patchValue({
        portalId: selectedService.portalId,
        price: selectedService.price,
        commission_price: selectedService.commission_price,
        subamount: selectedService.price,
        amount: selectedService.price - selectedService.commission_price
      });

      // Recalculate total price
      this.calculateTotalPrice();
    }
  }

  calculateTotalPrice() {
    let total = this.FormArray.controls.reduce((sum, control) => {
      return sum + (control.get('amount')?.value || 0);
    }, 0);
    let subtotal = this.FormArray.controls.reduce((sum, control) => {
      let price = control.get('price')?.value || 0;
      let discount = control.get('discount')?.value || 0;
      return sum + (price - discount);
    }, 0);
    this.myForm.patchValue({ total_price: total });
    this.myForm.patchValue({ subtotal_price: subtotal });
  }

  // Submit function
  onSubmit(): void {
    if (this.myForm.valid) {
      let formValue = this.myForm.value;

      formValue.services = formValue.services.map((service: any) => {
        const updatedCommissionPrice = service.commission_price - service.discount; // Subtract discount from commission_price
        const updatedAmount = service.amount + service.discount; // Add discount to amount

        return {
          ...service,
          commission_price: updatedCommissionPrice, // Updated commission_price
          amount: updatedAmount, // Updated amount
        };
      });

      // Calculate total_price by summing up all updated amounts
      formValue.total_price = formValue.services.reduce(
        (total: number, service: any) => total + service.amount,
        0
      );

      if (this.Data && this.Data.id) {
        // Update an existing Service
        this.salesService.Updatesales(this.Data.id, formValue).subscribe({
          next: (response) => {
            this.router.navigate(['/admin/sales']); // Navigate back to the  list
          },
          error: (error) => {
            console.error('Error updating sales', error);
          }
        });
      } else {
        // Add a new Service
        this.salesService.Addsales(formValue).subscribe({
          next: (response) => {
            this.router.navigate(['/admin/sales']); // Navigate back to the list
          },
          error: (error) => {
            console.error('Error adding sales', error);
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
}
