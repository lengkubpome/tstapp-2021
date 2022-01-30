import { UploadProfileComponent } from "./../upload-profile/upload-profile.component";
import { IBankAccount } from "./../../../shared/models/contact.model";
import {
	BankState,
	BankStateModel,
} from "./../../../shared/state/bank/bank.state";
import { IContact } from "src/app/shared/models/contact.model";
import {
	ContactState,
	ContactStateModel,
} from "./../../../shared/state/contact/contact.state";
import {
	ProvinceState,
	ProvinceStateModel,
} from "src/app/shared/state/province/province.state";
import { InteractivityChecker } from "@angular/cdk/a11y";
import {
	Component,
	HostListener,
	Input,
	OnDestroy,
	OnInit,
	Renderer2,
} from "@angular/core";
import {
	AbstractControl,
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from "@angular/forms";
import { NbDialogRef, NbDialogService } from "@nebular/theme";
import { Actions, Select, Store } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { debounceTime, map, startWith, take, takeUntil } from "rxjs/operators";
import { ContactAction } from "src/app/shared/state/contact/contact.action";
import { Navigate } from "@ngxs/router-plugin";
import { NgxFileDropEntry } from "ngx-file-drop";
import { AngularFireStorage } from "@angular/fire/compat/storage";

const emptyContact: IContact = {
	code: "",
	mainId: null,
	general: {
		name: "",
		prefixName: "",
		firstName: "",
		lastName: "",
		legalType: null,
		taxId: "",
		branch: "",
		address: {
			line: "",
			subDistrict: "",
			district: "",
			province: "",
			country: "",
			postCode: "",
		},
	},
	communication: {
		phone: "",
		telephone: "",
		website: "",
		email: "",
		address: {
			contactName: "",
			line: "",
			subDistrict: "",
			district: "",
			province: "",
			country: "",
			postCode: "",
		},
	},
	attribute: {
		vendor: false,
		customer: false,
		mainContact: false,
	},
	profileUrl: "",
};

@Component({
	selector: "app-contact-form",
	templateUrl: "./contact-form.component.html",
	styleUrls: ["./contact-form.component.scss"],
})
export class ContactFormComponent implements OnInit, OnDestroy {
	// Private
	private destroy$: Subject<any> = new Subject();

	@Select(ContactState.loading) loading$: Observable<ContactStateModel>;
	@Select(BankState) banks$: Observable<BankStateModel>;

	@Input() contact: IContact;
	contactValue: IContact;

	editFormStatut = {
		editMode: false,
		valueChange: false,
	};

	statusFormValid = {
		taxId: true,
		branchCode: true,
	};

	contactForm: FormGroup;
	taxIdForm: FormGroup;
	branchCodeForm: FormGroup;
	bankAccounts: FormArray;

	files: NgxFileDropEntry[] = [];
	profileImage: any = "";

	provinces: string[];
	filteredProvinces: Observable<string[]>;

	constructor(
		protected ref: NbDialogRef<ContactFormComponent>,
		private fb: FormBuilder,
		private renderer: Renderer2,
		private store: Store,
		private dialogService: NbDialogService,
		private storage: AngularFireStorage
	) {
		this.provinces = this.store.selectSnapshot<any>(ProvinceState.province);
	}

	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this.destroy$.next();
		this.destroy$.complete();
	}

	ngOnInit(): void {
		if (!this.contact) {
			this.contactValue = {
				...emptyContact,
				code: this.store.selectSnapshot<any>(ContactState.generateId), //สร้าง ID อัตโนมัติ
			};
		} else {
			this.contactValue = { ...this.contact };
			this.editFormStatut.editMode = true;
		}

		this.setupForm(this.contactValue);
		this.formBuilderAction();
		this.filterControls();
	}

	onSubmitContactForm(): void {
		if (this.checkContactFormValid()) {
			if (!this.editFormStatut.editMode) {
				this.store
					.dispatch(new ContactAction.Add(this.contactValue, this.profileImage))
					.pipe(takeUntil(this.destroy$))
					.subscribe(() => {
						this.ref.close();
					});
			} else {
				console.log("Same Value ?");
				if (this.compareObjects(this.contact, this.contactValue)) {
					console.log("Same Value");
				}
			}
		}
	}

	onClose(): void {
		this.ref.close();
	}

	setupForm(contact: IContact): void {
		this.contactForm = this.fb.group({
			code: [contact.code, Validators.required],
			general: this.fb.group({
				taxId: [contact.general.taxId],
				legalType: [contact.general.legalType, Validators.required],
				branch: [
					contact.general.branch === "" || contact.general.branch === "00000"
						? contact.general.branch
						: "-",
				],
				name: [contact.general.name, Validators.required],
				prefixName: [contact.general.prefixName],
				firstName: [contact.general.firstName],
				lastName: [contact.general.lastName],
				address: this.fb.group({
					line: [contact.general.address.line],
					subDistrict: [contact.general.address.subDistrict],
					district: [contact.general.address.district],
					province: [contact.general.address.province],
					postCode: [contact.general.address.postCode],
				}),
			}),
			communication: this.fb.group({
				phone: [contact.communication.phone],
				telephone: [contact.communication.telephone],
				email: [contact.communication.email, Validators.email],
				website: [contact.communication.website],
				address: this.fb.group({
					contactName: [contact.communication.address.contactName],
					line: [contact.communication.address.line],
					subDistrict: [contact.communication.address.subDistrict],
					district: [contact.communication.address.district],
					province: [contact.communication.address.province],
					postCode: [contact.communication.address.postCode],
				}),
			}),
			attribute: this.fb.group({
				vendor: [contact.attribute.vendor],
				customer: [contact.attribute.customer],
				mainContact: [contact.attribute.mainContact],
			}),
			bankAccounts: this.fb.array([]),
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

		if (contact.general.taxId) {
			const textLength = contact.general.taxId.length;
			for (let i = 0; i < textLength; i++) {
				const taxChar = contact.general.taxId.slice(i, i + 1);
				this.taxIdForm.get("tax_" + (i + 1)).setValue(taxChar);
			}
		}
		if (contact.general.branch !== "" || "00000") {
			const textLength = contact.general.branch.length;
			for (let i = 0; i < textLength; i++) {
				const taxChar = contact.general.branch.slice(i, i + 1);
				this.branchCodeForm.get("branchCode_" + (i + 1)).setValue(taxChar);
			}
		}

		// ตั้งค่ากรณีแก้ไขข้อมูล
		if (this.editFormStatut.editMode) {
			// ปิดกั้นการเปลี่ยน code
			this.contactForm.get("code").disable();
			// เพิ่มเลขบัญชี
			this.contactValue.bankAccounts.forEach((account) => {
				const accountForm = this.contactForm.get("bankAccounts") as FormArray;
				accountForm.push(this.createBankAccount(account));
			});
			// แสดงรูปโปรไฟล์
			if (this.contactValue.profileUrl !== "") {
				const ref = this.storage.ref(this.contactValue.profileUrl);
				ref
					.getDownloadURL()
					.pipe(takeUntil(this.destroy$))
					.subscribe((image) => (this.profileImage = image));
			}
		}
	}

	checkContactFormValid(): boolean {
		let result = true;
		// check contactForm valid
		if (this.contactForm.invalid) {
			// ทำการแจ้งเตือน request value ให้แสดงผล
			const controls = this.contactForm.controls;
			for (const key1 of Object.keys(controls)) {
				if (key1 === "code") {
					this.contactForm.get(key1).markAsTouched();
				} else if (
					key1 === "general" ||
					key1 === "communication" ||
					key1 === "attribute"
				) {
					// เช็ค Sub-controls
					const subControls = (this.contactForm.get(key1) as FormGroup)
						.controls;

					for (const key2 of Object.keys(subControls)) {
						this.contactForm.get(key1 + "." + key2).markAsTouched();
					}
				} else if (key1 === "bankAccounts") {
					const subControlArray = this.contactForm.get(key1) as FormArray;
					subControlArray.controls.forEach((control: FormGroup) => {
						const subControl = control.controls;
						for (const key2 of Object.keys(subControl)) {
							control.get(key2).markAsTouched();
						}
					});
				}
			}
			result = false;
		}

		// check taxIdForm valid
		let taxId = "";
		const taxIdForm = this.taxIdForm.value;
		for (const key of Object.keys(taxIdForm)) {
			taxId += taxIdForm[key];
		}

		if (taxId !== "" && this.taxIdForm.invalid) {
			console.log("taxIdForm is invalid");
			// delete this.contactValue.general.taxId;
			this.statusFormValid.taxId = false;
			result = false;
		} else {
			this.statusFormValid.taxId = true;
		}

		// check branchCodeForm valid
		let branch = this.contactForm.get("general.branch").value;

		if (branch === "-") {
			const branchCodeForm = this.branchCodeForm.value;
			branch = "";
			for (const key of Object.keys(branchCodeForm)) {
				branch += branchCodeForm[key];
			}
			if (this.branchCodeForm.invalid) {
				console.log("branchCodeForm is invalid");
				// delete this.contactValue.general.branch;
				this.statusFormValid.branchCode = false;
				result = false;
			} else {
				this.statusFormValid.branchCode = true;
			}
		}

		// Set Contact Value
		this.contactValue = {
			...this.contactValue,
			...this.contactForm.value,
			general: { ...this.contactForm.value.general, taxId, branch },
		};

		// console.log("ContactValue Change");
		// console.log(this.contactValue);

		return result;
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Func Image Profile
	// -----------------------------------------------------------------------------------------------------

	onUploadImageProfile(file: File): void {
		this.dialogService
			.open(UploadProfileComponent, {
				context: {
					file,
				},
				closeOnBackdropClick: false,
				hasScroll: true,
				closeOnEsc: false,
			})
			.onClose.subscribe((result) => {
				if (result) {
					const imageBase64 = result;

					this.profileImage = imageBase64;
				}
			});
	}

	onDeleteImageProfile(): void {
		this.profileImage = "";
		this.contactValue.profileUrl = "";
	}

	onSelectFile(files: NgxFileDropEntry[]): void {
		// const reader = new FileReader();
		this.files = files;
		for (const droppedFile of files) {
			// Is it a file?
			if (droppedFile.fileEntry.isFile) {
				const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
				fileEntry.file((file: File) => {
					// Here you can access the real file
					// console.log(droppedFile.relativePath, file);

					this.onUploadImageProfile(file);
				});
			} else {
				// It was a directory (empty directories are added, otherwise only files)
				const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
				console.log(droppedFile.relativePath, fileEntry);
			}
		}
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Func BankAccount Action
	// -----------------------------------------------------------------------------------------------------

	createBankAccount(account?: IBankAccount): FormGroup {
		return this.fb.group({
			main: [account.main],
			bankName: [account.bankName, Validators.required],
			ownerName: [account.ownerName, Validators.required],
			bankNumber: [account.bankNumber, Validators.required],
		});
	}

	addBankAccount(): void {
		const accountForm = this.contactForm.get("bankAccounts") as FormArray;
		const arrayAccount = accountForm.length;
		const account = { main: false };
		if (arrayAccount === 0) {
			account.main = true;
		}
		accountForm.push(this.createBankAccount(account));
	}

	removeBankAccount(index: number): void {
		const accountForm = this.contactForm.get("bankAccounts") as FormArray;
		accountForm.removeAt(index);
		const checkMain = accountForm.controls.filter(
			(a) => a.get("main").value === true
		);
		// เช็คกรณีมีข้อมูล แต่ไม่มี main account
		if (accountForm.length > 0 && checkMain.length === 0) {
			accountForm.controls[0].get("main").setValue(true);
		}
		console.log("Remove BankAccount");
	}

	setMainBankAccount(index: number): void {
		const accountForm = this.contactForm.get("bankAccounts") as FormArray;
		const firstAccount = accountForm.controls[index];
		accountForm.controls.splice(index, 1);
		accountForm.controls.unshift(firstAccount);

		for (let i = 0; i <= index; i++) {
			accountForm.controls[i].get("main").setValue(false);
		}
		accountForm.controls[0].get("main").setValue(true);
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Func FormBuilder Action
	// -----------------------------------------------------------------------------------------------------
	private formBuilderAction(): void {
		this.contactForm
			.get("general.legalType")
			.valueChanges.pipe(takeUntil(this.destroy$))
			.subscribe((data) => {
				if (data === "บุคคลธรรมดา") {
					const name = this.contactForm.get("general.name").value;

					this.contactForm.get("general.name").setValue("");
					this.contactForm.get("general.firstName").setValue(name);
				} else {
					const fname = this.contactForm.get("general.firstName").value;
					const name = this.contactForm.get("general.name").value;

					this.contactForm.get("general.prefixName").setValue("");
					this.contactForm.get("general.firstName").setValue("");
					this.contactForm.get("general.lastName").setValue("");
					this.contactForm.get("general.name").setValue(fname ? fname : name);
				}
			});

		this.contactForm.valueChanges
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.checkContactFormValid();
				if (!this.compareObjects(this.contact, this.contactValue)) {
					this.editFormStatut.valueChange = true;
				} else {
					this.editFormStatut.valueChange = false;
				}
			});

		this.branchCodeForm.valueChanges
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.checkContactFormValid();

				if (!this.compareObjects(this.contact, this.contactValue)) {
					this.editFormStatut.valueChange = true;
				} else {
					this.editFormStatut.valueChange = false;
				}
			});

		this.taxIdForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
			this.checkContactFormValid();
			if (!this.compareObjects(this.contact, this.contactValue)) {
				this.editFormStatut.valueChange = true;
			} else {
				this.editFormStatut.valueChange = false;
			}
		});
	}

	private compareObjects(a: any, b: any): boolean {
		let res = true;
		Object.keys(a).forEach((prop) => {
			if (a[prop] !== b[prop]) {
				if (typeof a[prop] === "object") {
					res = res && this.compareObjects(a[prop], b[prop]);
				} else {
					res = res && false;
				}
			}
		});
		return res;
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
				if (nextIndex > -1 && nextIndex < ctrls.length) {
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
