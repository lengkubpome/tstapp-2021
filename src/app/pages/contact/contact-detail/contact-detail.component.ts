import { AngularFireStorage } from "@angular/fire/compat/storage";
import { IContact } from "./../../../shared/models/contact.model";
import { Component, OnInit } from "@angular/core";
import { Navigate, RouterState } from "@ngxs/router-plugin";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { ContactAction } from "src/app/shared/state/contact/contact.action";
import {
	ContactState,
	ContactStateModel,
} from "src/app/shared/state/contact/contact.state";

@Component({
	selector: "app-contact-detail",
	templateUrl: "./contact-detail.component.html",
	styleUrls: ["./contact-detail.component.scss"],
})
export class ContactDetailComponent implements OnInit {
	contacts: IContact;
	profileUrl: Observable<string | null>;
	// @Select(ContactState.selectContact) contact$: Observable<ContactStateModel>;

	constructor(private store: Store, private storage: AngularFireStorage) {
		this.contacts = this.store.selectSnapshot<IContact>(
			ContactState.selectedContact
		);

		console.log("%cCheck", "color:pink; font-size:50px");
		console.log(this.contacts);

		if (this.contacts === null) {
			this.store.dispatch(new Navigate(["/pages/contact/"]));
		}
	}

	ngOnInit(): void {
		if (this.contacts.profileUrl !== "") {
			const ref = this.storage.ref(this.contacts.profileUrl);
			this.profileUrl = ref.getDownloadURL();
		}
	}

	onTest(): void {
		console.log(this.contacts);
	}
}
