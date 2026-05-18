import { Component } from '@angular/core';
import { EditorSlotComponent } from './editor-slot/editor-slot.component';

@Component({
  selector: 'app-multi-editors',
  imports: [EditorSlotComponent],
  templateUrl: './multi-editors.component.html',
  styleUrl: './multi-editors.component.css',
})
export class MultiEditorsComponent {}
