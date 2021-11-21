import { ICar, CarData, ICarType } from "./../models/car.model";
import { Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AngularFirestore } from "@angular/fire/compat/firestore";

@Injectable({
	providedIn: "root",
})
export class CarService extends CarData {
	private cars: ICar[] = [
		{ id: "กอ-9555ขก", plateLCN: "กอ-9555", plateLCP: "ขอนแก่น" },
		{ id: "84-4922ขก", plateLCN: "84-4922", plateLCP: "ขอนแก่น" },
		{ id: "ขง-2367ขก", plateLCN: "ขง-2367", plateLCP: "ขอนแก่น" },
	];

	constructor(private afs: AngularFirestore, private http: HttpClient) {
		super();
	}

	// getCars = (): Observable<Car[]> => this.$cars;
	getCars(): Observable<ICar[]> {
		return of(this.cars);
	}

	addCar(): void {
		this.cars = [
			...this.cars,
			{ id: "1234", plateLCN: "กอ-1234", plateLCP: "ขอนแก่น" },
		];
	}

	getCarTypes(): Observable<ICarType[]> {
		const carTypeCollection = this.afs.collection<ICarType>("carTypes", (ref) =>
			ref.orderBy("id")
		);
		return carTypeCollection.valueChanges();
	}
}
