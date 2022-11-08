import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TodoService } from '../services';

@Component({
  selector: 'ttd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  showSearch = false;
  readonly searchString$ = this.todoService.searchString$;

  constructor(private readonly todoService: TodoService) {}

  updateSearchString(event: Event) {
    this.todoService.updateSearchString(
      (event?.target as HTMLInputElement)?.value
    );
  }

  resetSearch() {
    this.todoService.patchState({ searchString: null });
  }
}
