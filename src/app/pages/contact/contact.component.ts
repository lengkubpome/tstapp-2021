import {
	ContactStateModel,
	ContactState,
} from "./../../shared/state/contact/contact.state";
import { Observable, Subject } from "rxjs";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterState, RouterStateModel } from "@ngxs/router-plugin";
import { Select } from "@ngxs/store";
import { takeUntil } from "rxjs/operators";

@Component({
	selector: "app-contact",
	template: `
		<div class="nav-menu">
			<span *ngIf="urlContact === null">
				<nb-icon nbPrefix icon="person" pack="eva"></nb-icon>
				ผู้ติดต่อ
			</span>
			<a routerLink="/pages/contact" *ngIf="urlContact !== null">
				<nb-icon nbPrefix icon="person" pack="eva"></nb-icon>
				ผู้ติดต่อ
			</a>
			<span *ngIf="urlContact !== null">
				<span class="pr-2">></span>
				<span>{{ urlContact }}</span>
			</span>
		</div>

		<router-outlet></router-outlet>
	`,
})
export class ContactComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();
	public urlContact: string;

	@Select(RouterState) router$: Observable<RouterStateModel>;

	constructor() {}

	ngOnInit(): void {
		this.router$.pipe(takeUntil(this.destroy$)).subscribe((router) => {
			this.urlContact = null;
			const url = router.state.url;
			const arr = url.split("/");

			if (url.split("/").length > 3) {
				this.urlContact = arr[3];
			}
			console.log(arr);
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
