import { HttpClient } from "@angular/common/http";
import { from, Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { IContact } from "../models/contact.model";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { catchError, finalize, map, switchMap } from "rxjs/operators";
import { Select, Store } from "@ngxs/store";

@Injectable({
	providedIn: "root",
})
export class ContactService {
	constructor(private afs: AngularFirestore) {}

	getContactList(): Observable<IContact[]> {
		const contactCollection = this.afs.collection<any>("contacts");
		return contactCollection.valueChanges({ idField: "id" }).pipe(
			catchError((error) => {
				console.error(
					`%cContactService => getContactList ${error}`,
					"color:white; background:red; font-size:20px"
				);
				return of(error);
			})
		);

		// return contactCollection.snapshotChanges().pipe(
		// 	map((actions) =>
		// 		actions.map((a) => {
		// 			const data = a.payload.doc.data() as IContact;
		// 			const id = a.payload.doc.id;
		// 			return { ...data, id };
		// 		})
		// 	)
		// );
	}

	getContact(code: string): Observable<any> {
		const contactCollection = this.afs.collection<any>("contacts", (ref) =>
			ref.where("code", "==", code)
		);
		return contactCollection.snapshotChanges().pipe(
			map((actions) =>
				actions.map((a) => {
					const data = a.payload.doc.data() as IContact;
					const id = a.payload.doc.id;
					return { ...data, id };
				})
			),
			catchError((error) => {
				console.error(
					`%cContactService => getContact ${error}`,
					"color:white; background:red; font-size:20px"
				);
				return of(error);
			})
		);
	}

	addContact(contact: IContact): any {
		const contactCollection = this.afs.collection<any>("contacts");
		throw new Error("Check error");

		return from(contactCollection.add(contact)).pipe(
			switchMap((docRef) => {
				return contactCollection.doc<IContact>(docRef.id).valueChanges();
			}),
			catchError((error) => {
				console.error(
					`%cContactService => addContact ${error}`,
					"color:white; background:red; font-size:20px"
				);
				return of(error);
			})
		);
	}
}
