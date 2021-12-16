import {
	ProvinceState,
	ProvinceStateModel,
} from "src/app/shared/state/province/province.state";
import { InteractivityChecker } from "@angular/cdk/a11y";
import { Component, HostListener, OnInit, Renderer2 } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { NbDialogRef } from "@nebular/theme";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { debounceTime, map, startWith } from "rxjs/operators";

@Component({
	selector: "app-contact-form",
	templateUrl: "./contact-form.component.html",
	styleUrls: ["./contact-form.component.scss"],
})
export class ContactFormComponent implements OnInit {
	contactForm: FormGroup;
	taxIdForm: FormGroup;
	branchCodeForm: FormGroup;

	provinces: string[];
	filteredProvinces: Observable<string[]>;

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
		private fb: FormBuilder,
		private renderer: Renderer2,
		private store: Store
	) {
		this.provinces = this.store.selectSnapshot<any>(ProvinceState.province);
	}

	ngOnInit(): void {
		this.contactForm = this.fb.group({
			code: ["C0013"],
			branch: [""],
			name: [""],
			prefixName: [""],
			firstName: [""],
			lastName: [""],
			businessInfo: this.fb.group({
				taxId: [""],
				legalType: [""],
				branch: [""],
			}),
			address: this.fb.group({
				line: [""],
				subDistrict: [""],
				district: [""],
				province: [""],
				postCode: [""],
			}),
		});

		this.taxIdForm = this.fb.group({
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

		this.branchCodeForm = this.fb.group({
			branchCode_1: [""],
			branchCode_2: [""],
			branchCode_3: [""],
			branchCode_4: [""],
			branchCode_5: [""],
		});

		this.formBuilderAction();
		this.filterControls();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Func FormBuilder Action
	// -----------------------------------------------------------------------------------------------------
	private formBuilderAction(): void {
		this.taxIdForm.valueChanges.subscribe((data) => console.log(data));
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Func Filter
	// -----------------------------------------------------------------------------------------------------

	private filterControls(): void {
		this.filteredProvinces = this.contactForm
			.get("address.province")
			.valueChanges.pipe(
				startWith(""),
				debounceTime(100),
				map((input) => {
					const provinces = this.provinces; // ดึงเฉพาะ province
					return input
						? provinces.filter((province) =>
								this._normalizeValue(province).includes(
									this._normalizeValue(input)
								)
						  )
						: provinces;
				})
			);
	}

	private _normalizeValue(value: string): string {
		return value.toLowerCase().replace(/\s/g, "");
	}
}
