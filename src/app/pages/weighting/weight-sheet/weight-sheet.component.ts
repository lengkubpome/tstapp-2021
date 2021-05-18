import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

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
})
export class WeightSheetComponent implements OnInit {
	menuItems = [ { title: 'Profile' }, { title: 'Logout' } ];
	options = [
		{ value: 'ซื้อของ', label: 'ซื้อของ', checked: true },
		{ value: 'ขายของ', label: 'ขายของ' },
		{ value: 'อื่นๆ', label: 'อื่นๆ' }
	];

	control = new FormControl();
	streets: string[] = [
		'Champs-Élysées',
		'Lombard Street',
		'Abbey Road',
		'Fifth Avenue'
	];
	filteredStreets: Observable<string[]>;

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

	constructor() {}

	ngOnInit(): void {
		this.filteredStreets = this.control.valueChanges.pipe(
			startWith(''),
			map((value) => this._filter(value))
		);

		this.filteredStates = this.stateCtrl.valueChanges.pipe(
			startWith(''),
			map((state) => (state ? this._filterStates(state) : this.states.slice()))
		);

		this.filteredProducts = this.productCtrl.valueChanges.pipe(
			startWith(''),
			map(
				(product) =>
					product ? this._filterProducts(product) : this.products.slice()
			)
		);
	}

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

	private _filter(value: string): string[] {
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
