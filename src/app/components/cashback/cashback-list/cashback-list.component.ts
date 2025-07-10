import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { cashBackService } from '../../../services/cashBack.service';
import { ExcelService } from '../../../services/excel.service';
import { DeleteDialogComponent } from '../../common/delete-dialog/delete-dialog.component';
import { CashbackAddEditComponent } from '../cashback-add-edit/cashback-add-edit.component';

@Component({
  selector: 'app-cashback-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatPaginatorModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSnackBarModule,
    MatSortModule, MatDialogModule],
  templateUrl: './cashback-list.component.html',
  styleUrl: './cashback-list.component.css'
})
export class CashbackListComponent implements OnInit, AfterViewInit {
  CashbackList: any[] = [];
  displayedColumns: string[] = [
    'id',
    'portalId',
    'balance',
    'remark',
    'type',
    'date',
  ];
  dataSource = new MatTableDataSource<any>([]);
  dataForExcel: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private cashBackService: cashBackService,
    private ExcelCashback: ExcelService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.GetCashbacks();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;
  }

  GetCashbacks() {
    this.cashBackService.Getcashback().subscribe({
      next: (res: any) => {
        this.dataSource.data = res;
        this.CashbackList = res;
      },
      error: (err: any) => {
        console.error('Error fetching Cashbacks:', err);
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

  addCashback(): void {
    const dialogRef = this.dialog.open(CashbackAddEditComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res === true) {
        this.GetCashbacks();
      }
    })
  }

  editCashback(data: any): void {
    const dialogRef = this.dialog.open(CashbackAddEditComponent, {
      width: '400px',
      data: data
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetCashbacks();
    })
  }

  deleteItem(CashbackId: any): void {
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
        this.cashBackService.Deletecashback(CashbackId).subscribe({
          next: (response) => {
            this.GetCashbacks();
            this.openSnackBar('Deleted successfully!', 'Close');
            // Optionally refresh the list or navigate
          },
          error: (error) => {
            this.openSnackBar(`${error}`, 'Close');
            console.error('Error deleting Cashback:', error);
          }
        });
      } else {
      }
    });
  }

  excelDownload(title: string) {
    // Assuming CashbackList contains the list of Cashbacks
    let dataToExport = this.CashbackList.map((x: any) => ({
      ID: x.id,
      Portal_Name: x.portalName,
      Portal_ID: x.portalId,
      Balance: x.balance,
      Remark: x.remark,
      Type: x.type,
      Date: new Date(x.date).toLocaleString()
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

    // Call the Excel Cashback to generate the excel file
    this.ExcelCashback.generateExcel(reportData);
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
