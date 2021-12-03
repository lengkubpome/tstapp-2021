import { IContact } from "src/app/shared/models/contact.model";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { SelectionModel } from "@angular/cdk/collections";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import {
	ContactState,
	ContactStateModel,
} from "src/app/shared/state/contact/contact.state";
import { Select } from "@ngxs/store";
import { CustomPaginator } from "src/app/configuration/customPaginatorConfiguration";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
	selector: "app-contact-list",
	templateUrl: "./contact-list.component.html",
	styleUrls: ["./contact-list.component.scss"],
	providers: [{ provide: MatPaginatorIntl, useValue: CustomPaginator() }],
})
export class ContactListComponent implements OnInit, AfterViewInit {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ["select", "code", "name", "phone", "action"];
	dataSource = new MatTableDataSource<IContact>();
	selection = new SelectionModel<IContact>(true, []);

	@Select(ContactState) contacts$: Observable<ContactStateModel>;

	// Make up
	menuItems = [{ title: "Profile" }, { title: "Logout" }];

	constructor(private router: Router, private liveAnnouncer: LiveAnnouncer) {}

	ngOnInit(): void {}

	onTest(): void {
		const id = 123;
		this.router.navigate([this.router.url, id]);
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Table methods
	// -----------------------------------------------------------------------------------------------------

	ngAfterViewInit(): void {
		this.contacts$.subscribe((data) => {
			this.dataSource.data = data.contactList;
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		});
	}
	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle(): void {
		if (this.isAllSelected()) {
			this.selection.clear();
			return;
		}

		this.selection.select(...this.dataSource.data);
	}

	/** The label for the checkbox on the passed row */
	checkboxLabel(row?: IContact): string {
		if (!row) {
			return `${this.isAllSelected() ? "deselect" : "select"} all`;
		}
		return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
			row.code + 1
		}`;
	}

	tableFilter(event: Event): void {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	announceSortChange(sortState: Sort): void {
		// This example uses English messages. If your application supports
		// multiple language, you would internationalize these strings.
		// Furthermore, you can customize the message to add additional
		// details about the values being sorted.
		if (sortState.direction) {
			this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
		} else {
			this.liveAnnouncer.announce("Sorting cleared");
		}
	}
}
