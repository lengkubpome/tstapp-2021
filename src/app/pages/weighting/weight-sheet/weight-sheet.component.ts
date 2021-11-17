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
import { map, startWith, takeUntil, debounceTime } from "rxjs/operators";
import { Observable, Subject, timer } from "rxjs";
import {
	Component,
	OnInit,
	OnDestroy,
	HostListener,
	ElementRef,
	ViewChild,
	ViewEncapsulation,
	AfterContentInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Select, Selector, Store } from "@ngxs/store";
import { CarAction } from "src/app/shared/state/car/car.action";
import { InteractivityChecker } from "@angular/cdk/a11y";
import { NbDialogService } from "@nebular/theme";
import { inList } from "src/app/shared/validators/in-list.validator";
import { WeightingStateModel } from "../state/weighting.state";

@Component({
	selector: "app-weight-sheet",
	templateUrl: "./weight-sheet.component.html",
	styleUrls: ["./weight-sheet.component.scss"],
	// encapsulation: ViewEncapsulation.None,
})
export class WeightSheetComponent
	implements OnInit, OnDestroy, AfterContentInit
{
	@ViewChild("wForm") wForm: ElementRef;

	// Private
	private unsubscribeAll: Subject<any>;

	// form$: Observable<FormGroup> = this.weightingService.getNewWeightSheetForm();
	weightingForm: FormGroup;

	clock = new Date();
	weightSheet: IWeighting = { status: "success" };
	stateSheet = { newCar: false };

	// Make up
	menuItems = [{ title: "Profile" }, { title: "Logout" }];

	@Select(WeightingState) weightingState$: Observable<WeightingStateModel>;

	weightingTypes: IWeightingType[];
	filteredWeightingTypes: Observable<IWeightingType[]>;

	cars: ICar[];
	// @Select(CarState) cars$: Observable<CarStateModel>;
	filteredCars: Observable<ICar[]>;

	contacts: IContact[];
	// @Select(ContactState) contacts$: Observable<ContactStateModel>;
	filteredContacts: Observable<IContact[]>;

	products: IProduct[];
	@Select(ProductState) products$: Observable<ProductStateModel>;
	filteredProducts: Observable<IProduct[]>;

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
		private weightingService: WeightingService
	) {
		// Set the private defaults
		this.unsubscribeAll = new Subject();

		this.weightingService
			.getNewWeightSheetForm()
			.subscribe((form) => (this.weightingForm = form));
	}

	ngOnInit(): void {
		// this.weightingTypes =
		// 	this.store.selectSnapshot<WeightingStateModel>(
		// 		WeightingState
		// 	).weightingTypes;

		this.store
			.select((state) => state.weighting)
			.subscribe(
				(data: WeightingStateModel) =>
					(this.weightingTypes = data.weightingTypes)
			);

		this.products =
			this.store.selectSnapshot<ProductStateModel>(ProductState).products;

		this.contacts =
			this.store.selectSnapshot<ContactStateModel>(ContactState).contacts;

		this.cars = this.store.selectSnapshot<CarStateModel>(CarState).cars;

		this.setWeightSheet();

		this.setupFormbuilder();

		// this.cars$
		// 	.pipe(takeUntil(this.unsubscribeAll))
		// 	.subscribe((data) => (this.cars = data.cars));

		// this.contacts$
		// 	.pipe(takeUntil(this.unsubscribeAll))
		// 	.subscribe((data) => (this.contacts = data.contacts));

		this.filterControls();
	}
	ngAfterContentInit(): void {}

	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this.unsubscribeAll.next();
		this.unsubscribeAll.complete();
	}

	private setupFormbuilder(): void {
		// create form
		this.weightingForm = this.formBuilder.group({
			type: [
				"ซื้อ",
				Validators.compose([
					Validators.required,
					inList(this.weightingTypes, ["th"]),
				]),
			],
			car: ["", Validators.compose([Validators.required])],
			contact: [
				"",
				Validators.compose([inList(this.contacts, ["displayName"])]),
			],
			product: [
				"",
				Validators.compose([
					Validators.required,
					inList(this.products, ["name"]),
				]),
			],
			price: [
				"",
				Validators.compose([Validators.pattern("(^[0-9]*[.]?[0-9]{0,2})")]),
			],
			cutWeight: [
				"",
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

	onSelectWeightingType(selectType: string): void {
		const type = this.weightingTypes.find((t) => t.th === selectType);
		this.weightingForm.get("type").setValue(type.th);
		this.weightSheet.type = type.id;
	}

	onSelectCar(selectCar: ICar): void {
		const car = this.cars.find((c) => c.id === selectCar.id);
		this.weightingForm.get("car").setValue(car.plateLCN);
		this.weightSheet.car = car;
		this.stateSheet.newCar = false;
	}

	checkSelectedCar(): void {
		const val = this.weightingForm.get("car").value;
		if (val !== "") {
			const car = this.cars.find((c) => c.plateLCN === val);
			if (car !== undefined) {
				this.weightSheet.car = car;
				this.stateSheet.newCar = false;
			} else {
				this.stateSheet.newCar = true;
				// this.openCarInfo(true);
			}
		}
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
		console.log(selectProduct);

		const product = this.products.find((p) => p.id === selectProduct.id);
		this.weightingForm.get("product").setValue(product.name);
		this.weightingForm.get("price").setValue(product.currentPrice);
		this.weightSheet.product = product;
		// this.weightSheet.price = product.currentPrice;
	}

	checkSelectedProduct(): void {
		const val = this.weightingForm.get("product").value;
		if (val !== "") {
			const product = this.products.find((p) => p.name === val);
			if (product !== undefined) {
				this.onSelectProduct(product);
				// this.weightSheet.product = product.;
			} else {
				this.weightSheet.product = null;
				this.weightSheet.price = null;
				this.resetInputValue("price");
			}
		}
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

	// -----------------------------------------------------------------------------------------------------
	// @ Private Func Dialog methods
	// -----------------------------------------------------------------------------------------------------

	openCarInfo(isNew?: boolean): void {
		let car: ICar;
		if (isNew) {
			car = { id: "NEW", plateLCN: this.weightingForm.get("car").value };
		} else {
			car = this.weightSheet.car;
		}

		this.dialogService
			.open(CarInfoComponent, {
				context: { title: "ข้อมูลทะเบียนรถ", car },
				closeOnBackdropClick: false,
			})
			.onClose.subscribe((res: ICar) => {
				if (res !== null) {
					this.weightSheet.car = res;
					this.weightingForm.get("car").setValue(res.plateLCN);
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

	// -----------------------------------------------------------------------------------------------------
	// @ Private Func Filter methods
	// -----------------------------------------------------------------------------------------------------

	private filterControls(): void {
		this.filteredCars = this.weightingForm.get("car").valueChanges.pipe(
			takeUntil(this.unsubscribeAll),
			startWith(""),
			debounceTime(300),
			map((inputValue) =>
				inputValue ? this._filterCar(inputValue) : this.cars.slice()
			)
		);

		this.filteredContacts = this.weightingForm.get("contact").valueChanges.pipe(
			takeUntil(this.unsubscribeAll),
			startWith(""),
			debounceTime(300),
			map((inputValue) =>
				inputValue ? this._filterContact(inputValue) : this.contacts.slice()
			)
		);

		this.filteredProducts = this.weightingForm.get("product").valueChanges.pipe(
			takeUntil(this.unsubscribeAll),
			startWith(""),
			debounceTime(300),
			map((inputValue: string) =>
				inputValue ? this._filterProducts(inputValue) : this.products.slice()
			)
		);

		this.filteredWeightingTypes = this.weightingForm
			.get("type")
			.valueChanges.pipe(
				takeUntil(this.unsubscribeAll),
				startWith(""),
				debounceTime(300),
				map((inputValue) =>
					inputValue
						? this._filterWeightingType(inputValue)
						: this.weightingTypes.slice()
				)
			);
	}

	private _filterWeightingType(value: string): IWeightingType[] {
		const filterValue = this._normalizeValue(value);
		return this.weightingTypes.filter((type) =>
			this._normalizeValue(type.id + type.th).includes(filterValue)
		);
	}

	private _filterCar(value: string): ICar[] {
		const filterValue = this._normalizeValue(value);
		return this.cars.filter((car) =>
			this._normalizeValue(car.plateLCN + car.plateLCP).includes(filterValue)
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

	private _filterProducts(value: string): IProduct[] {
		const filterValue = this._normalizeValue(value);
		return this.products.filter((product) =>
			this._normalizeValue(product.id + product.name).includes(filterValue)
		);
	}

	private _normalizeValue(value: string): string {
		return value.toLowerCase().replace(/\s/g, "");
	}
}
