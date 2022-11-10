import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITodo } from '../models';

@Component({
  templateUrl: './confirm-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent implements OnInit {
  message: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string | undefined }
  ) {}

  ngOnInit() {
    this.message =
      this.data.message ||
      `Are you sure you want to continue with this operation?`;
  }

  onDialogAction(): void {
    this.dialogRef.close({ decision: true });
  }

  closeModal(): void {
    this.dialogRef.close({ decision: false });
  }
}

@Component({
  templateUrl: './create-update-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateUpdateDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: 'create' | 'update'; todo?: ITodo }
  ) {}

  onDialogAction(): void {
    this.dialogRef.close({ decision: true });
  }

  closeModal(): void {
    this.dialogRef.close({ decision: false });
  }
}
