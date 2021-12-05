import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs/operators";

@Component({
	selector: "app-contact",
	template: `
		<div class="nav-menu">
			<span>
				<nb-icon nbPrefix icon="person" pack="eva"></nb-icon>
				ผู้ติดต่อ
			</span>
			<a routerLink="/pages/contact">
				<nb-icon nbPrefix icon="person" pack="eva"></nb-icon>
				ผู้ติดต่อ
			</a>
			<span>
				<span class="pr-2">></span>
				<span>customer name</span>
			</span>

			<a (click)="onTest()">
				<nb-icon nbPrefix icon="store" pack="eva"></nb-icon>
				test
			</a>
		</div>

		<router-outlet></router-outlet>
	`,
})
export class ContactComponent implements OnInit {
	constructor(private route: ActivatedRoute, private router: Router) {}

	ngOnInit(): void {}

	onTest(): void {
		const x = this.router.url;
		console.log(x);
	}
}
