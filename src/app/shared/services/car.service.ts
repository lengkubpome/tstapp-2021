import { Car, CarData } from './../models/car.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class CarService extends CarData {
	private cars: Car[] = [
		{ id: 'กอ9555ขก', plateLCN: 'กอ-9555', plateLCP: 'ขอนแก่น' },
		{ id: '844922ขก', plateLCN: '84-4922', plateLCP: 'ขอนแก่น' },
		{ id: 'ขง2367ขก', plateLCN: 'ขง-2367', plateLCP: 'ขอนแก่น' }
	];

	private $listCar: BehaviorSubject<Car[]>;

	constructor() {
		super();
		this.$listCar = new BehaviorSubject<Car[]>(this.cars);
	}

	getListCar = (): Observable<Car[]> => this.$listCar;
	// getListCar(): Observable<Car[]> {
	// 	return this.$listCar;
	// }

	addCar(): void {
		this.cars.push({ id: '1234', plateLCN: 'กอ-1234', plateLCP: 'ขอนแก่น' });
	}
}
