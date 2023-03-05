import { Component, Input, OnInit , Output, EventEmitter} from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-select-check-all',
  template: `
    <mat-checkbox class="mat-option"
                [disableRipple]="true"
                [indeterminate]="isIndeterminate()"
                [checked]="isChecked()"
                (click)="$event.stopPropagation()"
                (change)="toggleSelection($event)">
      {{text}}
    </mat-checkbox>
  `,
  styles: ['']
})
export class SelectCheckAllComponent implements OnInit {
  @Input() model: NgModel;
  @Input() values = [];
  @Input() text = 'Select All';
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    
  }

  isChecked(): boolean {
    return this.model.value && this.values.length
      && this.model.value.length === this.values.length;
  }

  isIndeterminate(): boolean {
    return this.model.value && this.values.length && this.model.value.length
      && this.model.value.length < this.values.length;
  }

  toggleSelection(change: MatCheckboxChange): void {
    debugger;
    if (change.checked) {
      this.model.update.emit(this.values);
    } else {
      //this.model.update.emit([]);
      this.model.update.emit("");
    }
    this.parentFun.emit();
  }
}
