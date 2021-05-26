import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ICar } from './../models/car.model';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class WeightingService {
	public carObsevable: BehaviorSubject<ICar[]>;
	constructor() {
		this.carObsevable = new BehaviorSubject<ICar[]>(CARS);
	}

	getCars = (cars: ICar[]) => this.carObsevable.next(cars);
}

const CARS: ICar[] = [
	{ id: 'กอ9555ขก', plateLCN: 'กอ-9555', plateLCP: 'ขอนแก่น' },
	{ id: '844922ขก', plateLCN: '84-4922', plateLCP: 'ขอนแก่น' },
	{ id: 'ขง2367ขก', plateLCN: 'ขง-2367', plateLCP: 'ขอนแก่น' }
];
