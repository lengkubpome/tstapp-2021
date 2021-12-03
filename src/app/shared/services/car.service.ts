import { ICar, ICarType } from "./../models/car.model";
import { Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
	AngularFirestore,
	DocumentReference,
	CollectionReference,
} from "@angular/fire/compat/firestore";
import { map, mergeMap, switchMap, tap } from "rxjs/operators";

@Injectable({
	providedIn: "root",
})
export class CarService {
	// private cars: ICar[] = [
	// 	{ id: "กอ-9555ขก", plateLCN: "กอ-9555", plateLCP: "ขอนแก่น" },
	// 	{ id: "84-4922ขก", plateLCN: "84-4922", plateLCP: "ขอนแก่น" },
	// 	{ id: "ขง-2367ขก", plateLCN: "ขง-2367", plateLCP: "ขอนแก่น" },
	// ];

	constructor(private afs: AngularFirestore, private http: HttpClient) {}

	// getCars(): Observable<ICar[]> {
	// 	return of(this.cars);
	// }

	getCars(): Observable<ICar[]> {
		const carCollection = this.afs.collection<any>("cars");
		return carCollection.valueChanges({ idField: "customID" });
	}

	addCar(): void {
		// this.cars = [
		// 	...this.cars,
		// 	{ id: "1234", plateLCN: "กอ-1234", plateLCP: "ขอนแก่น" },
		// ];
	}

	getCarTypes(): Observable<ICarType[]> {
		return this.http.get<any[]>("assets/data/car-type.json").pipe(
			map((data) => {
				const result = data.map((t) => ({ id: t.id, name: t.th_name }));
				return result;
			})
		);
	}

	// getCarTypes(): Observable<ICarType[]> {
	// 	return this.afs
	// 		.collection<ICarType>("carTypes", (ref) => ref.orderBy("name"))
	// 		.snapshotChanges()
	// 		.pipe(
	// 			map((actions) =>
	// 				actions.map((a) => {
	// 					const data = a.payload.doc.data() as ICarType;
	// 					const id = a.payload.doc.id;
	// 					return { ...data, id };
	// 				})
	// 			)
	// 		);
	// 	// แบบที่ 2
	// 	//   const carTypeCollection = this.afs.collection<ICarType>("carTypes", (ref) =>
	// 	// 	ref.orderBy("name")
	// 	// );
	// 	// return carTypeCollection.valueChanges({ idField: "id" });
	// }
}
