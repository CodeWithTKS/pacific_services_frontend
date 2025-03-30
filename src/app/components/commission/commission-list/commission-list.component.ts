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
import { CommissionService } from '../../../services/commission.service';
import { ExcelService } from '../../../services/excel.service';
import { DeleteDialogComponent } from '../../common/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-commission-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatPaginatorModule, MatTableModule, MatFormFieldModule, RouterModule,
    MatInputModule, MatButtonModule, MatSortModule, MatDialogModule],
  templateUrl: './commission-list.component.html',
  styleUrl: './commission-list.component.css'
})
export class CommissionListComponent implements OnInit, AfterViewInit {
  commissionList: any[] = [];
  displayedColumns: string[] = [
    'CommissionID',
    'portalName',
    'vendorName',
    'FromAmount',
    'ToAmount',
    'Percentage',
    'PacificFixedAmount',
    'PacificAmount',
    'PacificExtraAmount',
    'CommissionType',
    'CreatedAt',
    'Action',
  ];
  dataSource = new MatTableDataSource<any>([]);
  dataForExcel: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private commissionService: CommissionService,
    private router: Router,
    private ExcelService: ExcelService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.GetCommissions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;
  }

  GetCommissions() {
    this.commissionService.GetCommissions().subscribe({
      next: (res: any) => {
       
        this.dataSource.data = res;
        this.commissionList = res;
      },
      error: (err: any) => {
        console.error('Error fetching commissions:', err);
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

  editCommission(commission: any) {
    this.router.navigate([`/admin/commission/editcommission/${commission.CommissionID}`], {
      state: { commissionData: commission } // Pass portal data using state
    });
  }

  deleteItem(CommissionID: any): void {
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
        
        this.commissionService.DeleteCommission(CommissionID).subscribe({
          next: (response) => {
            this.GetCommissions();
            // Optionally refresh the list or navigate
          },
          error: (error) => {
            console.error('Error deleting Commission:', error);
          }
        });
      } else {
        
      }
    });
  }
  excelDownload(title: string) {
    // Assuming contains the list of portals
    let dataToExport = this.commissionList.map((x: any) => ({
      CommissionID: x.CommissionID,
      portalId: x.portalId,
      FromAmount: x.FromAmount,
      ToAmount: x.ToAmount,
      BankType: x.BankType,
      Amount: x.Amount,
      Percentage: x.Percentage,
      PacificType: x.PacificType,
      PacificFixedAmount: x.PacificFixedAmount,
      PacificAmount: x.PacificAmount,
      PacificExtraAmount: x.PacificExtraAmount,
      CommissionType: x.CommissionType,
      CreatedAt: x.CreatedAt,
      portalName: x.portalName
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