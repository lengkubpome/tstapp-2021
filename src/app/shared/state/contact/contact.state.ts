import { IContact } from "src/app/shared/models/contact.model";
import {
	debounceTime,
	filter,
	flatMap,
	map,
	mergeMap,
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
} from "@ngxs/store";
import { ContactAction } from "./contact.action";
import { from, interval, observable, Observable, of } from "rxjs";
import { Navigate, RouterState } from "@ngxs/router-plugin";

export interface ContactStateModel {
	contactList: IContact[];
	selectContact: any;
	nextId: string;
	isLoaded: boolean;
}

@State<ContactStateModel>({
	name: "contact",
	defaults: {
		contactList: [],
		selectContact: null,
		nextId: null,
		isLoaded: false,
	},
})
@Injectable()
export class ContactState implements NgxsOnInit {
	constructor(private store: Store, private contactService: ContactService) {}

	@Selector()
	static selectContact(state: ContactStateModel): IContact {
		try {
			return state.selectContact;
		} catch (error) {
			console.log("error", error);
		}
	}

	@Selector()
	static generateId(state: ContactStateModel): string {
		try {
			return state.nextId;
		} catch (error) {
			console.log("error", error);
		}
	}

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
				ctx.patchState({
					contactList: result,
					nextId: this.generateId(result),
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
				ctx.patchState({
					selectContact: result[0],
					isLoaded: true,
				});
			}),
			debounceTime(1200),
			mergeMap((result) => {
				ctx.patchState({
					isLoaded: false,
				});
				const nextUrl = "/pages/contact/" + result[0].code;
				return this.store.dispatch(new Navigate([nextUrl]));
			})
		);
	}

	@Action(ContactAction.Add)
	add(
		ctx: StateContext<ContactStateModel>,
		{ payload }: ContactAction.Add
	): Observable<any> {
		const state = ctx.getState();
		return this.contactService.addContact(payload).pipe(
			tap((result: IContact) => {
				ctx.setState({
					...state,
					contactList: [...state.contactList, result],
					nextId: this.generateId([...state.contactList, result]),
				});
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
