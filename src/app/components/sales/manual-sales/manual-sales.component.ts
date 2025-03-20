import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { salesService } from '../../../services/sales.service';
import { serviceService } from '../../../services/service.service';
import { portalService } from '../../../services/portal.service';
@Component({
  selector: 'app-manual-sales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    RouterModule, MatSelectModule, MatIconModule, MatDialogModule],
  templateUrl: './manual-sales.component.html',
  styleUrl: './manual-sales.component.css'
})
export class ManualSalesComponent implements OnInit {
  myForm!: FormGroup;
  isEditMode: boolean = false; // Default to 'false' for adding a Service
  paymentTypes: string[] = ['Cash', 'Online'];
  portalList: any[] = [];
  saleData: any = null;  // Default value to avoid undefined errors

  constructor(
    private fb: FormBuilder,
    private portalService: portalService,
    private salesService: salesService,
    private router: Router,
    private route: ActivatedRoute) {
    this.createForm();
    // Get state data
    const navigation = this.router.getCurrentNavigation();
    const stateData = navigation?.extras.state as { [key: string]: any };

    if (stateData && stateData['saleData']) {
      this.saleData = stateData['saleData'];  // Access property correctly
      console.log(this.saleData);
      this.patchForm();
      this.isEditMode = true; // Set edit mode to true if data is present
    } else {
      console.log("No sale data found, consider fetching from API.");
    }
  }

  ngOnInit(): void {
    this.GetPortals();
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

  patchForm(): void {
    this.myForm.patchValue({
      name: this.saleData.name,
      phone: this.saleData.phone,
      paymentType: this.saleData.paymentType,
      subtotal_price: this.saleData.subtotal_price,
      total_price: this.saleData.total_price
    });

    // Patch services array
    this.FormArray.clear(); // Clear existing form array before patching new data
    this.saleData.services.forEach((service: any) => {
      const serviceGroup = this.fb.group({
        service_name: [service.service_name || ''],
        portalId: [service.portalId || ''],
        description: [service.description || ''],
        price: [service.price || ''],
        discount: [service.discount || ''],
        commission_price: [{ value: service.commission_price || '', disabled: (service.commission_price > 0) }]
      });
      this.FormArray.push(serviceGroup);
    });
  }

  GetPortals() {
    this.portalService.GetPortals().subscribe({
      next: (res: any) => {
        console.log('Response Data:', res);
        this.portalList = res;
      }
    });
  }

  get FormArray(): FormArray {
    return this.myForm.get('services') as FormArray;
  }

  addRow(): void {
    const newRow = this.fb.group({
      service_name: [null],
      portalId: [null],
      description: [null],
      price: [0],
      discount: [0],
      commission_price: [0],
    });
    this.FormArray.push(newRow);
    this.calculateTotalPrice(); // Update total when adding a row
  }

  removeRow(index: number): void {
    this.FormArray.removeAt(index);
    this.calculateTotalPrice(); // Update total when removing a row
  }

  calculateTotalPrice() {
    let subtotal = this.FormArray.controls.reduce((sum, control) => {
      let price = control.get('price')?.value || 0;
      let discount = control.get('discount')?.value || 0;
      return sum + (price - discount);
    }, 0);
    this.myForm.patchValue({ total_price: subtotal });
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

      console.log(formValue);
      if (this.saleData && this.saleData.id) {
        // Update an existing Sales
        this.salesService.Updatesales(this.saleData.id, formValue).subscribe({
          next: (response) => {
            console.log('sales updated successfully', response);
            this.router.navigate(['/admin/sales']); // Navigate back to the  list
          },
          error: (error) => {
            console.error('Error updating sales', error);
          }
        });
      } else {
        // Add a new Sales
        this.salesService.AddManualSales(formValue).subscribe({
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
