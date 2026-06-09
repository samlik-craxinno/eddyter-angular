import { Component, OnInit, input, signal } from '@angular/core';
import { EddyterAngularComponent } from '@eddyter/angular';
import { EDDYTER_API_KEY } from '../../../core/config/eddyter-api-key';
import { createLifecycleHandlers } from '../../../core/lifecycle/create-lifecycle-handlers';

@Component({
  selector: 'app-editor-slot',
  imports: [EddyterAngularComponent],
  templateUrl: './editor-slot.component.html',
  styleUrl: './editor-slot.component.css',
})
export class EditorSlotComponent implements OnInit {
  readonly label = input.required<string>();
  readonly slotId = input.required<string>();
  readonly initialHtml = input.required<string>();
  readonly maxHeight = input('280px');

  protected readonly apiKey = EDDYTER_API_KEY;
  protected readonly html = signal('');

  protected lifecycle = createLifecycleHandlers('MultiEditors');

  ngOnInit(): void {
    this.html.set(this.initialHtml());
    this.lifecycle = createLifecycleHandlers(`MultiEditors:${this.slotId()}`);
  }

  protected onContentChange(value: string): void {
    this.html.set(value);
    this.lifecycle.onChange(value);
  }
}
