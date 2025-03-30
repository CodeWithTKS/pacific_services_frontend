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
import { ExcelService } from '../../../services/excel.service';
import { userService } from '../../../services/user.service';
import { UserAddEditComponent } from '../user-add-edit/user-add-edit.component';
import { UpdateVendorBalanceComponent } from '../update-vendor-balance/update-vendor-balance.component';
import { PortalTransferComponent } from '../portal-transfer/portal-transfer.component';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../../common/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatPaginatorModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatButtonModule,
    MatSortModule, MatDialogModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit, AfterViewInit {
  UserList: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'phone', 'main_balance', 'virtual_balance', 'created_at', 'Action'];
  dataSource = new MatTableDataSource<any>([]);
  dataForExcel: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: userService,
    private ExcelService: ExcelService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.Getuser();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;
  }

  Getuser() {
    this.userService.Getuser().subscribe({
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

  addVendor(): void {
    const dialogRef = this.dialog.open(UserAddEditComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.Getuser();
    })
  }

  editVendor(data: any): void {
    const dialogRef = this.dialog.open(UserAddEditComponent, {
      width: '400px',
      data: data
    });

    dialogRef.afterClosed().subscribe(() => {
      this.Getuser();
    })
  }

  deleteVendor(userId: any): void {
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
            this.Getuser();
            // Optionally refresh the list or navigate
          },
          error: (error) => {
            console.error('Error deleting user:', error);
          }
        });
      } else {
        
      }
    });
  }

  updateBalance(portal: any): void {
    const dialogRef = this.dialog.open(UpdateVendorBalanceComponent, {
      width: '400px',
      height: '300px',
      data: portal
    });

    dialogRef.afterClosed().subscribe(() => {
      this.Getuser();
    })
  }

  portalBalance(portal: any): void {
    const dialogRef = this.dialog.open(PortalTransferComponent, {
      width: '400px',
      data: portal
    });

    dialogRef.afterClosed().subscribe(() => {
      this.Getuser();
    })
  }

  view(data: any) {
    this.router.navigate([`/admin/user/view/${data.id}`])
  }

  excelDownload(title: string) {
    // Assuming UserList contains the list of users
    let dataToExport = this.UserList.map((x: any) => ({
      id: x.id,
      Name: x.name,
      Phone: x.phone,
      CreatedAt: x.created_at
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

    // Clear data after export
    this.dataForExcel = [];
  }
}