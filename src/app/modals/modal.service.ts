import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, take } from 'rxjs';
import { ConfirmDialogComponent } from './modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  showConfirmDialog(message: string): Observable<{ decision: boolean }> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '22rem',
      maxWidth: '22rem',
      disableClose: true,
      data: { message }
    });
    return dialogRef.afterClosed().pipe(take(1));
  }
}
