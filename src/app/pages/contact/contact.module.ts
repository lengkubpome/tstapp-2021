import { RouterModule } from "@angular/router";
import { MatSortModule } from "@angular/material/sort";
import { ContactListComponent } from "./contact-list/contact-list.component";
import { ContactRoutes } from "./contact.routing";
import { NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { ContactComponent } from "./contact.component";
import {
	NbButtonModule,
	NbCardModule,
	NbCheckboxModule,
	NbContextMenuModule,
	NbDialogModule,
	NbFormFieldModule,
	NbIconModule,
	NbInputModule,
	NbLayoutModule,
	NbMenuModule,
	NbSidebarModule,
	NbTabsetModule,
	NbTagModule,
	NbUserModule,
} from "@nebular/theme";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatListModule } from "@angular/material/list";
import { ContactDetailComponent } from "./contact-detail/contact-detail.component";
import { AvatarModule } from "ngx-avatar";
import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ContactFormComponent } from "./contact-form/contact-form.component";

const COMPONENTS = [
	ContactComponent,
	ContactListComponent,
	ContactDetailComponent,
	ContactFormComponent,
];
const MODULES = [
	CommonModule,
	ReactiveFormsModule,
	ContactRoutes,
	MatTableModule,
	MatPaginatorModule,
	MatSortModule,
	MatListModule,
	MatButtonModule,
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
	NbTagModule,
	NbDialogModule.forChild(),
	// Material
	MatIconModule,
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
