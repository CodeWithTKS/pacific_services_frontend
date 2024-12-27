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
import { CommissionDeleteComponent } from '../commission-delete/commission-delete.component';

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
    'FromAmount',
    'ToAmount',
    'BankType',
    'Amount',
    'Percentage',
    'PacificType',
    'PacificFixedAmount',
    'PacificAmount',
    'PacificExtraAmount',
    'CommissionType',
    'CreatedAt',
    'Action',
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private commissionService: CommissionService,
    private router: Router,
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
        console.log('Response Data:', res);
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
    const dialogRef = this.dialog.open(CommissionDeleteComponent, {
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
        this.commissionService.DeleteCommission(CommissionID).subscribe({
          next: (response) => {
            this.GetCommissions();
            console.log('Commission deleted successfully:', response);
            // Optionally refresh the list or navigate
          },
          error: (error) => {
            console.error('Error deleting Commission:', error);
          }
        });
      } else {
        console.log('Delete cancelled');
      }
    });
  }
}