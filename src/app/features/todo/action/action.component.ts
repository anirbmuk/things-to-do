import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { GroupBy } from 'src/app/types';

@Component({
  selector: 'ttd-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionComponent {
  @Input() showAll: boolean | null = false;
  @Input() groupBy: GroupBy | null = 'day';

  @Output() toggleShowAll = new EventEmitter<boolean>();
  @Output() toggleGroupBy = new EventEmitter<GroupBy>();
  @Output() typeSearch = new EventEmitter<string | undefined | null>();

  onToggleShowAll() {
    this.toggleShowAll.emit(!this.showAll);
  }

  onToggleGroupBy() {
    this.toggleGroupBy.emit(this.groupBy === 'day' ? 'month' : 'day');
  }
}
