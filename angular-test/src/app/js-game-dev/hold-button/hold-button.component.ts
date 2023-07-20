import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "hold-button",
  templateUrl: "./hold-button.component.html",
})
export class HoldButtonComponent {
  @Input() icon!: string;

  @Output() heldDown = new EventEmitter();
  @Output() released = new EventEmitter();

  onButtonHold() {
    this.heldDown.emit();
  }

  onButtonRelease() {
    this.released.emit();
  }
}
