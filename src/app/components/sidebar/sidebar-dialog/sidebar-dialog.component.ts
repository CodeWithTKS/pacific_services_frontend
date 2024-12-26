import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, RouterModule],
  templateUrl: './sidebar-dialog.component.html',
  styleUrl: './sidebar-dialog.component.css'
})
export class SidebarDialogComponent implements OnInit {

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<SidebarDialogComponent> // Inject MatDialogRef to close dialog
  ) { }

  ngOnInit(): void {
    // Listen to router navigation events and close the dialog
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.dialogRef.close();  // Close the dialog when navigation ends
      }
    });

    const userData = localStorage.getItem('user');

    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const user = parsedData?.data?.user;
        console.log(user?.user);
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
      }
    } else {
      console.error('User data not found in localStorage.');
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

}
