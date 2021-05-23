import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Car } from './../models/car.model';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class WeightingService {
	public carObsevable: BehaviorSubject<Car[]>;
	constructor() {
		this.carObsevable = new BehaviorSubject<Car[]>(CARS);
	}

	getCars = (cars: Car[]) => this.carObsevable.next(cars);
}

const CARS: Car[] = [
	{ id: 'กอ9555ขก', plateLCN: 'กอ-9555', plateLCP: 'ขอนแก่น' },
	{ id: '844922ขก', plateLCN: '84-4922', plateLCP: 'ขอนแก่น' },
	{ id: 'ขง2367ขก', plateLCN: 'ขง-2367', plateLCP: 'ขอนแก่น' }
];
