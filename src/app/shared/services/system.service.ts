import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";
import { ISetting } from "../models/system.model";

@Injectable({
	providedIn: "root",
})
export class SettingService {
	constructor(private afs: AngularFirestore) {}

	// getSystems(): Observable<any> {
	// 	const settingCollection = this.afs.collection<ISetting>("setting");
	// 	return settingCollection.valueChanges();
	// }
}
