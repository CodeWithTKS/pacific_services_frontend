import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { portalService } from '../../services/portal.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  portalList: any[] = [];

  constructor(private portalService: portalService,) { }

  ngOnInit(): void {
    this.GetPortals();
  }

  GetPortals() {
    this.portalService.GetPortals().subscribe({
      next: (res: any) => {
        console.log(res);

        this.portalList = res;
      }
    })
  }
}
