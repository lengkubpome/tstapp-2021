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
	ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { CarAction } from 'src/app/shared/state/car/car.action';
import { InteractivityChecker } from '@angular/cdk/a11y';

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

	weightTypes = [
		{ value: 'buy', label: 'ซื้อของ' },
		{ value: 'sell', label: 'ขายของ' },
		{ value: 'etc', label: 'อื่นๆ' }
	];

	carMenus = [
		{ value: 'findContact', title: 'ค้นหาผู้ติดต่อ' },
		{ value: 'addCar', title: 'เพิ่มรถ' }
	];

	// Make up
	menuItems = [ { title: 'Profile' }, { title: 'Logout' } ];

	cars: ICar[];
	@Select(CarState) cars$: Observable<CarStateModel>;
	filteredCars: Observable<ICar[]>;

	contacts: IContact[];
	@Select(ContactState) contacts$: Observable<ContactStateModel>;
	filteredContacts: Observable<IContact[]>;

	products: IProduct[];
	@Select(ProductState) products$: Observable<ProductStateModel>;
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
		private interactivityChecker: InteractivityChecker
	) {
		this.weightingForm = this.formBuilder.group({
			id: [ '' ],
			type: [ 'buy' ],
			car: [ '' ],
			contact: [ '' ],
			product: [ '' ],
			price: [],
			cutWeight: this.formBuilder.group({
				amount: [],
				type: [ 'unit' ]
			}),
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

		this.cars$
			.pipe(takeUntil(this.unsubscribeAll))
			.subscribe((data) => (this.cars = data.cars));

		this.contacts$
			.pipe(takeUntil(this.unsubscribeAll))
			.subscribe((data) => (this.contacts = data.contacts));

		this.products$.pipe(takeUntil(this.unsubscribeAll)).subscribe((data) => {
			this.products = data.products;
		});

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

	onSelectCar(carId: string): void {
		const car = this.cars.find((c) => c.id === carId);
		this.weightingForm.get('car').setValue(car.plateLCN);
		this.weightSheet.carId = car.id;
	}

	onSelectContact(contactId: string): void {
		const contact = this.contacts.find((c) => c.id === contactId);
		this.weightingForm.get('contact').setValue(contact.firstName);
		this.weightSheet.contactId = contact.id;
	}

	resetInputValue(ctrlName: string): void {
		switch (ctrlName) {
			case 'product': {
				this.weightingForm.get('product').reset();
				this.weightingForm.get('price').reset();
				break;
			}
			case 'cutWeight': {
				this.weightingForm.get('cutWeight.amount').reset();
				this.weightingForm.get('cutWeight.type').setValue('unit');
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

	onSelectProduct(productId: string): void {
		const product = this.products.find((p) => p.id === productId);
		this.weightingForm.get('product').setValue(product.name);
		this.weightingForm.get('price').setValue(product.currentPrice);
		this.weightSheet.productId = product.id;
		this.weightSheet.price = product.currentPrice;
	}

	onSubmitWeightSheet(): void {
		// console.log(this.cars);
		// console.log(this.weightingForm.value);
		const data: IWeighting[] = [
			{
				id: '509903',
				status: 'success',
				wIn: { dateTime: new Date(), weight: 6500 }
			},
			{
				id: '509902',
				status: 'success',
				wIn: { dateTime: new Date(), weight: 6500 }
			}
		];

		const now = new Date();
		let timestamp = now.getFullYear().toString(); // 2011
		timestamp +=
			(now.getMonth() + 1 < 9 ? '0' : '') + (now.getMonth() + 1).toString(); // 0=January, 1=February
		timestamp += (now.getDate() < 10 ? '0' : '') + now.getDate().toString(); // pad with a 0

		const order = data.filter((d) => d.wIn.dateTime).length + 1;
		timestamp +=
			(order < 100 ? '0' : '') + (order < 10 ? '0' : '') + order.toString();
		console.log(timestamp);
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Func Set Control Input Focus methods
	// -----------------------------------------------------------------------------------------------------

	setPrevFocus(currentId): void {
		console.log(currentId);
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
		const ctrls = Object.keys(this.weightingForm.controls);
		console.log(ctrls);

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
	// @ Private Func Filter methods
	// -----------------------------------------------------------------------------------------------------

	private filterControls(): void {
		this.filteredCars = this.weightingForm
			.get('car')
			.valueChanges.pipe(
				takeUntil(this.unsubscribeAll),
				startWith(''),
				debounceTime(300),
				map((car) => (car ? this._filterCar(car) : this.cars.slice()))
			);

		this.filteredContacts = this.weightingForm
			.get('contact')
			.valueChanges.pipe(
				takeUntil(this.unsubscribeAll),
				startWith(''),
				debounceTime(300),
				map(
					(contact) =>
						contact ? this._filterContact(contact) : this.contacts.slice()
				)
			);

		this.filteredProducts = this.weightingForm
			.get('product')
			.valueChanges.pipe(
				takeUntil(this.unsubscribeAll),
				startWith(''),
				debounceTime(300),
				map(
					(product) =>
						product ? this._filterProducts(product) : this.products.slice()
				)
			);
	}

	private _filterCar(value: string): ICar[] {
		const filterValue = this._normalizeValue(value);
		return this.cars.filter((car) =>
			this._normalizeValue(car.id).includes(filterValue)
		);
	}

	private _filterContact(value: string): IContact[] {
		const filterValue = this._normalizeValue(value);
		return this.contacts.filter((contact) =>
			this._normalizeValue(contact.id + contact.firstName).includes(filterValue)
		);
	}

	private _filterProducts(value: string): IProduct[] {
		// console.log('_filterProducts : %s', value);
		const filterValue = this._normalizeValue(value);
		return this.products.filter((product) =>
			this._normalizeValue(product.id + product.name).includes(filterValue)
		);
	}

	private _normalizeValue(value: string): string {
		return value.toLowerCase().replace(/\s/g, '');
	}
}
