import {
  Component,
  DestroyRef,
  HostListener,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ModalEditorContentComponent } from './modal-editor-content/modal-editor-content.component';

const MAX_HEIGHT_OPTIONS = ['200px', '320px', '480px'] as const;

@Component({
  selector: 'app-modal-editor-page',
  imports: [ModalEditorContentComponent],
  templateUrl: './modal-editor-page.component.html',
  styleUrl: './modal-editor-page.component.css',
})
export class ModalEditorPageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly maxHeightOptions = MAX_HEIGHT_OPTIONS;

  protected readonly open = signal(false);
  protected readonly toolbarMode = signal<'sticky' | 'static'>('sticky');
  protected readonly maxHeight = signal<string>('320px');
  protected readonly mountCount = signal(0);
  protected readonly destroyCount = signal(0);
  protected readonly logs = signal<string[]>([]);
  protected readonly contentKey = signal(0);

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => {
      // no-op placeholder for symmetry with other pages
    });
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) {
      this.closeModal();
    }
  }

  protected setToolbarMode(mode: 'sticky' | 'static'): void {
    this.toolbarMode.set(mode);
    this.bumpContentKey();
  }

  protected setMaxHeight(value: string): void {
    this.maxHeight.set(value);
    this.bumpContentKey();
  }

  protected openModal(): void {
    this.open.set(true);
    this.pushLog('[Modal] opened — mounting editor');
  }

  protected closeModal(): void {
    this.open.set(false);
    this.pushLog('[Modal] closed — destroying editor');
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  protected onEditorLifecycle(event: 'mounted' | 'destroyed'): void {
    if (event === 'mounted') {
      this.mountCount.update((n) => n + 1);
      this.pushLog(`[Modal] Eddyter mounted (total: ${this.mountCount()})`);
    } else {
      this.destroyCount.update((n) => n + 1);
      this.pushLog(`[Modal] Eddyter destroyed (total: ${this.destroyCount()})`);
    }
  }

  protected reversedLogs(): string[] {
    return [...this.logs()].reverse();
  }

  protected editorConfigKey(): string {
    return `${this.toolbarMode()}-${this.maxHeight()}-${this.contentKey()}`;
  }

  private bumpContentKey(): void {
    if (this.open()) {
      this.contentKey.update((k) => k + 1);
    }
  }

  private pushLog(line: string): void {
    const stamp = new Date().toISOString().slice(11, 23);
    this.logs.update((entries) =>
      [...entries, `${stamp}  ${line}`].slice(-100),
    );
  }
}
