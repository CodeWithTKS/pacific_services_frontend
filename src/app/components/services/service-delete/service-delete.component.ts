import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-service-delete',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './service-delete.component.html',
  styleUrl: './service-delete.component.css'
})
export class ServiceDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<ServiceDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
