import { HttpClient } from "@angular/common/http";
import { combineLatest, from, Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { IContact } from "../models/contact.model";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { catchError, finalize, map, switchMap } from "rxjs/operators";
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
		let profileImageURL: string;
		// upload profile
		const profileFile = this.base64ToFile(profileImage, contact.code);
		const filePath = `${"/contacts"}/${profileFile.name}`;
		const storageRef = this.storage.ref(filePath);
		const uploadTask = this.storage.upload(filePath, profileFile);

		return uploadTask.snapshotChanges().pipe(
			finalize(() => {
				return storageRef.getDownloadURL().subscribe((downloadURL) => {
					profileImageURL = downloadURL;
					console.log(
						`%cContactService => addContact ${downloadURL}`,
						"color:white; background:pink; font-size:20px"
					);

					const contactCollection = this.db.collection<any>("contacts");
					const newContact = { ...contact, profileImageURL };
					contactCollection.add(newContact);

					return newContact;
				});
			}),
			catchError((error) => {
				console.error(
					`%cContactService => addContact ${error}`,
					"color:white; background:red; font-size:20px"
				);
				return of(error);
			})
		);
		// save contact
		// const newContact = { ...contact, profileImageURL };
		// const contactCollection = this.db.collection<any>("contacts");
		// const contactCollection$ = contactCollection.add(newContact);

		// return combineLatest([uploadProfile$, contactCollection$]).pipe(
		// 	switchMap(([, docRef]) => {
		// 		return contactCollection.doc<IContact>(docRef.id).valueChanges();
		// 	}),
		// 	catchError((error) => {
		// 		console.error(
		// 			`%cContactService => addContact ${error}`,
		// 			"color:white; background:red; font-size:20px"
		// 		);
		// 		return of(error);
		// 	})
		// );

		// return from(contactCollection.add(contact)).pipe(
		// 	switchMap((docRef) => {
		// 		return contactCollection.doc<IContact>(docRef.id).valueChanges();
		// 	}),
		// 	catchError((error) => {
		// 		console.error(
		// 			`%cContactService => addContact ${error}`,
		// 			"color:white; background:red; font-size:20px"
		// 		);
		// 		return of(error);
		// 	})
		// );
	}

	base64ToFile(data, filename): File {
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
