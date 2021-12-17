import {
	ProvinceState,
	ProvinceStateModel,
} from "src/app/shared/state/province/province.state";
import { InteractivityChecker } from "@angular/cdk/a11y";
import {
	Component,
	HostListener,
	OnDestroy,
	OnInit,
	Renderer2,
} from "@angular/core";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from "@angular/forms";
import { NbDialogRef } from "@nebular/theme";
import { Select, Store } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { debounceTime, map, startWith, takeUntil } from "rxjs/operators";

@Component({
	selector: "app-contact-form",
	templateUrl: "./contact-form.component.html",
	styleUrls: ["./contact-form.component.scss"],
})
export class ContactFormComponent implements OnInit, OnDestroy {
	// Private
	private unsubscribeAll: Subject<any> = new Subject();

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

	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this.unsubscribeAll.next();
		this.unsubscribeAll.complete();
	}

	ngOnInit(): void {
		this.contactForm = this.fb.group({
			code: ["C00130", Validators.required],
			general: this.fb.group({
				// code: ["C0013"],
				taxId: ["", Validators.required],
				legalType: ["", Validators.required],
				branch: [""],
				name: ["", Validators.required],
				prefixName: [""],
				firstName: ["", Validators.required],
				lastName: [""],

				address: this.fb.group({
					line: [""],
					subDistrict: [""],
					district: [""],
					province: [""],
					postCode: [""],
				}),
			}),
		});

		this.taxIdForm = this.fb.group({
			tax_1: ["", Validators.required],
			tax_2: ["", Validators.required],
			tax_3: ["", Validators.required],
			tax_4: ["", Validators.required],
			tax_5: ["", Validators.required],
			tax_6: ["", Validators.required],
			tax_7: ["", Validators.required],
			tax_8: ["", Validators.required],
			tax_9: ["", Validators.required],
			tax_10: ["", Validators.required],
			tax_11: ["", Validators.required],
			tax_12: ["", Validators.required],
			tax_13: ["", Validators.required],
		});

		this.branchCodeForm = this.fb.group({
			branchCode_1: ["", Validators.required],
			branchCode_2: ["", Validators.required],
			branchCode_3: ["", Validators.required],
			branchCode_4: ["", Validators.required],
			branchCode_5: ["", Validators.required],
		});

		this.formBuilderAction();
		this.filterControls();
	}

	onSubmitCreateContact(form: FormGroup): void {
		console.log(form.valid);
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Func FormBuilder Action
	// -----------------------------------------------------------------------------------------------------
	private formBuilderAction(): void {
		this.taxIdForm.valueChanges
			.pipe(takeUntil(this.unsubscribeAll))
			.subscribe((data) => {
				let taxId = "";
				if (this.taxIdForm.valid) {
					for (const key of Object.keys(data)) {
						taxId += data[key];
					}
				}
				this.contactForm.get("general.taxId").setValue(taxId);
			});
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Func Filter
	// -----------------------------------------------------------------------------------------------------

	private filterControls(): void {
		this.filteredProvinces = this.contactForm
			.get("general.address.province")
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
