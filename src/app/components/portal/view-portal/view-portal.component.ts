import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { portalService } from '../../../services/portal.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-portal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatPaginatorModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatSortModule],
  templateUrl: './view-portal.component.html',
  styleUrl: './view-portal.component.css'
})
export class ViewPortalComponent implements OnInit, AfterViewInit {
  portalList: any[] = [];
  displayedColumns: string[] = [
    'PortalID',
    'PortalName',
    'BeforeBalance',
    'balance',
    'type',
    'transactionType',
    'AfterBalance',
    'CreatedAt',
  ];

  dataSource = new MatTableDataSource<any>([]);
  dataForExcel: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  id: string | null = null;

  constructor(private portalService: portalService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.getPortalLogsById(this.id);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;
  }

  getPortalLogsById(id: any) {
    this.portalService.getPortalLogsById(id).subscribe({
      next: (res: any) => {
        console.log('Response Data:', res);
        this.dataSource.data = res;
        this.portalList = res;
      },
      error: (err: any) => {
        console.error('Error fetching portals:', err);
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
