import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTodo, UpdateTodo } from '@types';
import { Observable, take } from 'rxjs';
import {
  ConfirmDialogComponent,
  CreateUpdateDialogComponent
} from './modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private readonly dialog = inject(MatDialog);

  showConfirmDialog(message: string): Observable<{ decision: boolean }> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '22rem',
      maxWidth: '22rem',
      disableClose: true,
      data: { message }
    });
    return dialogRef.afterClosed().pipe(take(1));
  }

  showCreateUpdateDialog(
    mode: 'create' | 'update',
    todo?: UpdateTodo
  ): Observable<{ decision: boolean; output?: AddTodo | UpdateTodo }> {
    const dialogRef = this.dialog.open(CreateUpdateDialogComponent, {
      width: '22rem',
      maxWidth: '22rem',
      disableClose: true,
      data: {
        mode,
        ...(todo && { todo })
      }
    });
    return dialogRef.afterClosed().pipe(take(1));
  }
}
