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
import { portalService } from '../../../services/portal.service';

@Component({
  selector: 'app-portal-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatPaginatorModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatButtonModule],
  templateUrl: './portal-list.component.html',
  styleUrl: './portal-list.component.css'
})
export class PortalListComponent implements OnInit {
  displayedColumns: string[] = [
    'PortalID',
    'Name',
    'Code',
    'ContactNo',
    'ContactPerson',
    'Email',
    'Balance',
    'CreatedAt',
    'Action',
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private portalService: portalService, private router: Router) { }

  ngOnInit(): void {
    this.GetPortals();
  }

  GetPortals() {
    this.portalService.GetPortals().subscribe({
      next: (res: any) => {
        console.log('Response Data:', res);
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err: any) => {
        console.error('Error fetching portals:', err);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}