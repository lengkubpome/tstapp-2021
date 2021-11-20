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
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Select, Selector, Store } from "@ngxs/store";
import { CarAction } from "src/app/shared/state/car/car.action";
import { InteractivityChecker } from "@angular/cdk/a11y";
import { NbDialogService } from "@nebular/theme";
import { inList } from "src/app/shared/validators/in-list.validator";
import { WeightingStateModel } from "../state/weighting.state";
import { WeightingValidator } from "../weighting.validator";

@Component({
	selector: "app-weight-sheet",
	templateUrl: "./weight-sheet.component.html",
	styleUrls: ["./weight-sheet.component.scss"],
})
export class WeightSheetComponent implements OnInit, OnDestroy {
	@ViewChild("wForm") wForm: ElementRef;

	// Private
	private unsubscribeAll: Subject<any> = new Subject();

	weightingForm: FormGroup;

	clock = new Date();
	weightSheet: IWeighting = { status: "success" };
	// stateCarInfo: null | "exist" | "new";
	newCar = false;

	// Make up
	menuItems = [{ title: "Profile" }, { title: "Logout" }];

	@Select(WeightingState) weightingState$: Observable<WeightingStateModel>;
	filteredWeightingTypes: Observable<IWeightingType[]>;

	@Select(ProductState) products$: Observable<ProductStateModel>;
	filteredProducts: Observable<IProduct[]>;

	@Select(CarState) cars$: Observable<CarStateModel>;
	filteredCars: Observable<ICar[]>;

	contacts: IContact[];
	// @Select(ContactState) contacts$: Observable<ContactStateModel>;
	filteredContacts: Observable<IContact[]>;

	@HostListener("keyup", ["$event"])
	keyevent(event): void {
		// key: enter
		if (event.keyCode === 13) {
			// this.setValue(event);
			this.setNextFocus(event.target.name);
		}
		// key: escape
		if (event.keyCode === 27) {
			this.resetInputValue(event.target.name);
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
		private weightingValidators: WeightingValidator
	) {}

	ngOnInit(): void {
		this.contacts =
			this.store.selectSnapshot<ContactStateModel>(ContactState).contacts;

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
			type: [
				null,
				{
					validators: Validators.compose([Validators.required]),
					asyncValidators: [
						this.weightingValidators.weightingTypeAsyncValidator("th"),
					],
				},
			],
			car: [null, Validators.compose([Validators.required])],
			contact: [
				null,
				Validators.compose([inList(this.contacts, ["displayName"])]),
			],
			product: [
				null,
				{
					validators: Validators.compose([Validators.required]),
					asyncValidators: [
						this.weightingValidators.productAsyncValidator("name"),
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
		this.newCar = false;
	}

	onSelectContact(selectContact: IContact): void {
		const contact = this.contacts.find((c) => c === selectContact);
		const showInput = contact.displayName;
		// if (contact.lastName !== undefined) {
		// 	showInput = showInput + ' ' + contact.lastName;
		// }

		this.weightingForm.get("contact").setValue(showInput);
		this.weightSheet.contact = contact;
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
			console.log(key);

			if (control && this.interactivityChecker.isFocusable(control)) {
				control.focus();
				control.select();
				break;
			}
		}
	}

	setNextFocus(currentId): void {
		const ctrls = Object.keys(this.weightingForm.controls);
		// console.log(currentId);
		if (currentId !== "notes") {
			for (let key = ctrls.indexOf(currentId) + 1; key < ctrls.length; key++) {
				const control = this.wForm.nativeElement[ctrls[key]];
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
				mergeMap((inputValue): Observable<ICar[]> => {
					return this.cars$.pipe(
						map((stateModel) => {
							const cars = stateModel.cars;
							const res = cars.filter((car) => car.plateLCN === inputValue);

							// ตรวจสอบว่าเป็นข้อมูลใหม่หรือเก่า
							if (res.length) {
								this.newCar = false; // มีข้อมูล
								return res;
							} else {
								this.newCar = true; // ข้อมูลใหม่
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
			mergeMap((inputValue): Observable<ICar[]> => {
				return this.cars$.pipe(
					map((stateModel): ICar[] => {
						const cars = stateModel.cars;
						return inputValue
							? cars.filter((car) =>
									this._normalizeValue(car.plateLCN).includes(
										this._normalizeValue(inputValue)
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
			map((inputValue) =>
				inputValue ? this._filterContact(inputValue) : this.contacts.slice()
			)
		);

		this.filteredProducts = this.weightingForm.get("product").valueChanges.pipe(
			startWith(""),
			debounceTime(200),
			mergeMap((inputValue) => {
				return this.products$.pipe(
					map((stateModel) => {
						const products = stateModel.products;
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

	private _filterContact(value: string): IContact[] {
		const filterValue = this._normalizeValue(value);
		return this.contacts.filter((contact) =>
			this._normalizeValue(contact.id + contact.displayName).includes(
				filterValue
			)
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
		const newCar = this.newCar;
		const inputCar = this.weightingForm.get("car").value;
		let car: ICar = {
			id: inputCar,
			plateLCN: inputCar,
			plateLCP: "",
		};

		if (this.newCar) {
			if (
				this.weightSheet.hasOwnProperty("car") &&
				this.weightSheet.car.plateLCN === inputCar
			) {
				car = this.weightSheet.car;
			}
		} else {
			car = this.weightSheet.car;
		}

		// console.log("OpenDialog: ", car);

		this.dialogService
			.open(CarInfoComponent, {
				context: {
					title,
					car,
					newCar,
				},
				closeOnBackdropClick: false,
			})
			.onClose.subscribe((value) => {
				if (value !== undefined) {
					console.log(value);

					this.weightSheet.car = value;
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
