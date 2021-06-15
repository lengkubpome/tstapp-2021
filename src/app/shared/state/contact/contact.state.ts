import { IContact } from 'src/app/shared/models/contact.model';
import { tap } from 'rxjs/operators';
import { ContactService } from './../../services/contact.service';
import { Injectable } from '@angular/core';
import { NgxsOnInit, Selector, State, StateContext, Action } from '@ngxs/store';
import { ContactAction } from './contact.action';
import { Observable } from 'rxjs';

export interface ContactStateModel {
	contacts: IContact[];
	isLoaded: boolean;
}

@State<ContactStateModel>({
	name: 'contact',
	defaults: { contacts: [], isLoaded: false }
})
@Injectable()
export class ContactState implements NgxsOnInit {
	constructor(private contactService: ContactService) {}
	// @Selector()
	// static myCar(state: ContactStateModel): IContact[] {
	// 	return state.contacts.filter((s) => s.id === 'c1002');
	// }
	ngxsOnInit(ctx: StateContext<ContactStateModel>): void {
		console.log('State initialized, now getting contact');
		ctx.dispatch(new ContactAction.FetchAll());
	}

	@Action(ContactAction.FetchAll)
	fetchAll(ctx: StateContext<ContactStateModel>): Observable<IContact[]> {
		return this.contactService.getContacts().pipe(
			tap((result) => {
				const state = ctx.getState();
				ctx.setState({
					...state,
					contacts: result,
					isLoaded: true
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
			contacts: [ ...state.contacts, payload ]
		});
	}
}
