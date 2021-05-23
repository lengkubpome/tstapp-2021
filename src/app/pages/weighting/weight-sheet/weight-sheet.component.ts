import { Car } from './../../../shared/models/car.model';
import { CarService } from './../../../shared/services/car.service';
import { Weighting } from './../../../shared/models/weighting.model';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Observable, Subject, Subscription, timer } from 'rxjs';
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
	weightSheet: Weighting;
	listCar: Car[];

	weightingForm: FormGroup;

	weightStatus = null;
	weightTypes = [
		{ value: 'buy', label: 'ซื้อของ' },
		{ value: 'sell', label: 'ขายของ' },
		{ value: 'etc', label: 'อื่นๆ' }
	];

	// Private
	clock = new Date();
	private subscription: Subscription;
	private unsubscribeAll: Subject<any>;

	// Make up
	menuItems = [ { title: 'Profile' }, { title: 'Logout' } ];

	control = new FormControl();
	streets: string[] = [
		'Champs-Élysées',
		'Lombard Street',
		'Abbey Road',
		'Fifth Avenue'
	];
	filteredCars: Observable<string[]>;

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

	productCtrl = new FormControl();
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

		this.carService
			.getListCar()
			.pipe(takeUntil(this.unsubscribeAll))
			.subscribe((cars) => {
				this.listCar = cars;
			});

		this.filteredCars = this.weightingForm
			.get('car')
			.valueChanges.pipe(
				takeUntil(this.unsubscribeAll),
				startWith(''),
				map((value) => this._filterCar(value))
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

		this.filteredProducts = this.productCtrl.valueChanges.pipe(
			takeUntil(this.unsubscribeAll),
			startWith(''),
			map(
				(product) =>
					product ? this._filterProducts(product) : this.products.slice()
			)
		);
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
	}

	onSubmitWeightSheet(): void {
		console.log(this.listCar);
		console.log(this.weightingForm.value);
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Private Func clock methods
	// -----------------------------------------------------------------------------------------------------

	// -----------------------------------------------------------------------------------------------------
	// @ Private Func Filter methods
	// -----------------------------------------------------------------------------------------------------

	private _filterProducts(value: string): Product[] {
		const filterValue = value.toLowerCase();
		let res: Product[] = [];
		if (!isNaN(Number(filterValue))) {
			res = [
				...this.products.filter((product) => product.id === Number(filterValue))
			];
		}
		res = [
			...res,
			...this.products.filter(
				(product) => product.name.toLowerCase().indexOf(filterValue) === 0
			)
		];
		return res;
	}

	private _filterCar(value: string): string[] {
		const filterValue = this._normalizeValue(value);
		return this.streets.filter((street) =>
			this._normalizeValue(street).includes(filterValue)
		);
	}

	private _normalizeValue(value: string): string {
		return value.toLowerCase().replace(/\s/g, '');
	}

	private _filterStates(value: string): State[] {
		const filterValue = value.toLowerCase();

		return this.states.filter(
			(state) => state.name.toLowerCase().indexOf(filterValue) === 0
		);
	}
}
