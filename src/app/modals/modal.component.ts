import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ITodo } from '../models';
import { AddTodo, UpdateTodo } from '../types';
import { DateService } from './../services/date.service';

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
export class CreateUpdateDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CreateUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: 'create' | 'update'; todo?: ITodo },
    private readonly formBuilder: FormBuilder,
    private readonly dateService: DateService
  ) {}

  createUpdateForm = this.formBuilder.group({});
  editable = true;

  ngOnInit() {
    this.editable =
      this.data.mode === 'create' || this.data.todo?.status === 'Incomplete';
    const duedateValue = this.dateService.getCurrentFormDateTime(
      this.data.todo?.duedate as string | undefined
    );
    this.createUpdateForm = this.formBuilder.group({
      heading: new FormControl(
        { value: this.data.todo?.heading, disabled: !this.editable },
        [Validators.required]
      ),
      text: new FormControl({
        value: this.data.todo?.text,
        disabled: !this.editable
      }),
      duedate: new FormControl(
        { value: duedateValue, disabled: !this.editable },
        [Validators.required, this.checkMinDate.bind(this)]
      )
    });
  }

  onDialogAction(): void {
    if (this.createUpdateForm?.valid) {
      let output: AddTodo | UpdateTodo;
      if (this.data.mode === 'create') {
        output = {
          heading: this.createUpdateForm?.value.heading,
          text: this.createUpdateForm?.value.text,
          duedate: this.dateService.getStorageFormDateTime(
            this.createUpdateForm?.value.duedate
          )
        } as AddTodo;
        this.dialogRef.close({ decision: true, output });
      } else if (this.data.mode === 'update' && this.createUpdateForm?.dirty) {
        output = {
          heading: this.createUpdateForm?.value.heading,
          text: this.createUpdateForm?.value.text,
          duedate: this.dateService.getStorageFormDateTime(
            this.createUpdateForm?.value.duedate
          ),
          status: 'Incomplete'
        } as UpdateTodo;
        this.dialogRef.close({ decision: true, output });
      } else {
        this.closeModal();
      }
    }
  }

  closeModal(): void {
    this.dialogRef.close({ decision: false });
  }

  private checkMinDate(control: FormControl): { [s: string]: boolean } | null {
    const dateString = control.value;
    const minDate = this.dateService.getMinDate();
    if (+new Date(dateString) < +new Date(minDate)) {
      return { mindate: true };
    }
    return null;
  }
}
