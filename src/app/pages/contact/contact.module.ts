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
	NbTooltipModule,
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
import { BankNumberMaskDirective } from "src/app/shared/directives/bank-number-mask.directive";
import { NgxMaskModule } from "ngx-mask";
import { NgxFileDropModule } from "ngx-file-drop";
import { UploadProfileComponent } from './upload-profile/upload-profile.component';

const COMPONENTS = [
	ContactComponent,
	ContactListComponent,
	ContactDetailComponent,
	ContactFormComponent,
];

const DIRECTIVES = [PhoneMaskDirective, BankNumberMaskDirective];

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
	NbTooltipModule,
	NbDialogModule.forChild(),
	NgxTrimDirectiveModule,
	// Material
	MatIconModule,
	MatAutocompleteModule,
	MatMenuModule,
	DragDropModule,
	// Avatar
	AvatarModule,
	// Mask
	NgxMaskModule.forChild(),
	// File Drop
	NgxFileDropModule,
];
const SERVICES = [];

@NgModule({
	imports: [...MODULES],
	exports: [RouterModule],
	declarations: [...COMPONENTS, ...DIRECTIVES, UploadProfileComponent],
	providers: [...SERVICES],
})
export class ContactModule {}
