import { ContactListComponent } from "./contact-list/contact-list.component";
import { ContactRoutes } from "./contact.routing";
import { NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { ContactComponent } from "./contact.component";
import {
	NbButtonModule,
	NbCardModule,
	NbIconModule,
	NbInputModule,
	NbLayoutModule,
	NbSidebarModule,
	NbUserModule,
} from "@nebular/theme";

const COMPONENTS = [ContactComponent, ContactListComponent];
const MODULES = [
	ContactRoutes,
	NbSidebarModule,
	MatTableModule,
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
