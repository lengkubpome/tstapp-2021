import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';

export interface Dessert {
	calories: number;
	carbs: number;
	fat: number;
	name: string;
	protein: number;
}

export interface WeightIn {
	carId: string;
	type: 'ซื้อ' | 'ขาย' | 'อื่นๆ';
	dateIn: Date;
}

@Component({
	selector: 'app-weight-storage',
	templateUrl: './weight-storage.component.html',
	styleUrls: [ './weight-storage.component.scss' ]
})
export class WeightStorageComponent implements OnInit {
	fruits: any[] = [ 'apple', 'banana', 'orenges', 'apple', 'banana' ];
	weightInData: WeightIn[] = [
		{ carId: '843', type: 'ซื้อ', dateIn: new Date() },
		{ carId: '5900', type: 'ซื้อ', dateIn: new Date(8900) },
		{ carId: '843', type: 'ซื้อ', dateIn: new Date() },
		{ carId: '84-4922', type: 'ขาย', dateIn: new Date() },
		{ carId: '6744', type: 'อื่นๆ', dateIn: new Date() },
		{ carId: '5900', type: 'ซื้อ', dateIn: new Date(8900) },
		{ carId: '843', type: 'ซื้อ', dateIn: new Date() },
		{ carId: '84-4922', type: 'ขาย', dateIn: new Date() },
		{ carId: '5900', type: 'ซื้อ', dateIn: new Date(8900) },
		{ carId: '843', type: 'ซื้อ', dateIn: new Date() },
		{ carId: '84-4922', type: 'ขาย', dateIn: new Date() }
	];

	sortWeightInData: WeightIn[];

	constructor() {
		// this.sortedData = this.desserts.slice();
		this.sortWeightInData = this.weightInData.slice();
	}

	ngOnInit(): void {}

	sortData(sort: Sort): any {
		const data = this.weightInData.slice();
		if (!sort.active || sort.direction === '') {
			this.sortWeightInData = data;
			return;
		}

		this.sortWeightInData = data.sort((a, b) => {
			const isAsc = sort.direction === 'asc';
			switch (sort.active) {
				case 'carId':
					return compare(a.carId, b.carId, isAsc);
				case 'type':
					return compare(a.type, b.type, isAsc);
				case 'dateIn':
					return compare(a.dateIn.getDate(), b.dateIn.getDate(), isAsc);

				default:
					return 0;
			}
		});
	}
}

function compare(a: number | string, b: number | string, isAsc: boolean): any {
	return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
