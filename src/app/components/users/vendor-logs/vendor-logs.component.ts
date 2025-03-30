import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { userService } from '../../../services/user.service';

@Component({
  selector: 'app-vendor-logs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatPaginatorModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatSortModule],
  templateUrl: './vendor-logs.component.html',
  styleUrl: './vendor-logs.component.css'
})
export class VendorLogsComponent implements OnInit, AfterViewInit {
  vendorList: any[] = [];
  displayedColumns: string[] = [
    'id',
    'vendorName',
    'BeforeBalance',
    'balance',
    'type',
    'AfterBalance',
    'CreatedAt',
  ];

  dataSource = new MatTableDataSource<any>([]);
  dataForExcel: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  id: string | null = null;

  constructor(private userService: userService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.getVendorLogsById(this.id);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;
  }

  getVendorLogsById(id: any) {
    this.userService.getVendorLogsById(id).subscribe({
      next: (res: any) => {
       
        this.dataSource.data = res;
        this.vendorList = res;
      },
      error: (err: any) => {
        console.error('Error fetching vendors:', err);
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

}
