import { IContact } from "src/app/shared/models/contact.model";
import {
	catchError,
	first,
	mergeMap,
	switchMap,
	take,
	tap,
} from "rxjs/operators";
import { ContactService } from "./../../services/contact.service";
import { Injectable } from "@angular/core";
import {
	NgxsOnInit,
	Selector,
	State,
	StateContext,
	Action,
	Store,
	Actions,
	ofActionDispatched,
	ofActionSuccessful,
	ofActionErrored,
	ofActionCompleted,
} from "@ngxs/store";
import { ContactAction } from "./contact.action";
import { from, interval, observable, Observable, of } from "rxjs";
import { Navigate, RouterState } from "@ngxs/router-plugin";

export interface ContactStateModel {
	contactList: IContact[];
	selected: any;
	nextId: string;
	loading: boolean;
}

@State<ContactStateModel>({
	name: "contact",
	defaults: {
		contactList: [],
		selected: null,
		nextId: null,
		loading: false,
	},
})
@Injectable()
export class ContactState implements NgxsOnInit {
	constructor(
		private store: Store,
		private actions$: Actions,
		private contactService: ContactService
	) {
		// this.actions$
		// 	.pipe(
		// 		ofActionErrored(
		// 			ContactAction.Add,
		// 			ContactAction.FetchAll,
		// 			ContactAction.SelectContact
		// 		)
		// 	)
		// 	.subscribe((result) => {
		// 		console.log("%cContactAction Errored", "color:red; font-size:20px");
		// 		console.log(result);
		// 	});
		// this.actions$
		// 	.pipe(
		// 		ofActionCompleted(
		// 			ContactAction.Add,
		// 			ContactAction.FetchAll,
		// 			ContactAction.SelectContact
		// 		)
		// 	)
		// 	.subscribe((result) => {
		// 		console.log(
		// 			"%cContactAction Successful",
		// 			"color:white; font-size:20px"
		// 		);
		// 		console.log(result);
		// 	});
		// this.actions$
		// 	.pipe(
		// 		ofActionDispatched(
		// 			ContactAction.Add,
		// 			ContactAction.FetchAll,
		// 			ContactAction.SelectContact
		// 		)
		// 	)
		// 	.subscribe((result) => {
		// 		console.log("%cContactAction Dispatched", "color:pink; font-size:20px");
		// 		console.log(result);
		// 	});
		// this.actions$
		// 	.pipe(
		// 		ofActionCompleted(
		// 			ContactAction.Add,
		// 			ContactAction.FetchAll,
		// 			ContactAction.SelectContact
		// 		)
		// 	)
		// 	.subscribe((result) => {
		// 		console.log("%cContactAction Completed", "color:pink; font-size:20px");
		// 		console.log(result);
		// 	});
	}

	@Selector()
	static loading(state: ContactStateModel): boolean {
		try {
			return state.loading;
		} catch (error) {
			console.log("error", error);
		}
	}

	@Selector()
	static selectedContact(state: ContactStateModel): IContact {
		try {
			return state.selected;
		} catch (error) {
			console.error(
				`%cContactState => @Selector:selectedContact ${error}`,
				"color:white; background:red;"
			);
		}
	}

	@Selector()
	static generateId(state: ContactStateModel): string {
		try {
			return state.nextId;
		} catch (error) {
			console.error(
				`%cContactState => @Selector:fetchAll ${error}`,
				"color:white; background:red;"
			);
		}
	}

	ngxsOnInit(ctx: StateContext<ContactStateModel>): void {
		console.log("State initialized, now getting contact");
		ctx.dispatch(new ContactAction.FetchAll());
	}

	@Action(ContactAction.FetchAll)
	fetchAll(
		ctx: StateContext<ContactStateModel>
	): Observable<boolean | IContact[]> {
		ctx.patchState({ loading: true });
		return this.contactService.getContactList().pipe(
			tap((result) => {
				ctx.patchState({
					contactList: result,
					nextId: this.generateId(result),
					loading: false,
				});
			}),
			catchError((error) => {
				console.error(
					`%cContactState => @Action:fetchAll ${error}`,
					"color:white; background:red;"
				);
				return of(error);
			})
		);
	}

	@Action(ContactAction.SelectContact)
	selectContact(
		ctx: StateContext<ContactStateModel>,
		action: ContactAction.SelectContact
	): Observable<any> {
		return this.contactService.getContact(action.contactId).pipe(
			first(), // ระบบมันทำงาน 2 รอบ แก้ไขให้ทำงานครั้งเดียว
			tap((result) => {
				ctx.patchState({
					selected: result[0],
					loading: true,
				});
				return result[0];
			}),
			switchMap((result) => {
				ctx.patchState({
					loading: false,
				});
				const nextUrl = "/pages/contact/" + result[0].code;
				return this.store.dispatch(new Navigate([nextUrl]));
			}),
			catchError((error) => {
				console.error(
					`%cContactState => @Action:selectContact ${error}`,
					"color:white; background:red;"
				);
				return of(error);
			})
		);
	}

	@Action(ContactAction.Add)
	add(
		ctx: StateContext<ContactStateModel>,
		action: ContactAction.Add
	): Observable<any> {
		const state = ctx.getState();
		ctx.patchState({ loading: true });
		return this.contactService.addContact(action.payload).pipe(
			first(),
			tap((contact: IContact) => {
				ctx.patchState({
					contactList: [...state.contactList, contact],
					nextId: this.generateId([...state.contactList, contact]),
					loading: false,
				});
				return contact;
			}),
			switchMap((contact: IContact) => {
				return ctx.dispatch(new ContactAction.SelectContact(contact.code));
			}),
			catchError((error) => {
				console.error(
					`%cContactState => @Action:add ${error}`,
					"color:white; background:red;"
				);
				return of(error);
			})
		);
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Func
	// -----------------------------------------------------------------------------------------------------

	generateId(contacts: IContact[]): string {
		// เซ็ตระบบ
		const prefixRequest = "C";
		const rangeNumberRequest = 5;
		// นับจำนวนทั้งหมด contact เพื่อคำนวณหาลำดับเลขล่าสุด
		const count = contacts.length;

		let newCode = "";
		// กรณี นับ code ย้อนหลัง <-
		for (let c = count + 1; c > 0; c--) {
			let checkCode = "";
			// คำนวณตัวอักษร ลำดับจำนวนต้องการ - ลำดับจำนวนเลขล่าสุด
			const rangeNumber = rangeNumberRequest - c.toString().length;
			// ใส่เลข 0 นำหน้า
			for (let i = 0; i < rangeNumber; i++) {
				checkCode += "0";
			}
			// แปลง code
			checkCode = prefixRequest + checkCode + c.toString();
			// เช็ค code
			const duplicateContact = contacts.filter(
				(contact) => contact.code === checkCode
			).length;
			// ถ้าซ้ำหยุด loop
			if (duplicateContact > 0) {
				break;
			} else {
				newCode = checkCode;
			}
			// console.log("newCode <-");
			// console.log(newCode);
		}
		// กรณี user ใส่ข้อมูลล้วงหน้า นับ code ไปหน้า ->
		if (newCode === "") {
			for (let c = count + 2; count > 0; c++) {
				let checkCode = "";
				const rangeNumber = rangeNumberRequest - c.toString().length;
				// ใส่เลข 0 นำหน้า
				for (let i = 0; i < rangeNumber; i++) {
					checkCode += "0";
				}
				// แปลง code
				checkCode = prefixRequest + checkCode + c.toString();
				// เช็ค code
				const duplicateContact = contacts.filter(
					(contact) => contact.code === checkCode
				).length;
				// ถ้าซ้ำหยุด loop
				if (duplicateContact === 0) {
					newCode = checkCode;
					break;
				}
			}
			// console.log("newCode ->");
			// console.log(newCode);
		}
		return newCode;
	}
}
