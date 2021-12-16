import { InteractivityChecker } from "@angular/cdk/a11y";
import { Component, HostListener, OnInit, Renderer2 } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { NbDialogRef } from "@nebular/theme";

@Component({
	selector: "app-contact-form",
	templateUrl: "./contact-form.component.html",
	styleUrls: ["./contact-form.component.scss"],
})
export class ContactFormComponent implements OnInit {
	contactForm: FormGroup;
	taxIdForm: FormGroup;
	branchCodeForm: FormGroup;

	bankOrder = 1;

	@HostListener("keyup", ["$event"])
	onKeyupHandler(event): void {
		const htmlName = event.target.name;
		if (htmlName === "taxIdChar" || htmlName === "branchCode") {
			// เลือก formbuilder
			let form: FormGroup;
			switch (htmlName) {
				case "taxIdChar":
					form = this.taxIdForm;
					break;
				case "branchCode":
					form = this.branchCodeForm;
					break;
			}

			const ctrls = Object.keys(form.controls);

			if (
				(event.keyCode >= 48 && event.keyCode <= 57) ||
				(event.keyCode >= 96 && event.keyCode <= 105)
			) {
				const nextIndex = ctrls.indexOf(event.target.id) + 1;
				if (nextIndex < ctrls.length) {
					form.get(event.target.id).setValue(event.key);
					const nextId = "#" + ctrls[nextIndex];
					this.renderer.selectRootElement(nextId).focus();
				} else {
					// เลขตัวท้าย
					form.get(event.target.id).setValue(event.key);
				}
			}
			// case backspace , <- left arrow
			if (event.keyCode === 8 || event.keyCode === 37) {
				form.get(event.target.id).setValue("");
				const prevIndex = ctrls.indexOf(event.target.id) - 1;
				if (prevIndex > -1) {
					const prevId = "#" + ctrls[prevIndex];
					this.renderer.selectRootElement(prevId).focus();
				}
			}

			// case -> right arrow
			if (event.keyCode === 39) {
				const nextIndex = ctrls.indexOf(event.target.id) + 1;
				if (nextIndex < ctrls.length) {
					const prevId = "#" + ctrls[nextIndex];
					this.renderer.selectRootElement(prevId).focus();
				}
			}
		}
	}

	@HostListener("keydown", ["$event"])
	onKeydownHandler(event): void {
		const htmlName = event.target.name;
		if (htmlName === "taxIdChar" || htmlName === "branchCode") {
			// reject "e"
			if (event.keyCode === 69) {
				event.preventDefault();
			}
		}
	}

	@HostListener("keypress", ["$event"])
	onKeypressHandler(event): void {
		const htmlName = event.target.name;
		if (htmlName === "taxIdChar" || htmlName === "branchCode") {
			event.preventDefault();
		}
	}

	constructor(
		protected ref: NbDialogRef<ContactFormComponent>,
		private formBuilder: FormBuilder,
		private renderer: Renderer2
	) {}

	ngOnInit(): void {
		this.contactForm = this.formBuilder.group({
			code: ["C0013"],
			branch: [""],
			name: [""],
			prefixName: [""],
			firstName: [""],
			lastName: [""],
		});

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

		this.branchCodeForm = this.formBuilder.group({
			branchCode_1: [""],
			branchCode_2: [""],
			branchCode_3: [""],
			branchCode_4: [""],
			branchCode_5: [""],
		});
	}
}
