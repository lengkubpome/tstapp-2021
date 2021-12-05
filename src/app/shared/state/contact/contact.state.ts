import { IContact } from "src/app/shared/models/contact.model";
import { tap } from "rxjs/operators";
import { ContactService } from "./../../services/contact.service";
import { Injectable } from "@angular/core";
import {
	NgxsOnInit,
	Selector,
	State,
	StateContext,
	Action,
	Store,
} from "@ngxs/store";
import { ContactAction } from "./contact.action";
import { Observable, of } from "rxjs";
import { Navigate, RouterState } from "@ngxs/router-plugin";

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
	constructor(private store: Store, private contactService: ContactService) {}
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

	@Action(ContactAction.SelectContact)
	selectContact(
		ctx: StateContext<ContactStateModel>,
		{ contactId }: ContactAction.SelectContact
	): Observable<any> {
		const state = ctx.getState();
		return this.contactService.getContact(contactId).pipe(
			tap((result) => {
				ctx.setState({
					...state,
					selectContact: result[0],
				});
			}),
			tap((result) => {
				const nextUrl = "/pages/contact/" + result[0].code;
				this.store.dispatch(new Navigate([nextUrl]));
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
