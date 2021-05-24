import { Car } from './../../../shared/models/car.model';
import { CarService } from './../../../shared/services/car.service';
import { Weighting } from './../../../shared/models/weighting.model';
import {
	map,
	startWith,
	takeUntil,
	filter,
	switchMap,
	debounceTime
} from 'rxjs/operators';
import {
	Observable,
	Subject,
	Subscription,
	timer,
	BehaviorSubject
} from 'rxjs';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

export interface State {
	flag: string;
	name: string;
	population: string;
}

export interface Product {
	id: number;
	name: string;
}

@Component({
	selector: 'app-weight-sheet',
	templateUrl: './weight-sheet.component.html',
	styleUrls: [ './weight-sheet.component.scss' ]
	// encapsulation: ViewEncapsulation.None
})
export class WeightSheetComponent implements OnInit, OnDestroy {
	// Private
	clock = new Date();
	private refreshCars$ = new BehaviorSubject(true);
	private unsubscribeAll: Subject<any>;

	weightSheet: Weighting;
	cars: Car[];
	cars$: Observable<Car[]>;

	weightingForm: FormGroup;

	weightStatus = null;
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
	filteredCars: Observable<Car[]>;

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

	products: Product[] = [
		{ id: 1, name: 'กล่อง' },
		{ id: 2, name: 'กระดาษสี' },
		{ id: 3, name: 'เศษเหล็ก' },
		{ id: 4, name: 'เหล็กหนา' },
		{ id: 5, name: 'กระป๋อง' },
		{ id: 6, name: 'สังกะสี' }
	];
	filteredProducts: Observable<Product[]>;

	constructor(
		private formBuilder: FormBuilder,
		private carService: CarService
	) {
		// Set the private defaults
		this.unsubscribeAll = new Subject();

		this.weightingForm = formBuilder.group({
			id: [ '' ],
			type: [ 'buy' ],
			car: [ 'test' ],
			contact: [ 'เล้ง' ],
			product: [ '' ],
			price: [ 190 ],
			weightCut: formBuilder.group({
				amount: [ 80 ],
				type: [ 'unit' ]
			}),
			notes: []
		});
	}

	ngOnInit(): void {
		// set clock
		timer(0, 1000)
			.pipe(takeUntil(this.unsubscribeAll), map(() => new Date()))
			.subscribe((time) => {
				this.clock = time;
			});

		this.cars$ = this.refreshCars$.pipe(
			switchMap(() => this.carService.getCars())
		);

		this.carService
			.getCars()
			.pipe(takeUntil(this.unsubscribeAll))
			.subscribe((cars) => {
				this.cars = cars;
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
	setWeightSheet(value?: Weighting): FormGroup {
		return this.formBuilder.group({
			id: [ value.id ],
			status: [ value.status ],
			type: [ value.type ],
			car: [ value.carId ],
			contact: [ value.contactId ],
			product: [ value.productId ],
			price: [ value.price ],
			weightIn: [ value.wIn ],
			weightOut: [ value.wOut ]
		});
	}

	onResetWeightSheet(): void {
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

		this.carService.addCar();
		this.refreshCars$.next(true);
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
		this.filteredCars = this.refreshCars$.pipe(
			switchMap(() => {
				return this.weightingForm
					.get('car')
					.valueChanges.pipe(
						takeUntil(this.unsubscribeAll),
						startWith(''),
						debounceTime(500),
						map((car) => (car ? this._filterCar(car) : this.cars.slice()))
					);
			})
		);

		this.filteredStates = this.weightingForm
			.get('contact')
			.valueChanges.pipe(
				takeUntil(this.unsubscribeAll),
				startWith(''),
				map(
					(state) => (state ? this._filterStates(state) : this.states.slice())
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

	private _filterProducts(value: string): Product[] {
		const filterValue = this._normalizeValue(value);
		return this.products.filter((product) =>
			this._normalizeValue(product.id + ' ' + product.name).includes(
				filterValue
			)
		);
	}

	private _filterCar(value: string): Car[] {
		const filterValue = this._normalizeValue(value);
		return this.cars.filter((car) =>
			this._normalizeValue(car.id).includes(filterValue)
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
