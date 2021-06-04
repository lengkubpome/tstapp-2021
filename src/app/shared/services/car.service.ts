import { ICar, CarData, ICarType } from './../models/car.model';
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

	private carTypes: ICarType[] = [
		{ id: '1', en: 'pickup-truck', th: 'กระบะ' },
		{ id: '2', en: 'mini-truck', th: 'รถบรรทุกเล็ก' },
		{ id: '3', en: 'truck', th: 'รถบรรทุก (6 - 12 ล้อ)' },
		{ id: '4', en: 'tractor', th: 'รถแทรกเตอร์ (หัวลาก)' },
		{ id: '5', en: 'trailer', th: 'พ่วงคอก (หาง)' },
		{ id: '6', en: 'flatbed-trailer', th: 'พ่วงพื้นเรียบ (หาง)' },
		{ id: '7', en: 'motorcycle-truck', th: 'มอเตอร์ไซค์พ่วง' },
		{ id: '0', en: 'etc', th: 'อื่นๆ' }
	];

	constructor() {
		super();
	}

	// getCars = (): Observable<Car[]> => this.$cars;
	getCars(): Observable<ICar[]> {
		return of(this.cars);
	}

	getCarTypes(): Observable<ICarType[]> {
		return of(this.carTypes);
	}

	addCar(): void {
		this.cars = [
			...this.cars,
			{ id: '1234', plateLCN: 'กอ-1234', plateLCP: 'ขอนแก่น', typeId: '0' }
		];
	}
}
