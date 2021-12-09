import { UtilityValidator } from "./../../../shared/validators/utility.validator";
import { WeightingState } from "./../state/weighting.state";
import { IWeightingType } from "./../../../shared/models/weighting.model";
import { ContactInfoComponent } from "../contact-info/contact-info.component";
import { CarInfoComponent } from "../car-info/car-info.component";
import { WeightingService } from "./../weighting.service";
import {
	ContactState,
	ContactStateModel,
} from "src/app/shared/state/contact/contact.state";
import { IContact } from "src/app/shared/models/contact.model";
import {
	ProductState,
	ProductStateModel,
} from "src/app/shared/state/product/product.state";
import { IProduct } from "src/app/shared/models/product.model";
import { CarState, CarStateModel } from "src/app/shared/state/car/car.state";
import { ICar } from "src/app/shared/models/car.model";
import { IWeighting } from "src/app/shared/models/weighting.model";
import {
	map,
	startWith,
	takeUntil,
	debounceTime,
	mergeMap,
	take,
} from "rxjs/operators";
import { Observable, Subject, timer } from "rxjs";
import {
	Component,
	OnInit,
	OnDestroy,
	HostListener,
	ElementRef,
	ViewChild,
	Renderer2,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Select, Selector, Store } from "@ngxs/store";
import { CarAction } from "src/app/shared/state/car/car.action";
import { InteractivityChecker } from "@angular/cdk/a11y";
import { NbDialogService } from "@nebular/theme";
import { WeightingStateModel } from "../state/weighting.state";
import { WeightingValidator } from "../weighting.validator";
import { ProvinceState } from "src/app/shared/state/province/province.state";

@Component({
	selector: "app-weight-sheet",
	templateUrl: "./weight-sheet.component.html",
	styleUrls: ["./weight-sheet.component.scss"],
})
export class WeightSheetComponent implements OnInit, OnDestroy {
	@ViewChild("wForm") wForm: ElementRef;

	@Select(WeightingState) weightingState$: Observable<WeightingStateModel>;
	filteredWeightingTypes: Observable<IWeightingType[]>;

	@Select(ProductState) products$: Observable<ProductStateModel>;
	filteredProducts: Observable<IProduct[]>;

	@Select(CarState) cars$: Observable<CarStateModel>;
	filteredCars: Observable<ICar[]>;

	@Select(ContactState) contacts$: Observable<ContactStateModel>;
	filteredContacts: Observable<IContact[]>;

	// Private
	private unsubscribeAll: Subject<any> = new Subject();

	weightingForm: FormGroup;

	clock = new Date();

	weightSheet: IWeighting = { status: "success" };

	stateCar: { value: ICar; isNew: boolean } = {
		value: null,
		isNew: false,
	};

	// Make up
	menuItems = [{ title: "Profile" }, { title: "Logout" }];

	@HostListener("keyup", ["$event"])
	keyevent(event): void {
		// key: enter
		if (event.keyCode === 13) {
			// this.setValue(event);
			this.setNextFocus(event.target.id);
		}
		// key: escape
		if (event.keyCode === 27) {
			this.resetInputValue(event.target.id);
		}

		// if (event.keyCode === 38) {
		// 	this.setPrevFocus(event.target.name);
		// }
	}

	constructor(
		private store: Store,
		private formBuilder: FormBuilder,
		private interactivityChecker: InteractivityChecker,
		private dialogService: NbDialogService,
		private weightingService: WeightingService,
		private weightingValidators: WeightingValidator,
		private utilityValidator: UtilityValidator,
		private renderer: Renderer2
	) {}

	ngOnInit(): void {
		this.setWeightSheet();

		this.setupFormbuilder();

		this.eventControls();
		this.filterControls();
	}

	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this.unsubscribeAll.next();
		this.unsubscribeAll.complete();
	}

	private setupFormbuilder(): void {
		// create form
		this.weightingForm = this.formBuilder.group({
			car: [null, Validators.compose([Validators.required])],
			type: [
				null,
				{
					validators: Validators.compose([Validators.required]),
					asyncValidators: [
						this.weightingValidators.weightingTypeAsyncValidator("th"),
					],
				},
			],
			contact: [
				null,
				{
					asyncValidators: [this.utilityValidator.contactAsyncValidator()],
				},
			],
			product: [
				null,
				{
					validators: Validators.compose([Validators.required]),
					asyncValidators: [
						this.utilityValidator.productAsyncValidator("name"),
					],
				},
			],
			price: [
				null,
				Validators.compose([Validators.pattern("(^[0-9]*[.]?[0-9]{0,2})")]),
			],
			cutWeight: [
				null,
				Validators.compose([Validators.pattern("(^[0-9]*[.]?[0-9]*[%]?)")]),
			],
			notes: [],
			liveWeight: [23044],
		});

		// set clock
		timer(0, 1000)
			.pipe(
				takeUntil(this.unsubscribeAll),
				map(() => new Date())
			)
			.subscribe((time) => {
				this.clock = time;
			});
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------
	setWeightSheet(weighting?: IWeighting): void {
		if (weighting == null) {
			this.weightSheet.id = this.weightingService.generateId();
		}
	}

	onResetWeightSheet(): void {
		this.weightingForm.reset();
		this.weightingForm.get("type").setValue("buy");

		this.store.dispatch(
			new CarAction.Add({
				id: "ขง236733ขก",
				plateLCN: "ขง-236733",
				plateLCP: "ขอนแก่น",
			})
		);
	}

	onSelectWeightingType(selectType: IWeightingType): void {
		// const type = this.weightingTypes.find((t) => t.th === selectType);
		this.weightingForm.get("type").setValue(selectType.th);
		this.weightSheet.type = selectType.id;
	}

	onSelectCar(selectCar: ICar): void {
		this.weightingForm.get("car").setValue(selectCar.plateLCN);
		this.weightSheet.car = selectCar;

		this.stateCar.isNew = false;
		this.stateCar.value = selectCar;
	}

	onSelectContact(selectContact: IContact): void {
		// const contact = this.contacts.find((c) => c === selectContact);
		// const showInput = contact.contactInfo.name;
		// if (contact.lastName !== undefined) {
		// 	showInput = showInput + ' ' + contact.lastName;
		// }

		this.weightingForm.get("contact").setValue(selectContact.name);
		this.weightSheet.contact = selectContact;
	}

	onSelectProduct(selectProduct: IProduct): void {
		this.weightingForm.get("product").setValue(selectProduct.name);
		this.weightingForm.get("price").setValue(selectProduct.currentPrice);
		this.weightSheet.product = selectProduct;
		this.weightSheet.price = selectProduct.currentPrice;
	}

	resetInputValue(ctrlName: string): void {
		switch (ctrlName) {
			case "product": {
				this.weightingForm.get("product").reset();
				this.weightingForm.get("price").reset();
				this.weightSheet.product = null;
				this.weightSheet.price = null;
				break;
			}
			case "cutWeight": {
				this.weightingForm.get("cutWeight.amount").reset();
				this.weightingForm.get("cutWeight.type").setValue("unit");
				this.weightSheet.weightCut = null;
				break;
			}
			case "liveWeight": {
				break;
			}
			default: {
				this.weightingForm.get(ctrlName).reset();
			}
		}
	}

	onSubmitWeightSheet(): void {
		// find invalid controls
		if (this.weightingForm.invalid) {
			const controls = this.weightingForm.controls;
			for (const name in controls) {
				if (controls[name].invalid) {
					this.weightingForm.get(name).markAsTouched();
				}
			}
		} else {
			this.addCarAfterCheckIn();
		}
	}

	// การเพิ่มข้อมูลรถใหม่ โดยระบบจะทำการบันทึกข้อมูลเพิ่ม หลังจากมีการสร้างรายการบันทึกรถเข้าหรือออก
	addCarAfterCheckIn(): void {
		const input = this.weightingForm.get("car").value;
		if (this.stateCar.value.plateLCN === input) {
			this.weightSheet.car = this.stateCar.value;
			// TODO: เชื่อมต่อ api ในการเพิ่มข้อมูลรถ
		}
	}

	onTest(): void {}

	// -----------------------------------------------------------------------------------------------------
	// @ Func Set Control Input Event methods
	// -----------------------------------------------------------------------------------------------------

	onBlur(event): void {
		const ctrlName = event.target.name;
		const val = this.weightingForm.get("contact").value;
	}

	setPrevFocus(currentId): void {
		const ctrls = Object.keys(this.weightingForm.controls);
		for (let key = ctrls.indexOf(currentId) - 1; key >= 0; key--) {
			const control = this.wForm.nativeElement[ctrls[key]];
			console.log(control);

			if (control && this.interactivityChecker.isFocusable(control)) {
				control.focus();
				control.select();
				break;
			}
		}
	}

	setNextFocus(currentId): void {
		if (currentId !== "notes") {
			const ctrls = Object.keys(this.weightingForm.controls);
			// const nextKeyIndex = ctrls.indexOf(currentId) + 1;
			// if (nextKeyIndex < ctrls.length - 1) {
			// 	this.renderer.selectRootElement("#" + ctrls[nextKeyIndex]).focus();
			// }

			for (let key = ctrls.indexOf(currentId) + 1; key < ctrls.length; key++) {
				const control = this.wForm.nativeElement[ctrls[key]];
				// console.log(ctrls[key]);

				if (control && this.interactivityChecker.isFocusable(control)) {
					control.focus();
					control.select();
					break;
				}
			}
		}
	}

	private eventControls(): void {
		this.weightingForm
			.get("car")
			.valueChanges.pipe(
				takeUntil(this.unsubscribeAll),
				startWith(""),
				debounceTime(300),
				mergeMap((input): Observable<ICar[]> => {
					return this.cars$.pipe(
						map((stateModel) => {
							const cars = stateModel.cars;
							const res = cars.filter((car) => car.plateLCN === input);

							// ตรวจสอบว่าเป็นข้อมูลใหม่หรือเก่า
							if (res.length) {
								this.stateCar.isNew = false;
								this.weightSheet.car = res[0];
								return res;
							} else {
								this.stateCar.isNew = true;
								this.weightSheet.car = {
									id: "null",
									plateLCN: input,
									plateLCP: "",
								};
								return [];
							}
						})
					);
				})
			)
			.subscribe();
	}

	private filterControls(): void {
		this.filteredCars = this.weightingForm.get("car").valueChanges.pipe(
			startWith(""),
			debounceTime(200),
			mergeMap((input): Observable<ICar[]> => {
				return this.cars$.pipe(
					map((stateModel): ICar[] => {
						const cars = stateModel.cars;
						return input
							? cars.filter((car) =>
									this._normalizeValue(car.plateLCN).includes(
										this._normalizeValue(input)
									)
							  )
							: cars;
					})
				);
			})
		);

		this.filteredContacts = this.weightingForm.get("contact").valueChanges.pipe(
			startWith(""),
			debounceTime(200),
			mergeMap((input): Observable<IContact[]> => {
				return this.contacts$.pipe(
					map((stateModel): IContact[] => {
						const contacts = stateModel.contactList;
						return input
							? contacts.filter((contact) =>
									this._normalizeValue(contact.name + contact.code).includes(
										this._normalizeValue(input)
									)
							  )
							: contacts;
					})
				);
			})
		);

		this.filteredProducts = this.weightingForm.get("product").valueChanges.pipe(
			startWith(""),
			debounceTime(200),
			mergeMap((inputValue) => {
				return this.products$.pipe(
					map((stateModel) => {
						const products = stateModel.productList;
						return inputValue
							? products.filter((product) =>
									this._normalizeValue(product.id + product.name).includes(
										this._normalizeValue(inputValue)
									)
							  )
							: products;
					})
				);
			})
		);

		this.filteredWeightingTypes = this.weightingForm
			.get("type")
			.valueChanges.pipe(
				startWith(""),
				debounceTime(200),
				// ผสม Observable อื่น
				mergeMap((inputValue) => {
					return this.weightingState$.pipe(
						map((stateModel) => {
							const types = stateModel.weightingTypes;
							return inputValue
								? types.filter((type) =>
										this._normalizeValue(type.id + type.th).includes(
											this._normalizeValue(inputValue)
										)
								  )
								: types;
						})
					);
				})
			);
	}

	private _normalizeValue(value: string): string {
		return value.toLowerCase().replace(/\s/g, "");
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Private Func Dialog methods
	// -----------------------------------------------------------------------------------------------------

	openCarInfo(): void {
		const title = "ข้อมูลทะเบียนรถ";
		// const newCar = this.newCar;
		const input = this.weightingForm.get("car").value;
		let car: ICar = {
			id: "null",
			plateLCN: input,
			plateLCP: "",
		};

		if (this.stateCar.isNew) {
			if (this.stateCar.value && this.stateCar.value.plateLCN === input) {
				car = this.stateCar.value;
			}
		} else {
			car = this.stateCar.value;
		}

		this.dialogService
			.open(CarInfoComponent, {
				context: {
					title,
					car,
					newCar: this.stateCar.isNew,
				},
				closeOnBackdropClick: false,
			})
			.onClose.subscribe((value) => {
				if (value !== undefined) {
					this.stateCar.value = value;
					this.weightingForm.get("car").setValue(value.plateLCN);
				}
			});
	}

	openContactInfo(): void {
		this.dialogService
			.open(ContactInfoComponent, {
				context: {
					title: "ข้อมูลผู้ติดต่อ",
					contact: this.weightSheet.contact,
				},
				closeOnBackdropClick: false,
				hasScroll: true,
			})
			.onClose.subscribe((res: IContact) => {
				if (res !== null) {
					// this.weightSheet.contactId = res;
					// this.weightingForm.get('car').setValue(res.plateLCN);
				}
			});
	}
}
