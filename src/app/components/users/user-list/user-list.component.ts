import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ExcelService } from '../../../services/excel.service';
import { userService } from '../../../services/user.service';
import { DeleteDialogComponent } from '../../common/delete-dialog/delete-dialog.component';
import { UserAddEditComponent } from '../user-add-edit/user-add-edit.component';
import { RazorpayService } from '../../../services/razorpay.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatPaginatorModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSnackBarModule,
    MatSortModule, MatDialogModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit, AfterViewInit {
  UserList: any[] = [];
  displayedColumns: string[] = ['id', 'email', 'subscription_expiry', 'created_at', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  dataForExcel: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: userService,
    private ExcelService: ExcelService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private razorpayService: RazorpayService,
  ) { }

  ngOnInit(): void {
    this.GetOperator();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;
  }

  GetOperator() {
    this.userService.GetOperator().subscribe({
      next: (res: any) => {
        this.dataSource.data = res;
        this.UserList = res;
      },
      error: (err: any) => {
        console.error('Error fetching users:', err);
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset to the first page after applying the filter
    }
  }

  addoperator(): void {
    const dialogRef = this.dialog.open(UserAddEditComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetOperator();
    })
  }

  deleteoperator(userId: any): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      height: '170px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this item?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.userService.Deleteuser(userId).subscribe({
          next: (response) => {
            this.GetOperator();
            this.openSnackBar('Deleted successfully!', 'Close');
            // Optionally refresh the list or navigate
          },
          error: (error) => {
            this.openSnackBar(`${error}`, 'Close');
            console.error('Error deleting user:', error);
          }
        });
      } else {

      }
    });
  }

  Renew(id: any): void {
    const role = 'User'; // Get user role
    const userId = id; // Extract userId
    // Step 1: Create Razorpay Order
    this.razorpayService.createOrder(role).subscribe({
      next: (order) => {
        // Step 2: Open Razorpay Payment UI
        this.razorpayService.openPayment(order, role, userId,
          (paymentResponse: any) => {
            console.log('Payment Success:', paymentResponse);
            this.GetOperator();
          },
          (paymentError: any) => {
            console.error('Payment failed', paymentError);
          }
        );
      },
      error: (error) => {
        console.error('Error creating Razorpay order', error);
      }
    });
  }

  excelDownload(title: string) {
    // Assuming UserList contains the list of users
    let dataToExport = this.UserList.map((x: any) => ({
      ID: x.login_id,
      Email: x.email,
      Role: x.role,
      Subscription_Status: x.subscription_status,
      Subscription_Expiry: x.subscription_expiry
        ? new Date(x.subscription_expiry).toLocaleDateString()
        : 'N/A',
      Created_At: new Date(x.created_at).toLocaleString(),
      Updated_At: new Date(x.updated_at).toLocaleString()
    }));

    // Prepare the data to export by converting each row to its values
    this.dataForExcel = []; // Clear previous data
    dataToExport.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row));
    });



    // Extract header names dynamically from the keys of the first object
    let headers = Object.keys(dataToExport[0]);

    // Define the report data with headers and data
    let reportData = {
      data: this.dataForExcel,
      headers: headers, // Use keys as headers
      title: title
    };

    // Call the Excel service to generate the excel file
    this.ExcelService.generateExcel(reportData);
    this.openSnackBar('Excel Download successfully!', 'Close');
    // Clear data after export
    this.dataForExcel = [];
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar will auto-dismiss after 3 seconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'bottom' // Show on top
    });
  }
}