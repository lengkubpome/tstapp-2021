import { RouterModule } from "@angular/router";
import { MatSortModule } from "@angular/material/sort";
import { ContactListComponent } from "./contact-list/contact-list.component";
import { ContactRoutes } from "./contact.routing";
import { NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { ContactComponent } from "./contact.component";
import {
	NbButtonModule,
	NbCardModule,
	NbCheckboxModule,
	NbContextMenuModule,
	NbFormFieldModule,
	NbIconModule,
	NbInputModule,
	NbLayoutModule,
	NbMenuModule,
	NbSidebarModule,
	NbTabsetModule,
	NbUserModule,
} from "@nebular/theme";
import { MatPaginatorModule } from "@angular/material/paginator";
import { ContactDetailComponent } from "./contact-detail/contact-detail.component";
import { AvatarModule } from "ngx-avatar";

const COMPONENTS = [
	ContactComponent,
	ContactListComponent,
	ContactDetailComponent,
];
const MODULES = [
	ContactRoutes,
	MatTableModule,
	MatPaginatorModule,
	MatSortModule,
	NbMenuModule,
	NbContextMenuModule,
	NbFormFieldModule,
	NbSidebarModule,
	NbCheckboxModule,
	NbCardModule,
	NbIconModule,
	NbInputModule,
	NbButtonModule,
	NbUserModule,
	NbLayoutModule,
	NbTabsetModule,

	// Avatar
	AvatarModule,
];
const SERVICES = [];

@NgModule({
	imports: [...MODULES],
	exports: [RouterModule],
	declarations: [...COMPONENTS],
	providers: [...SERVICES],
})
export class ContactModule {}
