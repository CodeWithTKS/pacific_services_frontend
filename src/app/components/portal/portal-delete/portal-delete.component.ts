import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-portal-delete',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './portal-delete.component.html',
  styleUrl: './portal-delete.component.css'
})
export class PortalDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<PortalDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
