import { IContact } from './../../models/contact.model';
import { Injectable } from '@angular/core';
import { NgxsOnInit, Selector, State, StateContext, Action } from '@ngxs/store';
import { ContactAction } from './contact.action';

const contacts: IContact[] = [
	{ id: 'c1001', firstName: 'เล้ง' },
	{ id: 'c1002', firstName: 'โตโต้' },
	{ id: 'c1003', firstName: 'คาวาซากิ' },
	{ id: 'c1004', firstName: 'มากาต้า' }
];

export interface ContactStateModel {
	contacts: IContact[];
}

@State<ContactStateModel>({
	name: 'contact',
	defaults: { contacts: [] }
})
@Injectable()
export class ContactState implements NgxsOnInit {
	ngxsOnInit(ctx: StateContext<ContactStateModel>): void {
		console.log('State initialized, now getting contact');
		ctx.dispatch(new ContactAction.FetchAll());
	}

	@Selector()
	static myCar(state: ContactStateModel): IContact[] {
		return state.contacts.filter((s) => s.id == 'c1002');
	}

	@Action(ContactAction.FetchAll)
	fetchAll(ctx: StateContext<ContactStateModel>): void {
		const state = ctx.getState();
		ctx.setState({
			...state,
			contacts: [ ...state.contacts, ...contacts ]
		});
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
	// @Action(CarAction.FetchAllCars)
	// add(
	// 	{ getState, setState }: StateContext<CarStateModel>,
	// 	{ payload }: CarAction
	// ) {
	// 	const state = getState();
	// 	setState({ items: [ ...state.items, payload ] });
	// }
}
