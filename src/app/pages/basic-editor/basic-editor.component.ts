import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EddyterAngularComponent } from '@eddyter/angular';
import { EDDYTER_API_KEY } from '../../core/config/eddyter-api-key';
import { createLifecycleHandlers } from '../../core/lifecycle/create-lifecycle-handlers';
const STORAGE_TITLE = 'basic-editor:title';
const STORAGE_HTML = 'basic-editor:html';
const STORAGE_DARK = 'basic-editor:dark';

@Component({
  selector: 'app-basic-editor',
  imports: [FormsModule, EddyterAngularComponent],
  templateUrl: './basic-editor.component.html',
  styleUrl: './basic-editor.component.css',
})
export class BasicEditorComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly apiKey = EDDYTER_API_KEY;
  protected readonly title = signal(this.loadTitle());
  protected readonly content = signal(this.loadHtml());
  protected readonly isDark = signal(this.loadDarkMode());
  protected readonly lastSaved = signal<Date | null>(null);

  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly lifecycle = createLifecycleHandlers('BasicEditor');

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => {
      if (this.saveTimer !== null) {
        clearTimeout(this.saveTimer);
      }
      this.persist();
    });
  }

  protected onTitleChange(value: string): void {
    this.title.set(value);
    this.scheduleAutosave();
  }

  protected onContentChange(html: string): void {
    this.content.set(html);
    this.lifecycle.onChange(html);
    this.scheduleAutosave();
  }

  protected toggleDarkMode(): void {
    this.isDark.update((dark) => !dark);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_DARK, String(this.isDark()));
    }
  }

  private loadDarkMode(): boolean {
    if (typeof localStorage === 'undefined') return true;
    const stored = localStorage.getItem(STORAGE_DARK);
    if (stored !== null) return stored === 'true';
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private loadTitle(): string {
    if (typeof localStorage === 'undefined') return '';
    return localStorage.getItem(STORAGE_TITLE) ?? '';
  }

  private loadHtml(): string {
    if (typeof localStorage === 'undefined') return '<p></p>';
    return localStorage.getItem(STORAGE_HTML) ?? '<p></p>';
  }

  private persist(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_TITLE, this.title());
    localStorage.setItem(STORAGE_HTML, this.content());
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
