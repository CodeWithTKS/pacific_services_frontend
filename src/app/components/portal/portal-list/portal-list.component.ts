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
import { portalService } from '../../../services/portal.service';
import { PortalDeleteComponent } from '../portal-delete/portal-delete.component';

@Component({
  selector: 'app-portal-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatPaginatorModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, RouterModule,
    MatSortModule, MatDialogModule],
  templateUrl: './portal-list.component.html',
  styleUrl: './portal-list.component.css'
})
export class PortalListComponent implements OnInit, AfterViewInit {
  portalList: any[] = [];
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

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private portalService: portalService,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.GetPortals();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;
  }

  GetPortals() {
    this.portalService.GetPortals().subscribe({
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

  editPortal(portal: any) {
    this.router.navigate([`/admin/portal/editportal/${portal.PortalID}`], {
      state: { portalData: portal } // Pass portal data using state
    });
  }

  deleteItem(portalId: any): void {
    const dialogRef = this.dialog.open(PortalDeleteComponent, {
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
        this.portalService.DeletePortal(portalId).subscribe({
          next: (response) => {
            this.GetPortals();
            console.log('Portal deleted successfully:', response);
            // Optionally refresh the list or navigate
          },
          error: (error) => {
            console.error('Error deleting portal:', error);
          }
        });
      } else {
        console.log('Delete cancelled');
      }
    });
  }
}