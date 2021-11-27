import { MatSortModule } from "@angular/material/sort";
import { ContactListComponent } from "./contact-list/contact-list.component";
import { ContactRoutes } from "./contact.routing";
import { NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { ContactComponent } from "./contact.component";
import {
	NbButtonModule,
	NbCardModule,
	NbFormFieldModule,
	NbIconModule,
	NbInputModule,
	NbLayoutModule,
	NbMenuModule,
	NbSidebarModule,
	NbUserModule,
} from "@nebular/theme";
import { MatPaginatorModule } from "@angular/material/paginator";

const COMPONENTS = [ContactComponent, ContactListComponent];
const MODULES = [
	ContactRoutes,
	MatTableModule,
	MatPaginatorModule,
	MatSortModule,
	NbMenuModule,
	NbFormFieldModule,
	NbSidebarModule,

	NbCardModule,
	NbIconModule,
	NbInputModule,
	NbButtonModule,
	NbUserModule,
	NbLayoutModule,
];
const SERVICES = [];

@NgModule({
	imports: [...MODULES],
	declarations: [...COMPONENTS],
	providers: [...SERVICES],
})
export class ContactModule {}
