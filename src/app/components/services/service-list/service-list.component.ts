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
import { ServiceAddEditComponent } from '../service-add-edit/service-add-edit.component';
import { serviceService } from '../../../services/service.service';
import { DeleteDialogComponent } from '../../common/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatPaginatorModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatButtonModule,
    MatSortModule, MatDialogModule],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.css'
})
export class ServiceListComponent implements OnInit, AfterViewInit {
  ServiceList: any[] = [];
  displayedColumns: string[] = [
    'id',
    'service_name',
    'sales_price',
    'purchase_price',
    'commission_price',
    'created_at',
    'Action',
  ];
  dataSource = new MatTableDataSource<any>([]);
  dataForExcel: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private serviceService: serviceService,
    private ExcelService: ExcelService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.Getservices();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;
  }

  Getservices() {
    this.serviceService.Getservices().subscribe({
      next: (res: any) => {
        console.log('Response Data:', res);
        this.dataSource.data = res;
        this.ServiceList = res;
      },
      error: (err: any) => {
        console.error('Error fetching Services:', err);
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

  addService(): void {
    const dialogRef = this.dialog.open(ServiceAddEditComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.Getservices();
    })
  }

  editService(data: any): void {
    const dialogRef = this.dialog.open(ServiceAddEditComponent, {
      width: '400px',
      data: data
    });

    dialogRef.afterClosed().subscribe(() => {
      this.Getservices();
    })
  }

  deleteItem(ServiceId: any): void {
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
        this.serviceService.Deleteservices(ServiceId).subscribe({
          next: (response) => {
            this.Getservices();
            console.log('Service deleted successfully:', response);
            // Optionally refresh the list or navigate
          },
          error: (error) => {
            console.error('Error deleting Service:', error);
          }
        });
      } else {
        console.log('Delete cancelled');
      }
    });
  }

  excelDownload(title: string) {
    // Assuming ServiceList contains the list of Services
    let dataToExport = this.ServiceList.map((x: any) => ({
      id: x.id,
      Name: x.service_name,
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

    // Call the Excel service to generate the excel file
    this.ExcelService.generateExcel(reportData);

    // Clear data after export
    this.dataForExcel = [];
  }
}
