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
import { Router, RouterModule } from '@angular/router';
import { ExcelService } from '../../../services/excel.service';
import { portalService } from '../../../services/portal.service';
import { UpdateBalanceComponent } from '../update-balance/update-balance.component';
import { DeleteDialogComponent } from '../../common/delete-dialog/delete-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-portal-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatPaginatorModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, RouterModule,
    MatSnackBarModule, MatSortModule, MatDialogModule],
  templateUrl: './portal-list.component.html',
  styleUrl: './portal-list.component.css'
})
export class PortalListComponent implements OnInit, AfterViewInit {
  portalList: any[] = [];
  displayedColumns: string[] = [
    'PortalID',
    'Name',
    'Code',
    'ContactNo',
    'ContactPerson',
    'Email',
    'Balance',
    'CreatedAt',
    'Action',
  ];
  dataSource = new MatTableDataSource<any>([]);
  dataForExcel: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  Role: any

  constructor(private portalService: portalService,
    private ExcelService: ExcelService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.GetPortals();
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        this.Role = parsedData?.user?.role;
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;
  }

  GetPortals() {
    this.portalService.GetPortals().subscribe({
      next: (res: any) => {

        this.dataSource.data = res;
        this.portalList = res;
      },
      error: (err: any) => {
        console.error('Error fetching portals:', err);
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

  getTotalBalance() {
    return this.dataSource.data
      .map((transfer: any) => transfer.Balance)
      .reduce((acc, value) => acc + (value || 0), 0);
  }

  editPortal(portal: any) {
    this.router.navigate([`/admin/portal/editportal/${portal.PortalID}`], {
      state: { portalData: portal } // Pass portal data using state
    });
  }

  viewPortal(portal: any) {
    this.router.navigate([`/admin/portal/viewportal/${portal.PortalID}`])
  }

  updateBalancePortal(portal: any): void {
    const dialogRef = this.dialog.open(UpdateBalanceComponent, {
      width: '400px',
      height: '300px',
      data: portal
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetPortals();
    })
  }

  deleteItem(portalId: any): void {
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

        this.portalService.DeletePortal(portalId).subscribe({
          next: (response) => {
            this.GetPortals();
            this.openSnackBar('Deleted successfully!', 'Close');
            // Optionally refresh the list or navigate
          },
          error: (error) => {
            console.error('Error deleting portal:', error);
            this.openSnackBar(`${error}`, 'Close');
          }
        });
      } else {

      }
    });
  }

  excelDownload(title: string) {
    // Assuming portalList contains the list of portals
    let dataToExport = this.portalList.map((x: any) => ({
      PortalID: x.PortalID,
      Name: x.Name,
      Code: x.Code,
      ContactNo: x.ContactNo,
      ContactPerson: x.ContactPerson,
      Email: x.Email,
      Fax: x.Fax,
      ACNo: x.ACNo,
      Balance: x.Balance,
      TransactionLimit: x.TransactionLimit,
      ServiceTax: x.ServiceTax,
      TDSRate: x.TDSRate,
      OpeningBalanceDate: x.OpeningBalanceDate,
      CreatedAt: x.CreatedAt
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