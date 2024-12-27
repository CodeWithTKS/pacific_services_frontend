import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommissionService } from '../../../services/commission.service';

@Component({
  selector: 'app-commission-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatPaginatorModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatButtonModule],
  templateUrl: './commission-list.component.html',
  styleUrl: './commission-list.component.css'
})
export class CommissionListComponent implements OnInit {
  displayedColumns: string[] = [
    'CommissionID',
    'portalId',
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private commissionService: CommissionService, private router: Router) { }

  ngOnInit(): void {
    this.GetCommissions();
  }

  GetCommissions() {
    this.commissionService.GetCommissions().subscribe({
      next: (res: any) => {
        console.log('Response Data:', res);
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err: any) => {
        console.error('Error fetching commissions:', err);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}