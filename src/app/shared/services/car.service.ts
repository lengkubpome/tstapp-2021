import { ICar, CarData } from './../models/car.model';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class CarService extends CarData {
	private cars: ICar[] = [
		{ id: 'กอ9555ขก', plateLCN: 'กอ-9555', plateLCP: 'ขอนแก่น' },
		{ id: '844922ขก', plateLCN: '84-4922', plateLCP: 'ขอนแก่น' },
		{ id: 'ขง2367ขก', plateLCN: 'ขง-2367', plateLCP: 'ขอนแก่น' }
	];

	constructor() {
		super();
	}

	// getCars = (): Observable<Car[]> => this.$cars;
	getCars(): Observable<ICar[]> {
		return of(this.cars);
	}

	addCar(): void {
		this.cars = [
			...this.cars,
			{ id: '1234', plateLCN: 'กอ-1234', plateLCP: 'ขอนแก่น' }
		];
	}
}