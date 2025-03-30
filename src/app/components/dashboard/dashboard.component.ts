import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { portalService } from '../../services/portal.service';
import { Color, LegendPosition, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule,
    MatPaginatorModule, MatTableModule, MatSortModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  salesData: any[] = [];
  portalList: any[] = [];
  // Chart options
  showLegend = true;
  showLabels = true;
  isDoughnut = false;
  gradient = false;
  explodeSlices = false;
  legendPosition: LegendPosition = LegendPosition.Right;

  // Color scheme
  colorScheme = {
    name: 'professional',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#6366F1', '#14B8A6'],
  };

  displayedColumns: string[] = [
    'fullname',
    'CollectionAmt',
    'ContactNo',
    'created_at',
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private portalService: portalService,) { }

  ngOnInit(): void {
    this.GetPortals();
    this.GethighlightEntry();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;
  }
  GetPortals() {
    this.portalService.GetPortals().subscribe({
      next: (res: any) => {
        this.salesData = res.map((item: any) => ({
          name: `${item.Name}`,
          value: Number(item.Balance), // Convert Balance to a number
        }));
      }
    });
  }

  GethighlightEntry() {
    this.portalService.GethighlightEntry().subscribe({
      next: (res: any) => {
        this.dataSource.data = res;
      }
    })
  }
}
