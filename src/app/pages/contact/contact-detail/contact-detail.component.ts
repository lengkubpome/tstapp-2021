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

	constructor(private store: Store) {
		this.contacts = this.store.selectSnapshot<IContact>(
			ContactState.selectContact
		);

		if (this.contacts === null) {
			this.store.dispatch(new Navigate(["/pages/contact/"]));
		}
	}

	ngOnInit(): void {}

	onTest(): void {
		console.log("xxxxxx");
	}
}
