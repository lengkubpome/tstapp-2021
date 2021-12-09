import { InteractivityChecker } from "@angular/cdk/a11y";
import { Component, HostListener, OnInit, Renderer2 } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NbDialogRef } from "@nebular/theme";

@Component({
	selector: "app-contact-form",
	templateUrl: "./contact-form.component.html",
	styleUrls: ["./contact-form.component.scss"],
})
export class ContactFormComponent implements OnInit {
	taxIdForm: FormGroup;

	@HostListener("keyup", ["$event"])
	onKeyupHandler(event): void {
		if (
			event.target.name === "taxIdChar" &&
			((event.keyCode >= 48 && event.keyCode <= 57) ||
				(event.keyCode >= 96 && event.keyCode <= 105))
		) {
			const ctrls = Object.keys(this.taxIdForm.controls);
			const nextIndex = ctrls.indexOf(event.target.id) + 1;
			// เลขประจำตัว 13 หลัก
			if (nextIndex < 13) {
				this.taxIdForm.get(event.target.id).setValue(event.key);
				const nextId = "#" + ctrls[nextIndex];
				this.renderer.selectRootElement(nextId).focus();
			} else {
				// เลขตัวท้าย
				this.taxIdForm.get("tax_13").setValue(event.key);
			}
		}
	}

	@HostListener("keydown", ["$event"])
	onKeydownHandler(event): void {
		if (event.target.name === "taxIdChar") {
			// reject "e"
			if (event.keyCode === 69) {
				event.preventDefault();
			}
			// case backspace
			if (event.keyCode === 8) {
				console.log(event.key);

				const clrlValue = this.taxIdForm.get(event.target.id).value;
				if (!clrlValue || clrlValue !== "Backspace") {
					const ctrls = Object.keys(this.taxIdForm.controls);
					const prevIndex = ctrls.indexOf(event.target.id) - 1;
					if (prevIndex > -1) {
						const prevId = "#" + ctrls[prevIndex];
						this.renderer.selectRootElement(prevId).focus();
					}
				}
			}
			// case <- left arrow
			if (event.keyCode === 37) {
				const ctrls = Object.keys(this.taxIdForm.controls);
				const prevIndex = ctrls.indexOf(event.target.id) - 1;
				if (prevIndex > -1) {
					const prevId = "#" + ctrls[prevIndex];
					this.renderer.selectRootElement(prevId).focus();
				}
			}
			// case -> right arrow
			if (event.keyCode === 39) {
				const ctrls = Object.keys(this.taxIdForm.controls);
				const prevIndex = ctrls.indexOf(event.target.id) + 1;
				if (prevIndex < 13) {
					const prevId = "#" + ctrls[prevIndex];
					this.renderer.selectRootElement(prevId).focus();
				}
			}
		}
	}

	@HostListener("keypress", ["$event"])
	onKeypressHandler(event): void {
		if (event.target.name === "taxIdChar") {
			event.preventDefault();
		}
	}

	constructor(
		protected ref: NbDialogRef<ContactFormComponent>,
		private formBuilder: FormBuilder,
		private renderer: Renderer2
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
