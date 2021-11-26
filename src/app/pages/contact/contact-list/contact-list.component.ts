import { Component, OnInit } from "@angular/core";
import { NbSidebarService } from "@nebular/theme";

@Component({
	selector: "app-contact-list",
	templateUrl: "./contact-list.component.html",
	styleUrls: ["./contact-list.component.scss"],
})
export class ContactListComponent implements OnInit {
	constructor(private sidebarService: NbSidebarService) {}

	ngOnInit(): void {}

	toggle() {
		this.sidebarService.toggle(false, "left");
	}

	toggleCompact() {
		this.sidebarService.toggle(true, "right");
	}
}
