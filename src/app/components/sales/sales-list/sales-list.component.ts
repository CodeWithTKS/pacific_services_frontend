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
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import moment from 'moment';
import { ExcelService } from '../../../services/excel.service';
import { salesService } from '../../../services/sales.service';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDatepickerModule,
    MatPaginatorModule, MatTableModule, MatFormFieldModule, RouterModule,
    MatInputModule, MatButtonModule, MatSortModule, MatDialogModule, MatSelectModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.css'
})
export class SalesListComponent implements OnInit, AfterViewInit {
  SaleList: any[] = [];
  displayedColumns: string[] = [
    'id',
    'user_name',
    'phone',
    'paymentType',
    'service_names',
    'total_commission_price',
    'total_price',
    'created_at',
    'action'
  ];
  dataSource = new MatTableDataSource<any>([]);
  dataForExcel: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  range: FormGroup;
  filters = {};

  constructor(private salesService: salesService,
    private ExcelService: ExcelService,
    private dialog: MatDialog, private fb: FormBuilder) {
    this.range = this.fb.group({
      start: [null],
      end: [null],
    });
  }

  ngOnInit(): void {
    this.Getsales();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;
  }

  Getsales() {
    const filters = this.filters || {}; // Default to an empty object if no filters provided
    this.salesService.Getsales(filters).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.map((item: any) => ({
          ...item,
          total_commission_price: item.services.reduce((sum: number, service: any) => sum + service.commission_price, 0),
          service_names: item.services.map((service: any) => service.service_name).join(', ') // Combine service names in one line
        }));
        this.SaleList = this.dataSource.data;
        console.log(this.SaleList);
      },
      error: (err: any) => console.error('Error fetching Services:', err),
    });
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

  applyDateFilter(): void {
    const start = this.range.value.start
      ? moment(this.range.value.start).format('YYYY-MM-DD')
      : null;
    const end = this.range.value.end
      ? moment(this.range.value.end).format('YYYY-MM-DD')
      : null;
    if (start && end) {
      this.filters = {
        fromDate: start,
        toDate: end,
      };
      this.Getsales();
    }
  }

  FilterReset(): void {
    this.range.reset();
    this.filters = {};
    this.Getsales();
  }

  getTotalCommissionAmt() {
    return this.dataSource.data
      .map((transfer: any) => transfer.total_commission_price)
      .reduce((acc, value) => acc + (value || 0), 0);
  }

  getTotalAmt() {
    return this.dataSource.data
      .map((transfer: any) => transfer.total_price)
      .reduce((acc, value) => acc + (value || 0), 0);
  }

  isEditable(Sale: any): boolean {
    const noServiceId = !Sale.services?.some((service: { serviceId: any }) => service.serviceId);
    const hasCommissionPrice = Sale.services?.some((service: { commission_price: number }) => service.commission_price > 0);
    return noServiceId && !hasCommissionPrice;
  }  

  excelDownload(title: string) {
    if (!this.SaleList || this.SaleList.length === 0) {
      console.warn("No data available for export.");
      return;
    }

    // Map SaleList to extract relevant fields
    let dataToExport = this.SaleList.map((x: any) => ({
      ID: x.id,
      Name: x.user_name, // Adjusted to match your JSON
      Created_At: x.created_at,
      Total_Price: x.total_price,
      Total_Commission: x.total_commission_price,
      Services: x.service_names
    }));

    if (dataToExport.length === 0) {
      console.warn("No valid data to export.");
      return;
    }

    // Extract headers dynamically
    let headers = Object.keys(dataToExport[0]);

    // Prepare data array for Excel
    let dataForExcel = dataToExport.map(row => Object.values(row));

    console.log("Exporting Data:", dataForExcel);

    // Prepare report data
    let reportData = {
      data: dataForExcel,
      headers: headers,
      title: title
    };

    // Call the Excel service to generate the file
    this.ExcelService.generateExcel(reportData);
  }
}

