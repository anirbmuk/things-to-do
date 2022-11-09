import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { StoreService } from '../store/store.service';

@Component({
  selector: 'ttd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @ViewChild('searchField') searchField?: ElementRef<HTMLInputElement>;
  showSearch = false;
  readonly searchString$ = this.todoStore.searchString$;

  constructor(private readonly todoStore: StoreService) {}

  updateSearchString(event: Event) {
    this.todoStore.updateSearchString(
      (event?.target as HTMLInputElement)?.value
    );
  }

  displaySearch() {
    this.showSearch = !this.showSearch;
    setTimeout(() => this.searchField?.nativeElement?.focus(), 0);
  }

  resetSearch() {
    this.todoStore.patchState({ searchString: null });
  }

  addTodo() {
    const time = `${Math.random() * 100}`.slice(-2);
    this.todoStore.addTodo({
      heading: 'New ' + time,
      text: 'Created from app',
      duedate: `2022-11-13 15:${time}:00`
    });
  }
}
