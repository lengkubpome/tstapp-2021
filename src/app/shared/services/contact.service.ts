import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IContact } from "../models/contact.model";
import { AngularFirestore } from "@angular/fire/compat/firestore";

@Injectable({
	providedIn: "root",
})
export class ContactService {
	constructor(private afs: AngularFirestore, private http: HttpClient) {}

	getContacts(): Observable<IContact[]> {
		// return this.http.get<IContact[]>("assets/data/contact-dummy2.json");
		const carCollection = this.afs.collection<any>("contacts");
		return carCollection.valueChanges({ idField: "id" });
	}
}
