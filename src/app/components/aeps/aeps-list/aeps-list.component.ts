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
import { AepsService } from '../../../services/aeps.service';
import { ExcelService } from '../../../services/excel.service';
import { portalService } from '../../../services/portal.service';
import { DeleteDialogComponent } from '../../common/delete-dialog/delete-dialog.component';
import { TransactionAddComponent } from '../transaction-add/transaction-add.component';

@Component({
  selector: 'app-aeps-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDatepickerModule,
    MatPaginatorModule, MatTableModule, MatFormFieldModule, RouterModule, MatSnackBarModule,
    MatInputModule, MatButtonModule, MatSortModule, MatDialogModule, MatSelectModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './aeps-list.component.html',
  styleUrl: './aeps-list.component.css'
})
export class AepsListComponent implements OnInit, AfterViewInit {
  moneyList: any[] = [];
  portalList: any[] = [];
  displayedColumns: string[] = [
    'TransferID',
    'TransactionNo',
    'portalName',
    'vendorName',
    'ACNo',
    'FullName',
    'Date',
    'CollectionAmt',
    'TransactionType',
    'Extra',
    'Action',
  ];
  dataSource = new MatTableDataSource<any>([]);
  dataForExcel: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  range: FormGroup;
  filters = {};

  constructor(private AepsService: AepsService,
    private portalService: portalService,
    private router: Router,
    private snackBar: MatSnackBar,
    private ExcelService: ExcelService,
    private dialog: MatDialog, private fb: FormBuilder) {
    this.range = this.fb.group({
      start: [null],
      end: [null],
      portalId: [null],
    });
  }

  ngOnInit(): void {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    this.filters = {
      fromDate: moment(today).format('YYYY-MM-DD'),
      toDate: moment(tomorrow).format('YYYY-MM-DD'),
    };
    this.GetMoneyTransfers();
    this.GetPortals();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;
  }

  GetMoneyTransfers(): void {
    const filters = this.filters || {}; // Default to an empty object if no filters provided
    this.AepsService.GetMoneyTransfers(filters).subscribe({
      next: (res: any) => {

        this.dataSource.data = res;
        this.moneyList = res;
      },
      error: (err: any) => {
        console.error('Error fetching money transfers:', err);
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
      .filter((transfer: any) => transfer.self !== 1)
      .map((transfer: any) => transfer.Extra)
      .reduce((acc, value) => acc + (value || 0), 0);
  }
  getTotalCollectionAmt() {
    return this.dataSource.data
      .filter((transfer: any) => transfer.self !== 1)
      .map((transfer: any) => transfer.CollectionAmt)
      .reduce((acc, value) => acc + (value || 0), 0);
  }
  getTotalFixedAmt() {
    return this.dataSource.data
      .filter((transfer: any) => transfer.self !== 1)
      .map((transfer: any) => transfer.FixedAmt)
      .reduce((acc, value) => acc + (value || 0), 0);
  }
  getTotalBankCharge() {
    return this.dataSource.data
      .filter((transfer: any) => transfer.self !== 1)
      .map((transfer: any) => transfer.BankCharge)
      .reduce((acc, value) => acc + (value || 0), 0);
  }
  getTotalBankDeposit() {
    return this.dataSource.data
      .filter((transfer: any) => transfer.self !== 1)
      .map((transfer: any) => transfer.BankDeposit)
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
    if (start && end || portalId) {
      this.filters = {
        fromDate: start,
        toDate: end,
        portalId: portalId
      };
      this.GetMoneyTransfers();
    }
  }

  FilterReset(): void {
    this.range.reset();
    this.filters = {};
    this.GetMoneyTransfers();
  }

  AddTransfer(money: any): void {
    const dialogRef = this.dialog.open(TransactionAddComponent, {
      width: '400px',
      height: '250px',
      data: money
    });
    dialogRef.afterClosed().subscribe(() => {
      this.GetMoneyTransfers();
    })
  }

  editTransfer(money: any): void {
    this.router.navigate([`/admin/aeps/editmoney/${money.TransferID}`], {
      state: { moneyData: money } // Pass portal data using state
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
        this.AepsService.DeleteMoneyTransfer(TransferID).subscribe({
          next: (response) => {
            this.GetMoneyTransfers();
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
    let dataToExport = this.moneyList.map((x: any) => ({
      Transfer_ID: x.TransferID,
      Transaction_No: x.TransactionNo,
      Portal_Name: x.portalName,
      Portal_ID: x.portalId,
      Vendor_Name: x.vendorName,
      Account_No: x.ACNo,
      IFSC_No: x.IFSCNo,
      First_Name: x.FirstName,
      Last_Name: x.LastName,
      Contact_No: x.ContactNo,
      Transaction_Date: new Date(x.TransactionDate).toLocaleString(),
      Transaction_Type: x.TransactionType,
      Passbook_Issue: x.passbookIssue,
      Cash_500: x.Cash500,
      Cash_100: x.Cash100,
      Cash_50: x.Cash50,
      Cash_20: x.Cash20,
      Cash_10: x.Cash10,
      Cash_5: x.Cash5,
      Cash_1: x.Cash1,
      Total_Cash: x.TotalCash,
      Collection_Amount: x.CollectionAmt,
      Fixed_Amount: x.FixedAmt,
      Bank_Charge: x.BankCharge,
      Extra: x.Extra,
      Bank_Deposit: x.BankDeposit,
      Customer_Deposit: x.CustDeposit,
      AOB: x.AOB,
      Pending_Amount: x.PendingAmount,
      Received_Amount: x.ReceivedAmount,
      Highlight_Entry: x.HighlightEntry ? 'Yes' : 'No',
      Created_At: new Date(x.CreatedAt).toLocaleString()
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