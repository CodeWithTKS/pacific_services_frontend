import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-money-delete',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './money-delete.component.html',
  styleUrl: './money-delete.component.css'
})
export class MoneyDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<MoneyDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
