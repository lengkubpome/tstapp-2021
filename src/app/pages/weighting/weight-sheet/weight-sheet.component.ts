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
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { CarAction } from 'src/app/shared/state/car/car.action';

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
	// Private
	private unsubscribeAll: Subject<any>;

	clock = new Date();
	weightSheet: IWeighting = { status: null };

	cars: ICar[];
	@Select(CarState) cars$: Observable<CarStateModel>;

	contacts: IContact[];
	@Select(ContactState) contacts$: Observable<ContactStateModel>;

	products: IProduct[];
	@Select(ProductState) products$: Observable<ProductStateModel>;

	filteredCars: Observable<ICar[]>;
	filteredContacts: Observable<IContact[]>;
	filteredProducts: Observable<IProduct[]>;

	weightingForm: FormGroup;

	weightTypes = [
		{ value: 'buy', label: 'ซื้อของ' },
		{ value: 'sell', label: 'ขายของ' },
		{ value: 'etc', label: 'อื่นๆ' }
	];

	// Make up
	menuItems = [ { title: 'Profile' }, { title: 'Logout' } ];

	control = new FormControl();
	streets: string[] = [
		'Champs-Élysées',
		'Lombard Street',
		'Abbey Road',
		'Fifth Avenue'
	];

	stateCtrl = new FormControl();
	filteredStates: Observable<State[]>;

	states: State[] = [
		{
			name: 'Arkansas',
			population: '2.978M',
			// https://commons.wikimedia.org/wiki/File:Flag_of_Arkansas.svg
			flag:
				'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
		},
		{
			name: 'California',
			population: '39.14M',
			// https://commons.wikimedia.org/wiki/File:Flag_of_California.svg
			flag:
				'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
		},
		{
			name: 'Florida',
			population: '20.27M',
			// https://commons.wikimedia.org/wiki/File:Flag_of_Florida.svg
			flag:
				'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
		},
		{
			name: 'Texas',
			population: '27.47M',
			// https://commons.wikimedia.org/wiki/File:Flag_of_Texas.svg
			flag:
				'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg'
		}
	];

	constructor(private store: Store, private formBuilder: FormBuilder) {
		this.weightingForm = this.formBuilder.group({
			id: [ '' ],
			type: [ 'buy' ],
			car: [ '' ],
			contact: [ '' ],
			product: [ '' ],
			price: [],
			weightCut: this.formBuilder.group({
				amount: [],
				type: [ 'unit' ]
			}),
			notes: []
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
	// @ Private methods
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

	onSelectProduct(productId: string): void {
		const product = this.products.find((p) => p.id === productId);
		this.weightingForm.get('product').setValue(product.name);
		this.weightingForm.get('price').setValue(product.currentPrice);
		this.weightSheet.productId = product.id;
		this.weightSheet.price = product.currentPrice;
	}

	onSubmitWeightSheet(): void {
		console.log(this.cars);
		console.log(this.weightingForm.value);
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Private Func clock methods
	// -----------------------------------------------------------------------------------------------------

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
		const filterValue = this._normalizeValue(value);
		return this.products.filter((product) =>
			this._normalizeValue(product.id + product.name).includes(filterValue)
		);
	}

	private _filterStates(value: string): State[] {
		const filterValue = value.toLowerCase();

		return this.states.filter(
			(state) => state.name.toLowerCase().indexOf(filterValue) === 0
		);
	}

	private _normalizeValue(value: string): string {
		return value.toLowerCase().replace(/\s/g, '');
	}
}
