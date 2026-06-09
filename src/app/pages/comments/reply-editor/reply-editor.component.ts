import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { EddyterAngularComponent } from '@eddyter/angular';
import { EDDYTER_API_KEY } from '../../../core/config/eddyter-api-key';
import { createLifecycleHandlers } from '../../../core/lifecycle/create-lifecycle-handlers';
import type {
  LifecycleLogFn,
  LifecyclePhase,
} from '../../../core/lifecycle/lifecycle.types';

@Component({
  selector: 'app-reply-editor',
  imports: [EddyterAngularComponent],
  templateUrl: './reply-editor.component.html',
  styleUrl: './reply-editor.component.css',
})
export class ReplyEditorComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly postId = input.required<string>();
  readonly cancel = output<void>();
  readonly editorLifecycle = output<{ phase: LifecyclePhase; detail?: string }>();
  readonly hostLifecycle = output<'mounted' | 'destroyed'>();

  protected readonly apiKey = EDDYTER_API_KEY;
  protected readonly html = signal('<p></p>');
  protected readonly lastSaved = signal<Date | null>(null);

  protected lifecycle = createLifecycleHandlers('Reply');

  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    const saved = localStorage.getItem(this.draftKey());
    if (saved) {
      this.html.set(saved);
    }

    const onLog: LifecycleLogFn = (phase, detail) => {
      this.editorLifecycle.emit({ phase, detail });
    };
    this.lifecycle = createLifecycleHandlers(`Reply:${this.postId()}`, onLog);

    this.hostLifecycle.emit('mounted');
    this.destroyRef.onDestroy(() => {
      if (this.saveTimer !== null) {
        clearTimeout(this.saveTimer);
      }
      this.persist();
      this.hostLifecycle.emit('destroyed');
    });
  }

  protected onContentChange(value: string): void {
    this.html.set(value);
    this.lifecycle.onChange(value);
    this.scheduleAutosave();
  }

  protected onCancel(): void {
    this.cancel.emit();
  }

  protected hasPreviewContent(): boolean {
    return this.html().replace(/<[^>]*>/g, '').trim().length > 0;
  }

  private draftKey(): string {
    return `comments:draft:${this.postId()}`;
  }

  private persist(): void {
    localStorage.setItem(this.draftKey(), this.html());
    this.lastSaved.set(new Date());
  }

  private scheduleAutosave(): void {
    if (this.saveTimer !== null) {
      clearTimeout(this.saveTimer);
    }
    this.saveTimer = setTimeout(() => {
      this.persist();
      this.saveTimer = null;
    }, 400);
  }
}
