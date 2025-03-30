import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SidebarDialogComponent } from './sidebar-dialog/sidebar-dialog.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  isScrollToTopVisible = false;

  constructor(private dialog: MatDialog,) { }

  ngOnInit(): void { }

  // Listen to scroll events on the window
  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrollToTopVisible = scrollPosition > 100; // Show button after 200px scroll
  }

  // Scroll to top function
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  openViewDialog(): void {
    const dialogRef = this.dialog.open(SidebarDialogComponent, {
      width: '300px',
      height: '100%',
      position: {
        left: '0',
        top: '0'
      },
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}