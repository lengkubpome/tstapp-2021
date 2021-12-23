import { RouterModule } from "@angular/router";
import { MatSortModule } from "@angular/material/sort";
import { ContactListComponent } from "./contact-list/contact-list.component";
import { ContactRoutes } from "./contact.routing";
import { NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { ContactComponent } from "./contact.component";
import {
	NbAccordionModule,
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
	NbRadioModule,
	NbSelectModule,
	NbSidebarModule,
	NbSpinnerModule,
	NbTabsetModule,
	NbTagModule,
	NbToggleModule,
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
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { NgxTrimDirectiveModule } from "ngx-trim-directive";
import { PhoneMaskDirective } from "src/app/shared/directives/phone-mask.directive";

const COMPONENTS = [
	ContactComponent,
	ContactListComponent,
	ContactDetailComponent,
	ContactFormComponent,
];

const DIRECTIVES = [PhoneMaskDirective];

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
	NbRadioModule,
	NbSelectModule,
	NbAccordionModule,
	NbToggleModule,
	NbSpinnerModule,
	NbDialogModule.forChild(),
	NgxTrimDirectiveModule,
	// Material
	MatIconModule,
	MatAutocompleteModule,
	MatMenuModule,
	DragDropModule,
	// Avatar
	AvatarModule,
];
const SERVICES = [];

@NgModule({
	imports: [...MODULES],
	exports: [RouterModule],
	declarations: [...COMPONENTS, ...DIRECTIVES],
	providers: [...SERVICES],
})
export class ContactModule {}
