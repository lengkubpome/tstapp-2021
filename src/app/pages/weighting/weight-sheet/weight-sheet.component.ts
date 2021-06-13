import { ContactInfoComponent } from './contact-info/contact-info.component';
import { CarInfoComponent } from './car-info/car-info.component';
import { WeightingService } from './../weighting.service';
import {
	ContactState,
	ContactStateModel
} from './../../../shared/state/contact/contact.state';
import { IContact } from './../../../shared/models/contact.model';
import {
	ProductState,
	ProductStateModel
} from './../../../shared/state/product/product.state';
import { IProduct } from './../../../shared/models/product.model';
import { CarState, CarStateModel } from './../../../shared/state/car/car.state';
import { ICar } from './../../../shared/models/car.model';
import { IWeighting } from './../../../shared/models/weighting.model';
import { map, startWith, takeUntil, debounceTime } from 'rxjs/operators';
import { Observable, Subject, timer } from 'rxjs';
import {
	Component,
	OnInit,
	OnDestroy,
	HostListener,
	ElementRef,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { CarAction } from 'src/app/shared/state/car/car.action';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { NbDialogService } from '@nebular/theme';
import { inList } from 'src/app/shared/validators/in-list.validator';

export interface State {
	flag: string;
	name: string;
	population: string;
}

@Component({
	selector: 'app-weight-sheet',
	templateUrl: './weight-sheet.component.html',
	styleUrls: [ './weight-sheet.component.scss' ]
	// encapsulation: ViewEncapsulation.None
})
export class WeightSheetComponent implements OnInit, OnDestroy {
	@ViewChild('wForm') wForm: ElementRef;

	// Private
	private unsubscribeAll: Subject<any>;

	weightingForm: FormGroup;

	clock = new Date();
	weightSheet: IWeighting = { status: null };
	stateSheet = { newCar: false };

	weightTypes = [
		{ value: 'buy', label: 'ซื้อของ' },
		{ value: 'sell', label: 'ขายของ' },
		{ value: 'etc', label: 'อื่นๆ' }
	];

	// Make up
	menuItems = [ { title: 'Profile' }, { title: 'Logout' } ];

	cars: ICar[];
	// @Select(CarState) cars$: Observable<CarStateModel>;
	filteredCars: Observable<ICar[]>;

	contacts: IContact[];
	// @Select(ContactState) contacts$: Observable<ContactStateModel>;
	filteredContacts: Observable<IContact[]>;

	products: IProduct[];
	// @Select(ProductState) products$: Observable<ProductStateModel>;
	filteredProducts: Observable<IProduct[]>;

	@HostListener('keyup', [ '$event' ])
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
		this.products = this.store.selectSnapshot<ProductStateModel>(
			ProductState
		).products;

		this.contacts = this.store.selectSnapshot<ContactStateModel>(
			ContactState
		).contacts;

		this.cars = this.store.selectSnapshot<CarStateModel>(CarState).cars;

		this.setWeightSheet();

		this.weightingForm = this.formBuilder.group({
			type: [ 'buy' ],
			car: [ '', Validators.compose([ Validators.required ]) ],
			contact: [
				'',
				Validators.compose([
					inList(this.contacts, [ 'firstName', 'lastName' ])
				])
			],
			product: [
				'',
				Validators.compose([
					Validators.required,
					inList(this.products, [ 'name' ])
				])
			],
			price: [
				'',
				Validators.compose([ Validators.pattern('(^[0-9]*[.]?[0-9]{0,2})') ])
			],
			cutWeight: [
				'',
				Validators.compose([ Validators.pattern('(^[0-9]*[.]?[0-9]*[%]?)') ])
			],
			notes: [],
			liveWeight: [ 7844 ]
		});

		// Set the private defaults
		this.unsubscribeAll = new Subject();
	}

	ngOnInit(): void {
		// set clock
		timer(0, 1000)
			.pipe(takeUntil(this.unsubscribeAll), map(() => new Date()))
			.subscribe((time) => {
				this.clock = time;
			});

		// this.cars$
		// 	.pipe(takeUntil(this.unsubscribeAll))
		// 	.subscribe((data) => (this.cars = data.cars));

		// this.contacts$
		// 	.pipe(takeUntil(this.unsubscribeAll))
		// 	.subscribe((data) => (this.contacts = data.contacts));

		this.filterControls();
	}

	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this.unsubscribeAll.next();
		this.unsubscribeAll.complete();
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
		this.weightingForm.get('type').setValue('buy');

		this.store.dispatch(
			new CarAction.Add({
				id: 'ขง236733ขก',
				plateLCN: 'ขง-236733',
				plateLCP: 'ขอนแก่น'
			})
		);
	}

	onSelectCar(selectCar: ICar): void {
		const car = this.cars.find((c) => c.id === selectCar.id);
		this.weightingForm.get('car').setValue(car.plateLCN);
		this.weightSheet.car = car;
		this.stateSheet.newCar = false;
	}

	checkSelectedCar(): void {
		const val = this.weightingForm.get('car').value;
		if (val !== '') {
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
		let showInput = contact.firstName;
		if (contact.lastName !== undefined) {
			showInput = showInput + ' ' + contact.lastName;
		}

		this.weightingForm.get('contact').setValue(showInput);
		this.weightSheet.contact = contact;
	}

	onSelectProduct(selectProduct: IProduct): void {
		const product = this.products.find((p) => p.id === selectProduct.id);
		this.weightingForm.get('product').setValue(product.name);
		this.weightingForm.get('price').setValue(product.currentPrice);
		this.weightSheet.product = product;
		// this.weightSheet.price = product.currentPrice;
	}

	checkSelectedProduct(): void {
		const val = this.weightingForm.get('product').value;
		if (val !== '') {
			const product = this.products.find((p) => p.name === val);
			if (product !== undefined) {
				this.onSelectProduct(product);
				// this.weightSheet.product = product.;
			} else {
				this.weightSheet.product = null;
				this.weightSheet.price = null;
				this.resetInputValue('price');
			}
		}
	}

	resetInputValue(ctrlName: string): void {
		switch (ctrlName) {
			case 'product': {
				this.weightingForm.get('product').reset();
				this.weightingForm.get('price').reset();
				this.weightSheet.product = null;
				this.weightSheet.price = null;
				break;
			}
			case 'cutWeight': {
				this.weightingForm.get('cutWeight.amount').reset();
				this.weightingForm.get('cutWeight.type').setValue('unit');
				this.weightSheet.weightCut = null;
				break;
			}
			case 'liveWeight': {
				break;
			}
			default: {
				this.weightingForm.get(ctrlName).reset();
			}
		}
	}

	onSubmitWeightSheet(): void {
		console.log(this.weightingForm.errors);
		console.log(this.weightingForm.get('cutWeight').value);
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Func Set Control Input Event methods
	// -----------------------------------------------------------------------------------------------------

	onBlur(event): void {
		const ctrlName = event.target.name;
		const val = this.weightingForm.get('contact').value;
	}

	setPrevFocus(currentId): void {
		const ctrls = Object.keys(this.weightingForm.controls);
		for (let key = ctrls.indexOf(currentId) - 1; key >= 0; key--) {
			const control = this.wForm.nativeElement[ctrls[key]];
			// console.log(control);

			if (control && this.interactivityChecker.isFocusable(control)) {
				control.focus();
				control.select();
				break;
			}
		}
	}

	setNextFocus(currentId): void {
		const ctrls = Object.keys(this.weightingForm.controls);
		// console.log(ctrls);

		for (let key = ctrls.indexOf(currentId) + 1; key < ctrls.length; key++) {
			const control = this.wForm.nativeElement[ctrls[key]];
			if (control && this.interactivityChecker.isFocusable(control)) {
				control.focus();
				control.select();
				break;
			}
		}
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Private Func Dialog methods
	// -----------------------------------------------------------------------------------------------------

	openCarInfo(isNew?: boolean): void {
		let car: ICar;
		if (isNew) {
			car = { id: 'NEW', plateLCN: this.weightingForm.get('car').value };
		} else {
			car = this.weightSheet.car;
		}

		this.dialogService
			.open(CarInfoComponent, {
				context: { title: 'ข้อมูลทะเบียนรถ', car },
				closeOnBackdropClick: false
			})
			.onClose.subscribe((res: ICar) => {
				if (res !== null) {
					this.weightSheet.car = res;
					this.weightingForm.get('car').setValue(res.plateLCN);
				}
			});
	}

	openContactInfo(): void {
		this.dialogService
			.open(ContactInfoComponent, {
				context: {
					title: 'ข้อมูลผู้ติดต่อ',
					contact: this.weightSheet.contact
				},
				closeOnBackdropClick: false
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
		this.filteredCars = this.weightingForm
			.get('car')
			.valueChanges.pipe(
				takeUntil(this.unsubscribeAll),
				startWith(''),
				debounceTime(300),
				map(
					(inpurValue) =>
						inpurValue ? this._filterCar(inpurValue) : this.cars.slice()
				)
			);

		this.filteredContacts = this.weightingForm
			.get('contact')
			.valueChanges.pipe(
				takeUntil(this.unsubscribeAll),
				startWith(''),
				debounceTime(300),
				map(
					(inpurValue) =>
						inpurValue ? this._filterContact(inpurValue) : this.contacts.slice()
				)
			);

		this.filteredProducts = this.weightingForm
			.get('product')
			.valueChanges.pipe(
				takeUntil(this.unsubscribeAll),
				startWith(''),
				debounceTime(300),
				map(
					(inpurValue: string) =>
						inpurValue
							? this._filterProducts(inpurValue)
							: this.products.slice()
				)
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
			this._normalizeValue(contact.id + contact.firstName).includes(filterValue)
		);
	}

	private _filterProducts(value: string): IProduct[] {
		const filterValue = this._normalizeValue(value);
		return this.products.filter((product) =>
			this._normalizeValue(product.id + product.name).includes(filterValue)
		);
	}

	private _normalizeValue(value: string): string {
		return value.toLowerCase().replace(/\s/g, '');
	}
}
