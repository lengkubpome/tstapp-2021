import { InteractivityChecker } from "@angular/cdk/a11y";
import {
	Component,
	ElementRef,
	HostListener,
	OnInit,
	ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NbDialogRef } from "@nebular/theme";

@Component({
	selector: "app-contact-form",
	templateUrl: "./contact-form.component.html",
	styleUrls: ["./contact-form.component.scss"],
})
export class ContactFormComponent implements OnInit {
	@ViewChild("taxForm") tFormRef: ElementRef;

	taxIdForm: FormGroup;

	// @HostListener("keyup", ["$event"])
	// onKeyupHandler(event): void {
	// 	if (
	// 		event.target.name === "taxIdChar" &&
	// 		((event.keyCode >= 48 && event.keyCode <= 57) ||
	// 			(event.keyCode >= 96 && event.keyCode <= 105))
	// 	) {
	// 		// 0-9 only
	// 		console.log(event.target.name);
	// 	}
	// }

	@HostListener("keydown", ["$event"])
	onKeydownHandler(event): void {
		if (event.target.name === "taxIdChar") {
			// 0-9 only
			if (
				(event.keyCode >= 48 && event.keyCode <= 57) ||
				(event.keyCode >= 96 && event.keyCode <= 105)
			) {
				// next input
				this.nextInputTaxIdFocus(event.target.id);
			} else {
				event.preventDefault();
			}
		}
	}

	nextInputTaxIdFocus(currentId): void {
		const ctrls = Object.keys(this.taxIdForm.controls);
		const nextCtrl = ctrls.indexOf(currentId) + 1;
		this.taxIdForm.get(nextCtrl).naviveElement.focut();
		console.log(nextCtrl);

		const control = this.tFormRef.nativeElement[ctrls[nextCtrl]];
		// console.log(control);

		// const c = this.taxFormRef.nativeElement[ctrls[2]];
		// this.interactivityChecker.isFocusable(c);

		// for (let key = ctrls.indexOf(currentId) + 1; key < ctrls.length; key++) {
		// 	// console.log(key);
		// 	const control = this.taxFormRef.nativeElement[ctrls[key]];

		// 	if (control && this.interactivityChecker.isFocusable(control)) {
		// 		control.focus();
		// 		control.select();
		// 		break;
		// 	}
		// }
	}

	constructor(
		protected ref: NbDialogRef<ContactFormComponent>,
		private formBuilder: FormBuilder,
		private interactivityChecker: InteractivityChecker
	) {}

	ngOnInit(): void {
		this.taxIdForm = this.formBuilder.group({
			tax_1: [""],
			tax_2: [""],
			tax_3: [""],
			tax_4: [""],
			tax_5: [""],
			tax_6: [""],
			tax_7: [""],
			tax_8: [""],
			tax_9: [""],
			tax_10: [""],
			tax_11: [""],
			tax_12: [""],
			tax_13: [""],
		});
	}
}
