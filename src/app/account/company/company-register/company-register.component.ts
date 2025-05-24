import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BuySubcriptionDialogComponent } from '../buy-subcription-dialog/buy-subcription-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-company-register',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, MatInputModule,
    MatFormFieldModule, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatCardModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './company-register.component.html',
  styleUrl: './company-register.component.css'
})
export class CompanyRegisterComponent implements OnInit {
  companyForm!: FormGroup;
  fintechModules: any[] = [
    { id: 1, title: 'sales_dashboard', view: 'Dashboard' },
    { id: 2, title: 'bank_portal_mgmt', view: 'Bank/Portal Management' },
    { id: 3, title: 'commission_setup', view: 'Commission Setup' },
    { id: 4, title: 'money_transfer', view: 'Money Transfer' },
    { id: 5, title: 'aeps_transfer', view: 'AEPS Transfer' },
    { id: 6, title: 'mobile_recharge', view: 'Mobile Recharge' },
    { id: 7, title: 'fund_transfer', view: 'Fund Transfer' },
    { id: 8, title: 'cashback_rewards', view: 'Cashback/Rewards' },
    { id: 9, title: 'sales_as_service', view: 'Sales as Service' },
    { id: 10, title: 'operators_list', view: 'Operators List' },
    { id: 11, title: 'reports_fintech', view: 'Reports' }
  ];

  productModules: any[] = [
    { id: 12, title: 'product_dashboard', view: 'Dashboard' },
    { id: 13, title: 'product_categories', view: 'Product Categories' },
    { id: 14, title: 'product_listing', view: 'Product Listing' },
    { id: 15, title: 'customers', view: 'Customers' },
    { id: 16, title: 'vendors', view: 'Vendors' },
    { id: 17, title: 'inventory', view: 'Inventory' },
    { id: 18, title: 'sales', view: 'Sales' },
    { id: 19, title: 'payments', view: 'Payments' },
    { id: 20, title: 'offers_discounts', view: 'Offers/Discounts' },
    { id: 21, title: 'returns', view: 'Returns' },
    { id: 22, title: 'reports_product', view: 'Reports' }
  ];

  selectedModules: any[] = [];

  constructor(private fb: FormBuilder, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      companyName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      companyType: ['', Validators.required],
      modules: this.fb.array([])
    });

    this.companyForm.get('companyType')?.valueChanges.subscribe(type => {
      this.setModules(type);
    });
  }

  setModules(type: string) {
    const moduleArray = this.companyForm.get('modules') as FormArray;
    moduleArray.clear();

    this.selectedModules =
      type === 'fintech_service' ? this.fintechModules : this.productModules;

    this.selectedModules.forEach(() => moduleArray.push(this.fb.control(false)));
  }

  onSubmit() {

    if (this.companyForm.valid) {
      const dialogRef = this.dialog.open(BuySubcriptionDialogComponent, {
        // width: '400px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe((choice) => {
        if (choice === 'trial') {
          // Handle 3-day trial logic
          console.log('Trial selected');
          // e.g., save company with trial status
        } else if (choice === 'buy') {
          // Redirect to payment or subscription page
          console.log('Buy Now selected');
        }
      });
    }
    const selectedModuleIds = this.companyForm.value.modules
      .map((checked: boolean, i: number) => checked ? this.selectedModules[i].id : null)
      .filter((v: number | null) => v !== null);

    const payload = {
      ...this.companyForm.value,
      moduleIds: selectedModuleIds
    };

    console.log('Final Payload:', payload);
    // call service to send data to Node API here
  }
}