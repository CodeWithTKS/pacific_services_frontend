import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-buy-subcription-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatCardModule],
  templateUrl: './buy-subcription-dialog.component.html',
  styleUrl: './buy-subcription-dialog.component.css'
})
export class BuySubcriptionDialogComponent {
  constructor(public dialogRef: MatDialogRef<BuySubcriptionDialogComponent>) { }

  choose(option: string) {
    this.dialogRef.close(option); // return the selected option
  }
  close(){
    this.dialogRef.close()
  }
}
