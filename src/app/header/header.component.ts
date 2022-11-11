import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
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
  readonly showActionButtons$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(event => (event as NavigationEnd)?.url === '/')
  );

  constructor(
    private readonly todoStore: StoreService,
    private readonly router: Router
  ) {}

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
    this.todoStore.addTodoModal();
  }
}
