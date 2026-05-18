import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  output,
  signal,
} from '@angular/core';
import { EddyterAngularComponent } from 'richtext-core-angular';
import { EDDYTER_API_KEY } from '../../../core/config/eddyter-api-key';
import { createLifecycleHandlers } from '../../../core/lifecycle/create-lifecycle-handlers';
import type { LifecycleLogFn } from '../../../core/lifecycle/lifecycle.types';
import type { LifecyclePhase } from '../../../core/lifecycle/lifecycle.types';

@Component({
  selector: 'app-lifecycle-editor-host',
  imports: [EddyterAngularComponent],
  templateUrl: './lifecycle-editor-host.component.html',
  styleUrl: './lifecycle-editor-host.component.css',
})
export class LifecycleEditorHostComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly hostMounted = output<void>();
  readonly hostUnmounting = output<void>();
  readonly editorLog = output<{ phase: LifecyclePhase; detail?: string }>();

  protected readonly apiKey = EDDYTER_API_KEY;
  protected readonly content = signal(
    '<p>Editor inside dynamic host — toggle visibility or recreate to test lifecycle.</p>',
  );

  protected readonly lifecycle: ReturnType<typeof createLifecycleHandlers>;

  constructor() {
    const onLog: LifecycleLogFn = (phase, detail) => {
      this.editorLog.emit({ phase, detail });
    };
    this.lifecycle = createLifecycleHandlers('LifecycleEditor', onLog);
  }

  ngOnInit(): void {
    this.hostMounted.emit();
    this.destroyRef.onDestroy(() => {
      this.hostUnmounting.emit();
    });
  }

  protected onContentChange(html: string): void {
    this.content.set(html);
    this.lifecycle.onChange(html);
  }
}
