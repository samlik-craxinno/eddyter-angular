import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { EddyterAngularComponent } from 'richtext-core-angular';
import { EDDYTER_API_KEY } from '../../../core/config/eddyter-api-key';
import { createLifecycleHandlers } from '../../../core/lifecycle/create-lifecycle-handlers';

@Component({
  selector: 'app-modal-editor-content',
  imports: [EddyterAngularComponent],
  templateUrl: './modal-editor-content.component.html',
  styleUrl: './modal-editor-content.component.css',
})
export class ModalEditorContentComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly toolbarMode = input<'sticky' | 'static'>('sticky');
  readonly maxHeight = input('320px');
  readonly lifecycleEvent = output<'mounted' | 'destroyed'>();

  protected readonly apiKey = EDDYTER_API_KEY;
  protected readonly content = signal(
    '<p>Editor initialized when the modal opened.</p>',
  );

  protected readonly lifecycle = createLifecycleHandlers('ModalEditor');

  protected toolbarConfig() {
    return this.toolbarMode() === 'sticky'
      ? { mode: 'sticky' as const, offset: 10, zIndex: 1000 }
      : { mode: 'static' as const };
  }

  ngOnInit(): void {
    this.lifecycleEvent.emit('mounted');
    this.destroyRef.onDestroy(() => {
      this.lifecycleEvent.emit('destroyed');
    });
  }

  protected onContentChange(html: string): void {
    this.content.set(html);
    this.lifecycle.onChange(html);
  }
}
