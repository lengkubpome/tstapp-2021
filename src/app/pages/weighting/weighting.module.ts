import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WeightingInComponent } from './weighting-in/weighting-in.component';
import { RouterModule, Routes } from '@angular/router';
import { WeightingComponent } from './weighting.component';
import {
	NbCardModule,
	NbButtonModule,
	NbSidebarModule,
	NbLayoutModule,
	NbIconModule,
	NbInputModule,
	NbFormFieldModule,
	NbButtonGroupModule,
	NbRadioModule,
	NbTabsetModule,
	NbSelectModule,
	NbContextMenuModule,
	NbListModule
} from '@nebular/theme';
import { ThemeModule } from './../../@theme/theme.module';
import { NgModule } from '@angular/core';
import { WeightSheetComponent } from './weight-sheet/weight-sheet.component';
import { WeightStorageComponent } from './weight-storage/weight-storage.component';

const routes: Routes = [
	{
		path: '',
		component: WeightingComponent
	}
];

@NgModule({
	declarations: [
		WeightingComponent,
		WeightingInComponent,
		WeightSheetComponent,
  WeightStorageComponent
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
		NbSidebarModule,
		ThemeModule,
		NbCardModule,
		NbButtonModule,
		NbLayoutModule,
		NbCardModule,
		NbButtonModule,
		NbIconModule,
		NbInputModule,
		NbFormFieldModule,
		NbButtonGroupModule,
		NbRadioModule,
		NbTabsetModule,
		NbSelectModule,
		NbContextMenuModule,
		NbListModule,
		MatAutocompleteModule,
		MatFormFieldModule,
		MatSortModule,
		NgbModule
	],
	exports: [],
	providers: []
})
export class WeightingModule {}
