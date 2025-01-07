import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MoneyTransferService } from '../../services/moneyTransfer.service';
import { portalService } from '../../services/portal.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalPortals: number = 0;
  totalBalance: number = 0;
  totalWithTransaction: number = 0;
  overallTotal: number = 0;
  portalList: any[] = [];

  constructor(private portalService: portalService,
    private moneyService: MoneyTransferService
  ) { }

  ngOnInit(): void {
    this.getPortalStats();
    this.GetPortals();
    this.getMoneyTransferStats();
  }

  getPortalStats() {
    this.portalService.getPortalStats().subscribe({
      next: (res: any) => {
        this.totalPortals = res.totalPortals;
        this.totalBalance = res.totalBalance;
      }
    })
  }

  GetPortals() {
    this.portalService.GetPortals().subscribe({
      next: (res: any) => {
        console.log(res);
        
        this.portalList = res;
      }
    })
  }

  getMoneyTransferStats() {
    this.moneyService.getMoneyTransferStats().subscribe({
      next: (res: any) => {
        this.totalWithTransaction = res.totalWithTransaction;
        this.overallTotal = res.overallTotal;
      }
    })
  }
}
