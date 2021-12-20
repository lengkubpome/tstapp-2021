import { Directive } from "@angular/core";
import { ControlValueAccessor, NgControl } from "@angular/forms";

@Directive({ selector: "[appInputRef]" })
export class InputRefDirective {
	constructor(private ngControl: NgControl) {
		trimValueAccessor(ngControl.valueAccessor);
	}
}

function trimValueAccessor(valueAccessor: ControlValueAccessor): void {
	const original = valueAccessor.registerOnChange;

	console.log("Directive Input");

	valueAccessor.registerOnChange = (fn: (_: unknown) => void) => {
		return original.call(valueAccessor, (value: unknown) => {
			return fn(typeof value === "string" ? value.trim() : value);
		});
	};
}
