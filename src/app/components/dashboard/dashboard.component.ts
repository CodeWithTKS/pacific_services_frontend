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

  constructor(private portalService: portalService,
    private moneyService: MoneyTransferService
  ) { }

  ngOnInit(): void {
    this.getPortalStats();
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

  getMoneyTransferStats() {
    this.moneyService.getMoneyTransferStats().subscribe({
      next: (res: any) => {
        this.totalWithTransaction = res.totalWithTransaction;
        this.overallTotal = res.overallTotal;
      }
    })
  }
}
