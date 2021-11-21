import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IWeightingType } from "src/app/shared/models/weighting.model";
import { Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { IWeighting } from "src/app/shared/models/weighting.model";
import { AngularFirestore } from "@angular/fire/compat/firestore";

@Injectable({
	providedIn: null,
})
export class WeightingService {
	private data: IWeighting[] = [];
	private weightingTypes: IWeightingType[] = [
		{ id: "buy", th: "ซื้อของเข้า", en: "Buy" },
		{ id: "sell", th: "ขายของออก", en: "Sell" },
	];

	constructor(
		private readonly fb: FormBuilder,
		private afs: AngularFirestore
	) {}

	// -----------------------------------------------------------------------------------------------------
	// #Weighting
	// -----------------------------------------------------------------------------------------------------

	getAllWeightSheet(): Observable<IWeighting[]> {
		return of(this.data);
	}

	getWeightSheetByDate(date: Date): Observable<IWeighting[]> {
		return of(this.data.filter((d) => d.wIn.dateTime));
	}

	generateId(): string {
		const now = new Date();
		let timestamp = now.getFullYear().toString(); // 2011
		timestamp +=
			(now.getMonth() + 1 < 9 ? "0" : "") + (now.getMonth() + 1).toString(); // 0=January, 1=February
		timestamp += (now.getDate() < 10 ? "0" : "") + now.getDate().toString(); // pad with a 0

		const order = this.data.filter((d) => d.wIn.dateTime).length + 1;
		timestamp +=
			(order < 100 ? "0" : "") + (order < 10 ? "0" : "") + order.toString();
		console.log(timestamp);
		return timestamp;
	}

	createWeightSheet(sheet: IWeighting): void {
		return null;
	}

	// -----------------------------------------------------------------------------------------------------
	// #Weighting Type
	// -----------------------------------------------------------------------------------------------------

	getWeightingTypes(): Observable<IWeightingType[]> {
		const typeCollection =
			this.afs.collection<IWeightingType>("weightingTypes");
		return typeCollection.valueChanges();
	}

	// getNewWeightSheetForm(): Observable<FormGroup> {
	// 	return this.fetchWeightingType().pipe(
	// 		map((apiResponse: any) => {
	// 			console.log("apiResponse");
	// 			console.log(apiResponse);

	// 			return this.fb.group({
	// 				type: [
	// 					"ซื้อ",
	// 					Validators.compose([
	// 						Validators.required,
	// 						inList(apiResponse, ["th"]),
	// 					]),
	// 				],
	// 				car: ["", Validators.compose([Validators.required])],
	// 				contact: [""],
	// 				product: ["", Validators.compose([Validators.required])],
	// 				price: [
	// 					"",
	// 					Validators.compose([Validators.pattern("(^[0-9]*[.]?[0-9]{0,2})")]),
	// 				],
	// 				cutWeight: [
	// 					"",
	// 					Validators.compose([Validators.pattern("(^[0-9]*[.]?[0-9]*[%]?)")]),
	// 				],
	// 				notes: [],
	// 				liveWeight: [23044],
	// 			});
	// 		})
	// 	);
	// }
}
