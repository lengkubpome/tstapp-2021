import { Component, OnInit } from "@angular/core";
import { RouterState } from "@ngxs/router-plugin";
import { Store } from "@ngxs/store";
import { ContactAction } from "src/app/shared/state/contact/contact.action";

@Component({
	selector: "app-contact-detail",
	templateUrl: "./contact-detail.component.html",
	styleUrls: ["./contact-detail.component.scss"],
})
export class ContactDetailComponent implements OnInit {
	contactCode: string;

	constructor(private store: Store) {}

	ngOnInit(): void {}

	onTest(): void {
		console.log("xxxxxx");
	}
}
