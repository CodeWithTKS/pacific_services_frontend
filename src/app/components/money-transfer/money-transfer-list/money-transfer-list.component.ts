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
import { MoneyTransferService } from '../../../services/moneyTransfer.service';

@Component({
  selector: 'app-money-transfer-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatPaginatorModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatButtonModule],
  templateUrl: './money-transfer-list.component.html',
  styleUrl: './money-transfer-list.component.css'
})
export class MoneyTransferListComponent implements OnInit {
  displayedColumns: string[] = [
    'TransferID',
    'TransactionNo',
    'portalId',
    'ACNo',
    'FirstName',
    'LastName',
    'TransactionType',
    'Type',
    'Date',
    'TotalCash',
    'CollectionAmt',
    'SalasarFixedAmt',
    'BankCharge',
    'SalasarCharge',
    'SalasarExtra',
    'BankDeposit',
    'CustDeposit',
    'Action',
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private moneyTransferService: MoneyTransferService, private router: Router) { }

  ngOnInit(): void {
    this.GetMoneyTransfers();
  }

  GetMoneyTransfers() {
    this.moneyTransferService.GetMoneyTransfers().subscribe({
      next: (res: any) => {
        console.log('Response Data:', res);
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err: any) => {
        console.error('Error fetching money transfers:', err);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}