import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { userService } from '../../../services/user.service';

@Component({
  selector: 'app-user-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatFormFieldModule,
    MatInputModule, MatButtonModule, RouterModule],
  templateUrl: './user-add-edit.component.html',
  styleUrl: './user-add-edit.component.css'
})
export class UserAddEditComponent implements OnInit {
  vendorForm!: FormGroup;
  isEditMode: boolean = false; // Default to 'false' for adding a User
  UserData: any;

  constructor(private fb: FormBuilder,
    private userService: userService,
    public dialogRef: MatDialogRef<UserAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createForm();
  }

  ngOnInit(): void {
    // If editing an existing User, set isEditMode to true and load the data
    this.UserData = this.data;
    if (this.UserData?.id) {
      this.isEditMode = true
      this.populateForm(this.UserData);
    }
    this.vendorForm.get('main_balance')?.valueChanges.subscribe(value => {
      this.vendorForm.patchValue({ virtual_balance: value }, { emitEvent: false });
    });
  }

  // Creating the form group with validations
  createForm(): void {
    this.vendorForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      main_balance: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      virtual_balance: []
    });
  }

  populateForm(User: any): void {
    this.vendorForm.patchValue({
      name: User.name || '',
      phone: User.phone || '',
    });
  }
  // Submit function
  onSubmit(): void {
    if (this.vendorForm.valid) {
      const formData = this.vendorForm.value;

      if (this.UserData && this.UserData.id) {
        // Update an existing User
        this.userService.Updateuser(this.UserData.id, formData).subscribe({
          next: (response) => {
            console.log('User updated successfully', response);
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating User', error);
          }
        });
      } else {
        // Add a new User
        this.userService.Adduser(formData).subscribe({
          next: (response) => {
            console.log('User added successfully', response);
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error adding User', error);
          }
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }


  // Getter for easy access to form controls in the template
  get formControls() {
    return this.vendorForm.controls;
  }
}