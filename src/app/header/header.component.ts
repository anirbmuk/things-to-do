import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { TodoService } from '../services';

@Component({
  selector: 'ttd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @ViewChild('searchField') searchField?: ElementRef<HTMLInputElement>;
  showSearch = false;
  readonly searchString$ = this.todoService.searchString$;

  constructor(private readonly todoService: TodoService) {}

  updateSearchString(event: Event) {
    this.todoService.updateSearchString(
      (event?.target as HTMLInputElement)?.value
    );
  }

  displaySearch() {
    this.showSearch = !this.showSearch;
    setTimeout(() => this.searchField?.nativeElement?.focus(), 0);
  }

  resetSearch() {
    this.todoService.patchState({ searchString: null });
  }
}
