import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import moment from 'moment';
import { ExcelService } from '../../../services/excel.service';
import { fundTransferService } from '../../../services/fundTransfer.service';
import { portalService } from '../../../services/portal.service';
import { userService } from '../../../services/user.service';
import { DeleteDialogComponent } from '../../common/delete-dialog/delete-dialog.component';
import { TransactionAddComponent } from '../transaction-add/transaction-add.component';

@Component({
  selector: 'app-fund-transferlist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDatepickerModule,
    MatPaginatorModule, MatTableModule, MatFormFieldModule, RouterModule, MatSnackBarModule,
    MatInputModule, MatButtonModule, MatSortModule, MatDialogModule, MatSelectModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './fund-transferlist.component.html',
  styleUrl: './fund-transferlist.component.css'
})
export class FundTransferlistComponent implements OnInit, AfterViewInit {
  fundList: any[] = [];
  portalList: any[] = [];
  displayedColumns: string[] = [
    'TransferID',
    'TransactionNo',
    'portalName',
    'FullName',
    'Date',
    'CollectionAmt',
    'Extra',
    'Action',
  ];
  dataSource = new MatTableDataSource<any>([]);
  dataForExcel: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  range: FormGroup;
  filters = {};

  constructor(private fundTransferService: fundTransferService,
    private portalService: portalService,
    private router: Router,
    private userService: userService,
    private ExcelService: ExcelService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog, private fb: FormBuilder) {
    this.range = this.fb.group({
      start: [null],
      end: [null],
      portalId: [null],
      VendorID: [null],
    });
  }

  ngOnInit(): void {
    this.GetfundTransfers();
    this.GetPortals();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;
  }

  GetfundTransfers(): void {
    const filters = this.filters || {}; // Default to an empty object if no filters provided
    this.fundTransferService.GetfundTransfers(filters).subscribe({
      next: (res: any) => {

        this.dataSource.data = res;
        this.fundList = res;
      },
      error: (err: any) => {
        console.error('Error fetching fund transfers:', err);
      },
    });
  }

  GetPortals(): void {
    this.portalService.GetPortals().subscribe({
      next: (res: any) => {

        this.portalList = res;
      }
    })
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset to the first page after applying the filter
    }
  }

  getFormattedDateRange(): string {
    const start = this.range.value.start
      ? moment(this.range.value.start).format('YYYY-MM-DD')
      : '';
    const end = this.range.value.end
      ? moment(this.range.value.end).format('YYYY-MM-DD')
      : '';
    return `${start} to ${end}`;
  }

  getTotalExtra() {
    return this.dataSource.data
      .map((transfer: any) => transfer.Extra)
      .reduce((acc, value) => acc + (value || 0), 0);
  }

  getTotalCollectionAmt() {
    return this.dataSource.data
      .filter((transfer: any) => transfer.self !== 1)
      .map((transfer: any) => transfer.CollectionAmt)
      .reduce((acc, value) => acc + (value || 0), 0);
  }

  applyDateFilter(): void {
    const start = this.range.value.start
      ? moment(this.range.value.start).format('YYYY-MM-DD')
      : null;
    const end = this.range.value.end
      ? moment(this.range.value.end).format('YYYY-MM-DD')
      : null;
    const portalId = this.range.value.portalId
    const VendorID = this.range.value.VendorID
    if (start && end || portalId || VendorID) {
      this.filters = {
        fromDate: start,
        toDate: end,
        portalId: portalId,
        VendorID: VendorID
      };
      this.GetfundTransfers();
    }
  }

  FilterReset(): void {
    this.range.reset();
    this.filters = {};
    this.GetfundTransfers();
  }

  AddTransfer(fund: any): void {
    const dialogRef = this.dialog.open(TransactionAddComponent, {
      width: '400px',
      height: '250px',
      data: fund
    });
    dialogRef.afterClosed().subscribe(() => {
      this.GetfundTransfers();
    })
  }

  editTransfer(fund: any): void {
    this.router.navigate([`/admin/fund-transfer/editmoney/${fund.TransferID}`], {
      state: { fundData: fund } // Pass portal data using state
    });
  }

  deleteItem(TransferID: any): void {
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

        this.fundTransferService.DeletefundTransfer(TransferID).subscribe({
          next: (response) => {
            this.GetfundTransfers();
            this.openSnackBar('Deleted successfully!', 'Close');
            // Optionally refresh the list or navigate
          },
          error: (error) => {
            this.openSnackBar(`${error}`, 'Close');
            console.error('Error deleting Commission:', error);
          }
        });
      } else {

      }
    });
  }

  excelDownload(title: string): void {
    // Assuming contains the list of portals
    let dataToExport = this.fundList.map((x: any) => ({
      ID: x.TransferID,
      Portal_Name: x.portalName,
      Portal_ID: x.portalId,
      Transaction_No: x.TransactionNo,
      First_Name: x.FirstName,
      Last_Name: x.LastName,
      Contact_No: x.ContactNo,
      IFSC_No: x.IFSCNo,
      Customer_UID: x.customerUID,
      Beneficiary_UID: x.beneficiaryUID,
      Transaction_Type: x.TransactionType,
      Transaction_Category: x.TransactionCategory,
      Cash_500: x.Cash500,
      Cash_100: x.Cash100,
      Cash_50: x.Cash50,
      Cash_20: x.Cash20,
      Cash_10: x.Cash10,
      Cash_5: x.Cash5,
      Cash_1: x.Cash1,
      Total_Cash: x.TotalCash,
      Collection_Amount: x.CollectionAmt,
      Extra: x.Extra,
      Transaction_Date: new Date(x.TransactionDate).toLocaleString(),
      Created_At: new Date(x.CreatedAt).toLocaleString(),
      Highlight_Entry: x.HighlightEntry
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
