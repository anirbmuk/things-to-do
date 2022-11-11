import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { take } from 'rxjs';

@Component({
  selector: 'ttd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  constructor(
    private readonly update: SwUpdate,
    // eslint-disable-next-line @typescript-eslint/ban-types
    @Inject(PLATFORM_ID) readonly platformId: Object,
    @Inject(DOCUMENT) readonly document: Document
  ) {}

  ngOnInit(): void {
    this.update.versionUpdates.pipe(take(1)).subscribe(async () => {
      try {
        await this.update.activateUpdate();
        this.document.location.reload();
      } catch (err) {
        console.error('[AppComponent] [ngOnInit] [versionUpdates]', err);
      }
    });
  }
}
