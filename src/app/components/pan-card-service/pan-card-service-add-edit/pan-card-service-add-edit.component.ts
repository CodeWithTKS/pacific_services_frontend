import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { serviceService } from '../../../services/service.service';
import { portalService } from '../../../services/portal.service';
import { pancardService } from '../../../services/panCard.service';
import { userService } from '../../../services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pan-card-service-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatSnackBarModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule,
    RouterModule, MatSelectModule, MatIconModule, MatDialogModule],
  templateUrl: './pan-card-service-add-edit.component.html',
  styleUrl: './pan-card-service-add-edit.component.css'
})
export class PanCardServiceAddEditComponent implements OnInit {
  myForm!: FormGroup;
  isEditMode: boolean = false; // Default to 'false' for adding a Service
  Data: any;
  ServiceList: any[] = [];
  paymentTypes: string[] = ['Cash', 'Online'];
  workStatus: string[] = ['Pending', 'Completed', 'Rejected'];
  panCardData: any;
  portalList: any[] = [];
  VendorList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private serviceService: serviceService,
    private pancardService: pancardService,
    private portalService: portalService,
    private userService: userService,
    private snackBar: MatSnackBar,
    private router: Router) {
    this.createForm();
  }

  ngOnInit(): void {
    this.panCardData = history.state.panCardData;
    if (this.panCardData?.id) {
      this.isEditMode = true;
      this.populateForm(this.panCardData);
    }
    this.Getservices();
    this.GetPortals();
    this.GetVendor();
  }

  createForm(): void {
    this.myForm = this.fb.group({
      name: ['', [Validators.required]],
      VendorID: [''],
      phone: [''],
      UID: [''],
      paymentType: [''],
      portalId: [],
      services: this.fb.array([]), // FormArray for the table rows
      TransferType: [],
      comments: [],
      workStatus: [],
      HighlightEntry: [false],
      PendingAmount: [0],
      ReceivedAmount: [0],
      total_price: ['0', [Validators.required]]
    })
  }

  populateForm(data: any): void {
    this.myForm.patchValue({
      name: data.name || '',
      VendorID: data.VendorID,
      phone: data.phone || '',
      UID: data.UID || '',
      paymentType: data.paymentType || '',
      portalId: data.portalId || '',
      TransferType: data.TransferType || '',
      comments: data.comments || '',
      workStatus: data.workStatus || '',
      HighlightEntry: data.HighlightEntry || false,
      PendingAmount: data.PendingAmount || 0,
      ReceivedAmount: data.ReceivedAmount || 0,
      total_price: data.total_price || 0,
    });

    // Populate services if available and set them as disabled
    if (data.services && Array.isArray(data.services)) {
      this.FormArray.clear();
      data.services.forEach((service: any) => {
        this.FormArray.push(this.fb.group({
          serviceId: [{ value: service.serviceId || null, disabled: true }],
          portalId: [{ value: service.portalId || 0, disabled: true }],
          qty: [{ value: service.qty || 1, disabled: true }],
          price: [{ value: service.price || 0, disabled: true }],
          purchase_price: [{ value: service.purchase_price || 0, disabled: true }],
          discount: [{ value: service.discount || 0, disabled: true }],
          description: [{ value: service.description || null, disabled: true }],
        }));
      });
    }

    this.calculateTotalPrice(); // Ensure total price is updated
  }

  Getservices() {
    this.serviceService.Getservices().subscribe({
      next: (res: any) => {
        // Filter services where portalId > 0
        this.ServiceList = res.filter((service: any) => service.portalId == 0);
        console.log("Filtered Response:", this.ServiceList);
      },
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
      qty: [1],
      price: [0],
      purchase_price: [0],
      discount: [0],
      description: [null],
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
        purchase_price: selectedService.purchase_price,
      });
      // Recalculate total price
      this.calculateTotalPrice();
    }
  }

  calculateTotalPrice() {
    let total = this.FormArray.controls.reduce((sum, control) => {
      let price = control.get('price')?.value || 0;
      let discount = control.get('discount')?.value || 0;
      let qty = control.get('qty')?.value || 1; // Default qty to 1 if not provided

      return sum + (price - discount) * qty;
    }, 0);

    this.myForm.patchValue({ total_price: total });
  }

  // Submit function
  onSubmit(): void {
    if (this.myForm.valid) {
      let formValue = this.myForm.value;

      formValue.services = formValue.services.map((service: any) => {
        const updatedCommissionPrice = service.price - service.discount; // Price after discount
        const commissionAmount = service.price - service.purchase_price - service.discount; // Commission calculation

        return {
          ...service,
          price: updatedCommissionPrice, // Updated price after discount
          commission_amount: commissionAmount // Store commission amount
        };
      });

      // Calculate total_price by summing up all updated amounts
      formValue.total_price = formValue.services.reduce(
        (total: number, service: any) => total + service.price,
        0
      );

      if (this.panCardData && this.panCardData?.id) {
        // Update an existing Service
        this.pancardService.Updatepancard(this.panCardData?.id, formValue).subscribe({
          next: (response) => {
            this.openSnackBar('Updated successfully!', 'Close');
            this.router.navigate(['/admin/panCard']); // Navigate back to the  list
          },
          error: (error) => {
            this.openSnackBar(`${error}`, 'Close');
            console.error('Error updating pancard', error);
          }
        });
      } else {
        // Add a new Service
        this.pancardService.Addpancard(formValue).subscribe({
          next: (response) => {
            this.openSnackBar('Added successfully!', 'Close');
            this.router.navigate(['/admin/panCard']); // Navigate back to the list
          },
          error: (error) => {
            this.openSnackBar(`${error}`, 'Close');
            console.error('Error adding pancard', error);
          }
        });
      }
    } else {
      console.log("Form is invalid");
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

