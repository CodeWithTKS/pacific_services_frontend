import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { userService } from '../../../services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { RazorpayService } from '../../../services/razorpay.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatFormFieldModule, MatIconModule, MatSnackBarModule,
    MatInputModule, MatButtonModule, RouterModule],
  templateUrl: './user-add-edit.component.html',
  styleUrl: './user-add-edit.component.css'
})
export class UserAddEditComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false; // Add this line

  constructor(private fb: FormBuilder,
    private userService: userService,
    private razorpayService: RazorpayService,
    public dialogRef: MatDialogRef<UserAddEditComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    // If editing an existing User, set isEditMode to true and load the data
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['User']
    });
  }

  // Submit function
  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      const role = formData.role; // Get user role

      // Step 1: Create User First
      this.userService.CreateUser(formData).subscribe({
        next: (userResponse) => {
          // if (userResponse && userResponse.data && userResponse.data.userId) {
          //   const userId = userResponse.data.userId; // Extract userId

          //   // Step 2: Create Razorpay Order
          //   this.razorpayService.createOrder(role).subscribe({
          //     next: (order) => {
          //       // Step 3: Open Razorpay Payment UI
          //       this.razorpayService.openPayment(order, role, userId,
          //         (paymentResponse: any) => {
          //           console.log('Payment Success:', paymentResponse);
          //           this.dialogRef.close(true);
          //         },
          //         (paymentError: any) => {
          //           console.error('Payment failed', paymentError);
          //         }
          //       );
          //     },
          //     error: (error) => {
          //       console.error('Error creating Razorpay order', error);
          //     }
          //   });
          // }
          this.dialogRef.close(true);
          this.openSnackBar('Added successfully!', 'Close');
        },
        error: (error) => {
          this.openSnackBar(`${error}`, 'Close');
          console.error('Error adding User', error);
        }
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Toggle password visibility
  }

  // Getter for easy access to form controls in the template
  get formControls() {
    return this.loginForm.controls;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar will auto-dismiss after 3 seconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'bottom' // Show on top
    });
  }
}