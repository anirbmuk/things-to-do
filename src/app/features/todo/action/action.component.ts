import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { GroupBy } from '@types';

const MATERIAL_MODULES = [MatButtonToggleModule] as const;

function toBoolean(value: string | boolean | null): boolean {
  return value !== null && `${value}` !== 'false';
}

@Component({
  standalone: true,
  imports: [...MATERIAL_MODULES],
  selector: 'ttd-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionComponent {
  @Input({ required: true, transform: toBoolean }) showAll:
    | string
    | boolean
    | null = false;
  @Input({ required: true }) groupBy: GroupBy | null = 'day';

  @Output() toggleShowAll = new EventEmitter<boolean>();
  @Output() toggleGroupBy = new EventEmitter<GroupBy>();

  onToggleShowAll() {
    this.toggleShowAll.emit(!this.showAll);
  }

  onToggleGroupBy() {
    this.toggleGroupBy.emit(this.groupBy === 'day' ? 'month' : 'day');
  }
}
