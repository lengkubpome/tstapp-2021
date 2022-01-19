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
	last,
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
		private afs: AngularFirestore,
		private storage: AngularFireStorage
	) {}

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

	updateContact(contact: IContact): any {}

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

	addContact(contact: IContact, profileImage?: any): Observable<IContact> {
		const contactCollection = this.afs.collection<any>("contacts");

		return from(contactCollection.add(contact)).pipe(
			switchMap((docRef) => {
				// upload profile
				// if (profileImage) {
				// 	const file = this.base64ToFile(profileImage, contact.code);
				// 	const filePath = `${"/contacts"}/${file.name}`;
				// 	const fileRef = this.storage.ref(filePath);
				// 	const task = this.storage.upload(filePath, file);
				// 	task
				// 		.snapshotChanges()
				// 		.pipe(
				// 			finalize(() =>
				// 				contactCollection
				// 					.doc(docRef.id)
				// 					.update({ profileUrl: fileRef.getDownloadURL() })
				// 			)
				// 		)
				// 		.subscribe();
				// }

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

	uploadProfileImage(fileImage?: any, contactCode?: string): Observable<any> {
		if (fileImage) {
			const file = this.base64ToFile(fileImage, contactCode);
			const path = `${"/contacts"}/${file.name}`;
			const fileRef = this.storage.ref(path);

			return this.storage
				.upload(path, file)
				.percentageChanges()
				.pipe(
					last(),
					map(() => {
						return fileRef.getDownloadURL();
					}),
					finalize(() => {
						console.log(
							`%cContactService => uploadProfileImage`,
							"color:white; background:red; font-size:20px"
						);

						// TODO: Call updateContact

						// this.getContact(contactCode).pipe(
						// 	switchMap((res) => {
						// 		const contactDoc = this.afs
						// 			.collection<any>("contacts")
						// 			.doc(`${res.id}`);

						// 		return contactDoc.update({
						// 			profileUrl: fileRef.getDownloadURL(),
						// 		});
						// 	})
						// );

						return fileRef.getDownloadURL();
						// const contactDoc = this.afs
						// 	.collection<any>("contacts")
						// 	.doc(`${contactCode}`);

						// contactDoc.update({ profileUrl: path });
					}),
					catchError((error) => {
						console.error(
							`%cContactService => uploadProfileImage ${error}`,
							"color:red; background:yellow; font-size:20px"
						);
						return of(error);
					})
				);
		} else {
			return of(null);
		}
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
