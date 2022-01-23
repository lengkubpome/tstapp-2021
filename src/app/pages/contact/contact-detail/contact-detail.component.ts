import { IContact } from "src/app/shared/models/contact.model";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { Navigate, RouterState } from "@ngxs/router-plugin";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { ContactAction } from "src/app/shared/state/contact/contact.action";
import {
	ContactState,
	ContactStateModel,
} from "src/app/shared/state/contact/contact.state";
import { NbDialogRef, NbDialogService } from "@nebular/theme";
import { ContactFormComponent } from "../contact-form/contact-form.component";

@Component({
	selector: "app-contact-detail",
	templateUrl: "./contact-detail.component.html",
	styleUrls: ["./contact-detail.component.scss"],
})
export class ContactDetailComponent implements OnInit {
	contacts: IContact;
	profileUrl: Observable<string | null>;
	// @Select(ContactState.selectContact) contact$: Observable<ContactStateModel>;

	constructor(
		private store: Store,
		private storage: AngularFireStorage,
		private dialogService: NbDialogService
	) {
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

	onEditContact(): void {
		this.dialogService.open(ContactFormComponent, {
			context: { contact: this.contacts },
			closeOnBackdropClick: false,
			hasScroll: true,
			closeOnEsc: false,
		});
	}

	showDeleteConfirm(dialog: TemplateRef<any>): void {
		this.dialogService.open(dialog, {
			context: { code: this.contacts.code },
			hasBackdrop: true,
			closeOnBackdropClick: false,
		});
	}

	onDeleteContact(ref: NbDialogRef<any>): void {
		this.store
			.dispatch(new ContactAction.Delete(this.contacts.id))
			.subscribe(() => ref.close());
	}
}
