import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { ITodo } from '@models';
import { DateService } from '@services';
import { AddTodo, UpdateTodo } from '@types';

const CORE_MODULES = [CommonModule, ReactiveFormsModule];
const MATERIAL_MODULES = [MatDialogModule, MatButtonModule] as const;

@Component({
  standalone: true,
  imports: [...MATERIAL_MODULES],
  templateUrl: './confirm-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent implements OnInit {
  message: string | undefined;

  readonly data: { message: string | undefined } = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  ngOnInit() {
    this.message =
      this.data.message ||
      'Are you sure you want to continue with this operation?';
  }

  onDialogAction(): void {
    this.dialogRef.close({ decision: true });
  }

  closeModal(): void {
    this.dialogRef.close({ decision: false });
  }
}

@Component({
  standalone: true,
  imports: [...CORE_MODULES, ...MATERIAL_MODULES],
  templateUrl: './create-update-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateUpdateDialogComponent implements OnInit {
  readonly data: { mode: 'create' | 'update'; todo?: ITodo } =
    inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  private readonly formBuilder = inject(FormBuilder);
  private readonly dateService = inject(DateService);

  createUpdateForm?: FormGroup<{
    heading: FormControl<string | null | undefined>;
    text: FormControl<string | null | undefined>;
    duedate: FormControl<string | null | undefined>;
  }>;
  editable = true;

  ngOnInit() {
    this.editable =
      this.data.mode === 'create' || this.data.todo?.status === 'Incomplete';
    const duedateValue = this.dateService.getCurrentFormDateTime(
      this.data.todo?.duedate as string | undefined
    );
    this.createUpdateForm = new FormGroup({
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
