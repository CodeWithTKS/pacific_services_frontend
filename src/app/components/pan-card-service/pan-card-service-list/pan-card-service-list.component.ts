import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
import { pancardService } from '../../../services/panCard.service';

@Component({
  selector: 'app-pan-card-service-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDatepickerModule,
    MatPaginatorModule, MatTableModule, MatFormFieldModule, RouterModule,
    MatSnackBarModule,
    MatInputModule, MatButtonModule, MatSortModule, MatSelectModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './pan-card-service-list.component.html',
  styleUrl: './pan-card-service-list.component.css'
})
export class PanCardServiceListComponent implements OnInit, AfterViewInit {
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
    // 'action'
  ];
  dataSource = new MatTableDataSource<any>([]);
  dataForExcel: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  range: FormGroup;
  filters = {};

  constructor(private pancardService: pancardService,
    private ExcelService: ExcelService,
    private snackBar: MatSnackBar,
    private router: Router, private fb: FormBuilder) {
    this.range = this.fb.group({
      start: [null],
      end: [null],
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
    this.Getpancard();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;
  }

  Getpancard() {
    const filters = this.filters || {}; // Default to an empty object if no filters provided
    this.pancardService.Getpancard(filters).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.map((item: any) => ({
          ...item,
          total_commission_price: item.services.reduce((sum: number, service: any) => sum + service.commission_amount, 0),
          service_names: item.services.map((service: any) => service.service_name).join(', ') // Combine service names in one line
        }));
        this.SaleList = this.dataSource.data;
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
      this.Getpancard();
    }
  }

  FilterReset(): void {
    this.range.reset();
    this.filters = {};
    this.Getpancard();
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

  editpanCard(panCard: any): void {
    this.router.navigate([`/admin/panCard/edit/${panCard.id}`], {
      state: { panCardData: panCard } // Pass portal data using state
    });
  }

  excelDownload(title: string) {
    if (!this.SaleList || this.SaleList.length === 0) {
      console.warn("No data available for export.");
      return;
    }

    // Map SaleList to extract relevant fields
    let dataToExport = this.SaleList.map((x: any) => ({
      ID: x.id,
      Name: x.name,
      Phone: x.phone,
      UID: x.UID || 'N/A',
      Payment_Type: x.paymentType || 'N/A',
      Transfer_Type: x.TransferType || 'N/A',
      Portal_ID: x.portalId ?? 'N/A',
      Services: x.services.map((s: any) => s.service_name).join(', ') || 'N/A',
      Total_Price: x.total_price,
      Comments: x.comments || 'N/A',
      Work_Status: x.workStatus || 'N/A',
      Pending_Amount: x.PendingAmount,
      Received_Amount: x.ReceivedAmount,
      Created_At: new Date(x.created_at).toLocaleString()
    }));

    if (dataToExport.length === 0) {
      console.warn("No valid data to export.");
      return;
    }

    // Extract headers dynamically
    let headers = Object.keys(dataToExport[0]);

    // Prepare data array for Excel
    let dataForExcel = dataToExport.map(row => Object.values(row));


    // Prepare report data
    let reportData = {
      data: dataForExcel,
      headers: headers,
      title: title
    };

    // Call the Excel service to generate the file
    this.ExcelService.generateExcel(reportData);
    this.openSnackBar('Excel Download successfully!', 'Close');
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