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
import { cashBackService } from '../../../services/cashBack.service';
import { ExcelService } from '../../../services/excel.service';
import { DeleteDialogComponent } from '../../common/delete-dialog/delete-dialog.component';
import { CashbackAddEditComponent } from '../cashback-add-edit/cashback-add-edit.component';

@Component({
  selector: 'app-cashback-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatPaginatorModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatButtonModule,
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
        console.log('Response Data:', res);
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

    dialogRef.afterClosed().subscribe(() => {
      this.GetCashbacks();
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
        console.log('Delete confirmed');
        this.cashBackService.Deletecashback(CashbackId).subscribe({
          next: (response) => {
            this.GetCashbacks();
            console.log('Cashback deleted successfully:', response);
            // Optionally refresh the list or navigate
          },
          error: (error) => {
            console.error('Error deleting Cashback:', error);
          }
        });
      } else {
        console.log('Delete cancelled');
      }
    });
  }

  excelDownload(title: string) {
    // Assuming CashbackList contains the list of Cashbacks
    let dataToExport = this.CashbackList.map((x: any) => ({
      id: x.id,
      Name: x.Cashback_name,
      Price: x.price,
      CommissionPrice: x.commission_price,
      CreatedAt: x.created_at
    }));

    // Prepare the data to export by converting each row to its values
    this.dataForExcel = []; // Clear previous data
    dataToExport.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row));
    });

    console.log(this.dataForExcel);

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

    // Clear data after export
    this.dataForExcel = [];
  }
}
