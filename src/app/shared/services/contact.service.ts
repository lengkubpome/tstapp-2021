import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IContact } from "../models/contact.model";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { map } from "rxjs/operators";

@Injectable({
	providedIn: "root",
})
export class ContactService {
	constructor(private afs: AngularFirestore, private http: HttpClient) {}

	getContactList(): Observable<IContact[]> {
		// return this.http.get<IContact[]>("assets/data/contact-dummy2.json");
		const contactCollection = this.afs.collection<any>("contacts");
		return contactCollection.snapshotChanges().pipe(
			map((actions) =>
				actions.map((a) => {
					const data = a.payload.doc.data() as IContact;
					const id = a.payload.doc.id;
					return { ...data, id };
				})
			)
		);
	}

	getContact(code: string): Observable<any> {
		const contactCollection = this.afs.collection<any>("contacts", (ref) =>
			ref.where("code", "==", code)
		);
		return contactCollection.valueChanges({ idField: "id" });
	}

	// getContact(id: string): Observable<any> {}
}
