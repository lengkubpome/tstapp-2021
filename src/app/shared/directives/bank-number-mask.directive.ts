import { Directive, HostListener, Input } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
	selector: "[formControlName][appBankNumberMask]",
})
export class BankNumberMaskDirective {
	@Input() bankMask = "";
	constructor(public ngControl: NgControl) {}

	@HostListener("ngModelChange", ["$event"])
	onModelChange(event): void {
		this.onInputChange(event, false);
	}

	@HostListener("keydown.backspace", ["$event"])
	keydownBackspace(event): void {
		this.onInputChange(event.target.value, true);
	}

	onInputChange(event, backspace): void {
		let newVal = event.replace(/\D/g, "");
		// if (backspace && newVal.length <= 6) {
		// 	console.log("%cBankNumberMaskDirective", "color:red; font-size:20px"),
		// 		(newVal = newVal.substring(0, newVal.length - 1));
		// }
		if (newVal.length === 0) {
			newVal = "";
		} else if (newVal.length <= 3) {
			newVal = newVal.replace(/^(\d{0,3})/, "$1");
		} else if (newVal.length <= 4) {
			newVal = newVal.replace(/^(\d{0,3})(\d{0,1})/, "$1-$2");
		} else if (newVal.length <= 9) {
			newVal = newVal.replace(/^(\d{0,3})(\d{0,1})(\d{0,5})/, "$1-$2-$3");
		} else if (newVal.length <= 10) {
			if (this.bankMask !== "pp") {
				newVal = newVal.replace(
					/^(\d{0,3})(\d{0,1})(\d{0,5})(\d{0,1})/,
					"$1-$2-$3-$4"
				);
			} else {
				newVal = newVal.replace(/^(\d{0,10})/, "$1");
			}
		} else {
			newVal = newVal.substring(0, 13);
			newVal = newVal.replace(/^(\d{0,13})/, "$1");
		}
		this.ngControl.valueAccessor.writeValue(newVal);
	}
}
