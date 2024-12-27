import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-commission-delete',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './commission-delete.component.html',
  styleUrl: './commission-delete.component.css'
})
export class CommissionDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<CommissionDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
