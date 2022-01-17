import { HttpClient } from "@angular/common/http";
import { combineLatest, from, Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { IContact } from "../models/contact.model";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import {
	catchError,
	finalize,
	flatMap,
	map,
	switchMap,
	tap,
} from "rxjs/operators";
import { Select, Store } from "@ngxs/store";

@Injectable({
	providedIn: "root",
})
export class ContactService {
	constructor(
		private db: AngularFirestore,
		private storage: AngularFireStorage
	) {}

	getContactList(): Observable<IContact[]> {
		const contactCollection = this.db.collection<any>("contacts");
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
		const contactCollection = this.db.collection<any>("contacts", (ref) =>
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

	// addContact(contact: IContact, profileImage?: any): any {
	// 	const contactCollection = this.db.collection<any>("contacts");
	// 	return from(contactCollection.add(contact)).pipe(
	// 		switchMap((docRef) => {
	// 			return contactCollection.doc<IContact>(docRef.id).valueChanges();
	// 		}),
	// 		catchError((error) => {
	// 			console.error(
	// 				`%cContactService => addContact ${error}`,
	// 				"color:white; background:red; font-size:20px"
	// 			);
	// 			return of(error);
	// 		})
	// 	);
	// }

	addContact(contact: IContact, profileImage?: any): any {
		const contactCollection = this.db.collection<any>("contacts");
		if (profileImage) {
			const path = `${"/contacts"}/${contact.code}`;
			contact.profileUrl = path;
		}

		return from(contactCollection.add(contact)).pipe(
			switchMap((docRef) => {
				return contactCollection.doc<IContact>(docRef.id).valueChanges();
			}),
			finalize(() => {
				// upload profile
				if (profileImage) {
					this.uploadProfileImage(profileImage, contact.code);
				}
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

	uploadProfileImage(fileImage: any, fileName: string): Observable<number> {
		const file = this.base64ToFile(fileImage, fileName);
		const path = `${"/contacts"}/${file.name}`;
		const fileRef = this.storage.ref(path);
		return this.storage
			.upload(path, file)
			.percentageChanges()
			.pipe(
				catchError((error) => {
					console.error(
						`%cContactService => uploadProfileImage ${error}`,
						"color:white; background:red; font-size:20px"
					);
					return of(error);
				})
			);
	}

	private base64ToFile(data: any, filename: string): File {
		const arr = data.split(",");
		const mime = arr[0].match(/:(.*?);/)[1];
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}

		return new File([u8arr], filename, { type: mime });
	}
}
