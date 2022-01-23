import { IContact } from "src/app/shared/models/contact.model";
import { catchError, first, map, switchMap, take, tap } from "rxjs/operators";
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
import { Navigate } from "@ngxs/router-plugin";
import { NbGlobalLogicalPosition, NbToastrService } from "@nebular/theme";

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
		private toastrService: NbToastrService,
		private contactService: ContactService
	) {}

	@Selector()
	static loading(state: ContactStateModel): boolean {
		return state.loading;
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
		console.log(
			`%cState initialized, now getting contact`,
			"color:white; background:pink;"
		);
		ctx.dispatch(new ContactAction.FetchAll());
	}

	@Action(ContactAction.FetchAll)
	fetchAll(
		ctx: StateContext<ContactStateModel>
	): Observable<boolean | IContact[]> {
		ctx.patchState({ loading: true });
		return this.contactService.getContactList().pipe(
			map((list) => {
				ctx.patchState({
					contactList: list,
					nextId: this.generateId(list),
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
			map((result) => {
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
				const nextUrl = "/pages/contact/" + result.code;
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

		// save contact data
		const addContact$ = this.contactService.addContact(
			action.contact,
			action.profileImage
		);

		return addContact$.pipe(
			take(1),
			tap((contact) => {
				ctx.patchState({
					contactList: [...state.contactList, contact],
					nextId: this.generateId([...state.contactList, contact]),
				});
			}),
			switchMap(() => {
				this.toastrService.success("บันทึกข้อมูลสำเร็จ", "สร้างผู้ติดต่อ", {
					position: NbGlobalLogicalPosition.BOTTOM_END,
				});
				return ctx.dispatch(
					new ContactAction.SelectContact(action.contact.code)
				);
			}),
			catchError((error) => {
				this.toastrService.danger(
					"บันทึกข้อมูลไม่สำเร็จ : " + error,
					"สร้างผู้ติดต่อ",
					{
						position: NbGlobalLogicalPosition.BOTTOM_END,
					}
				);
				console.error(
					`%cContactState => @Action:add ${error}`,
					"color:white; background:red;"
				);
				return of(error);
			})
		);
	}

	@Action(ContactAction.Delete)
	delete(
		ctx: StateContext<ContactStateModel>,
		action: ContactAction.Delete
	): Observable<any> {
		ctx.patchState({ loading: true });

		return this.contactService.deleteContact(action.id).pipe(
			tap(() => {
				this.toastrService.success(
					"ลบข้อมูลผู้ติดต่อสำเร็จ",
					"ลบข้อมูลผู้ติดต่อ",
					{
						position: NbGlobalLogicalPosition.BOTTOM_END,
					}
				);
				ctx.dispatch(new Navigate(["/pages/contact/"]));
			}),
			catchError((error) => {
				this.toastrService.danger(
					"ลบข้อมูลไม่สำเร็จ : " + error,
					"เกิดข้อผิดพลาด : " + error,
					{
						position: NbGlobalLogicalPosition.BOTTOM_END,
					}
				);
				console.error(
					`%cContactState => @Action:delete ${error}`,
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
