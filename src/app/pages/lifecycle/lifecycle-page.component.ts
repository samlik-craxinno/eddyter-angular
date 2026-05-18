import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { LifecycleEditorHostComponent } from './lifecycle-editor-host/lifecycle-editor-host.component';
import type { LifecyclePhase } from '../../core/lifecycle/lifecycle.types';

@Component({
  selector: 'app-lifecycle-page',
  imports: [LifecycleEditorHostComponent],
  templateUrl: './lifecycle-page.component.html',
  styleUrl: './lifecycle-page.component.css',
})
export class LifecyclePageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly visible = signal(true);
  protected readonly editorKey = signal(0);
  protected readonly mountCount = signal(0);
  protected readonly destroyCount = signal(0);
  protected readonly logs = signal<string[]>([]);

  ngOnInit(): void {
    this.pushLog('[Lifecycle] page onInit');
    this.destroyRef.onDestroy(() => {
      this.pushLog('[Lifecycle] page onDestroy');
    });
  }

  protected showEditor(): void {
    this.visible.set(true);
  }

  protected hideEditor(): void {
    this.visible.set(false);
  }

  protected recreateEditor(): void {
    this.editorKey.update((k) => k + 1);
  }

  protected onHostMounted(): void {
    this.mountCount.update((n) => n + 1);
    this.pushLog(
      `[Lifecycle] editor host mounted (total mounts: ${this.mountCount()})`,
    );
  }

  protected onHostUnmounting(): void {
    this.destroyCount.update((n) => n + 1);
    this.pushLog(
      `[Lifecycle] editor host onDestroy (total destroys: ${this.destroyCount()})`,
    );
  }

  protected onEditorLog(event: { phase: LifecyclePhase; detail?: string }): void {
    const { phase, detail } = event;
    if (detail === undefined) {
      this.pushLog(`[Lifecycle] ${phase}`);
    } else {
      this.pushLog(`[Lifecycle] ${phase} (${detail})`);
    }
  }

  protected reversedLogs(): string[] {
    return [...this.logs()].reverse();
  }

  private pushLog(line: string): void {
    const stamp = new Date().toISOString().slice(11, 23);
    this.logs.update((entries) =>
      [...entries, `${stamp}  ${line}`].slice(-200),
    );
  }
}
