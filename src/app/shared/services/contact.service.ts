import { IContact } from "src/app/shared/models/contact.model";
import { HttpClient } from "@angular/common/http";
import { combineLatest, from, Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import {
	AngularFirestore,
	AngularFirestoreCollection,
} from "@angular/fire/compat/firestore";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { catchError, last, map, switchMap } from "rxjs/operators";

@Injectable({
	providedIn: "root",
})
export class ContactService {
	private dbPath = "/contacts";

	contactRef: AngularFirestoreCollection<IContact>;

	constructor(
		private afs: AngularFirestore,
		private storage: AngularFireStorage
	) {
		this.contactRef = afs.collection(this.dbPath);
	}

	getContactList(): Observable<IContact[]> {
		return this.contactRef.valueChanges({ idField: "id" }).pipe(
			catchError((error) => {
				console.error(
					`%cContactService => getContactList ${error}`,
					"color:white; background:red; font-size:20px"
				);
				return of(error);
			})
		);
	}

	getContact(code: string): Observable<{ id: string; contact: IContact }> {
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

	addContact(contact: IContact, profileImage?: any): Observable<IContact> {
		return from(this.contactRef.add(contact)).pipe(
			switchMap((docRef) => {
				const id = docRef.id;
				// upload profile
				if (profileImage) {
					return this.uploadProfileImage(id, profileImage, contact.code);
				} else {
					return of(id);
				}
			}),
			switchMap((id) => {
				return this.contactRef.doc<IContact>(id).valueChanges();
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

	updateContact(
		id: string,
		contact: any,
		profileImage?: any
	): Observable<IContact> {
		return from(this.contactRef.doc(id).update(contact)).pipe(
			switchMap(() => {
				// upload profile
				if (profileImage) {
					return this.uploadProfileImage(id, profileImage, contact.code);
				}
			}),
			switchMap(() => {
				return this.contactRef.doc<IContact>(id).valueChanges();
			}),
			catchError((error) => {
				console.error(
					`%cContactService => update ${error}`,
					"color:white; background:red; font-size:20px"
				);
				return of(error);
			})
		);
	}

	deleteContact(id: string): Observable<any> {
		return from(this.contactRef.doc(id).delete());
	}

	uploadProfileImage(
		id: string,
		fileImage: any,
		fileName: string
	): Observable<string> {
		const file = this.base64ToFile(fileImage, fileName);
		const filePath = `${"/contacts"}/${file.name}`;
		const task = this.storage.upload(filePath, file);

		return task.snapshotChanges().pipe(
			last(),
			switchMap(() => {
				this.updateContact(id, { profileUrl: filePath });
				return of(id);
			}),
			catchError((error) => {
				console.error(
					`%cContactService => uploadProfileImage ${error}`,
					"color:red; background:yellow; font-size:20px"
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
