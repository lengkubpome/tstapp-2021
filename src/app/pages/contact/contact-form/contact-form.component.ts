import { IContact } from "./../../../shared/models/contact.model";
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
	FormControl,
	FormGroup,
	Validators,
} from "@angular/forms";
import { NbDialogRef } from "@nebular/theme";
import { Select, Store } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { debounceTime, map, startWith, takeUntil } from "rxjs/operators";
import { ContactAction } from "src/app/shared/state/contact/contact.action";

@Component({
	selector: "app-contact-form",
	templateUrl: "./contact-form.component.html",
	styleUrls: ["./contact-form.component.scss"],
})
export class ContactFormComponent implements OnInit, OnDestroy {
	// Private
	private unsubscribeAll: Subject<any> = new Subject();

	newContact: IContact = { code: "" };
	statusFormValid = {
		taxId: true,
		branchCode: true,
	};

	contactForm: FormGroup;
	taxIdForm: FormGroup;
	branchCodeForm: FormGroup;

	provinces: string[];
	filteredProvinces: Observable<string[]>;

	bankOrder = 1;

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
			code: ["", Validators.required],
			general: this.fb.group({
				taxId: [""],
				legalType: ["", Validators.required],
				branch: [""],
				name: ["", Validators.required],
				prefixName: [""],
				firstName: [""],
				lastName: [""],
				address: this.fb.group({
					line: [""],
					subDistrict: [""],
					district: [""],
					province: [""],
					postCode: [""],
				}),
			}),
			communication: this.fb.group({
				phone: [""],
				telephone: [""],
				email: [""],
				website: [""],
				address: this.fb.group({
					contactName: [""],
					line: [""],
					subDistrict: [""],
					district: [""],
					province: [""],
					postCode: [""],
				}),
			}),
			attribute: this.fb.group({
				vendor: [false],
				customer: [false],
				mainContact: [false],
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
		this.newContactID();
	}

	onSubmitContactForm(): void {
		this.store.dispatch(new ContactAction.GenerateID());

		if (this.checkContactFormValid()) {
			this.store.dispatch(new ContactAction.Add(this.newContact));
		}
	}

	newContactID(): void {
		const id = "C0002";
		this.contactForm.get("code").setValue(id);
	}

	checkContactFormValid(): boolean {
		// check contactForm valid
		if (this.contactForm.invalid) {
			const controls = this.contactForm.controls;
			for (const key1 of Object.keys(controls)) {
				if (key1 === "code") {
					this.contactForm.get(key1).markAsTouched();
				} else {
					// เช็ค Sub-controls
					const subControls = (this.contactForm.get(key1) as FormGroup)
						.controls;
					for (const key2 of Object.keys(subControls)) {
						this.contactForm.get(key1 + "." + key2).markAsTouched();
					}
				}
			}
			return false;
		}

		// check taxIdForm valid
		let taxId = "";
		const taxIdForm = this.taxIdForm.value;
		for (const key of Object.keys(taxIdForm)) {
			taxId += taxIdForm[key];
		}

		if (taxId !== "" && this.taxIdForm.invalid) {
			console.log("taxIdForm is invalid");
			delete this.newContact.general.taxId;
			this.statusFormValid.taxId = false;
			return false;
		} else {
			this.statusFormValid.taxId = true;
		}

		// check branchCodeForm valid
		let branch = this.contactForm.get("general.branch").value;
		if (branch === "-") {
			const branchCodeForm = this.branchCodeForm.value;
			for (const key of Object.keys(branchCodeForm)) {
				branch += branchCodeForm[key];
			}
			if (this.branchCodeForm.invalid) {
				console.log("branchCodeForm is invalid");
				delete this.newContact.general.branch;
				this.statusFormValid.branchCode = false;
				return false;
			} else {
				this.statusFormValid.branchCode = true;
			}
		}

		// Set Contact Value
		this.newContact = {
			...this.newContact,
			...this.contactForm.value,
			general: { ...this.contactForm.value.general, taxId, branch },
		};

		// console.log(this.newContact);

		return true;
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Func FormBuilder Action
	// -----------------------------------------------------------------------------------------------------
	private formBuilderAction(): void {
		this.contactForm
			.get("general.legalType")
			.valueChanges.pipe(takeUntil(this.unsubscribeAll))
			.subscribe((data) => {
				if (data === "บุคคลธรรมดา") {
					const name = this.contactForm.get("general.name").value;
					this.contactForm.get("general.firstName").setValue(name);
				} else {
					const name = this.contactForm.get("general.firstName").value;
					this.contactForm.get("general.name").setValue(name);
				}
			});

		this.contactForm
			.get("general.firstName")
			.valueChanges.pipe(takeUntil(this.unsubscribeAll))
			.subscribe((data) => {
				const prefix = this.contactForm.get("general.prefixName").value;
				const lastName = this.contactForm.get("general.lastName").value;
				this.contactForm.get("general.name").setValue(data.trim());
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

	// -----------------------------------------------------------------------------------------------------
	// @ HostListener
	// -----------------------------------------------------------------------------------------------------

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
			// case backspace
			if (event.keyCode === 8) {
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
			// case -> left arrow
			if (event.keyCode === 37) {
				const nextIndex = ctrls.indexOf(event.target.id) - 1;
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
}
