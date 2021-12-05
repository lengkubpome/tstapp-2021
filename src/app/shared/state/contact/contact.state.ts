import { IContact } from "src/app/shared/models/contact.model";
import { tap } from "rxjs/operators";
import { ContactService } from "./../../services/contact.service";
import { Injectable } from "@angular/core";
import { NgxsOnInit, Selector, State, StateContext, Action } from "@ngxs/store";
import { ContactAction } from "./contact.action";
import { Observable, of } from "rxjs";

export interface ContactStateModel {
	contactList: IContact[];
	selectContact: any;
	isLoaded: boolean;
}

@State<ContactStateModel>({
	name: "contact",
	defaults: { contactList: [], selectContact: null, isLoaded: false },
})
@Injectable()
export class ContactState implements NgxsOnInit {
	constructor(private contactService: ContactService) {}
	// @Selector()
	// static myCar(state: ContactStateModel): IContact[] {
	// 	return state.contacts.filter((s) => s.id === 'c1002');
	// }
	ngxsOnInit(ctx: StateContext<ContactStateModel>): void {
		console.log("State initialized, now getting contact");
		ctx.dispatch(new ContactAction.FetchAll());
	}

	@Action(ContactAction.FetchAll)
	fetchAll(ctx: StateContext<ContactStateModel>): Observable<IContact[]> {
		return this.contactService.getContactList().pipe(
			tap((result) => {
				// console.log(result);
				const state = ctx.getState();
				ctx.setState({
					...state,
					contactList: result,
					isLoaded: true,
				});
			})
		);
	}

	@Action(ContactAction.SelectedContact)
	selectedContact(
		ctx: StateContext<ContactStateModel>,
		{ contactId }: ContactAction.SelectedContact
	): Observable<any> {
		const state = ctx.getState();
		return this.contactService.getContact(contactId).pipe(
			tap((result) => {
				console.log("result result result result");
				console.log(result);

				ctx.setState({
					...state,
					selectContact: result,
				});
			})
		);
	}

	@Action(ContactAction.Add)
	add(
		ctx: StateContext<ContactStateModel>,
		{ payload }: ContactAction.Add
	): void {
		const state = ctx.getState();
		ctx.setState({
			...state,
			contactList: [...state.contactList, payload],
		});
	}
}
