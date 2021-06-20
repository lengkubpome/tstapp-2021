import { WeightingService } from './weighting.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
	NbListModule,
	NbTooltipModule,
	NbDialogModule
} from '@nebular/theme';
import { ThemeModule } from './../../@theme/theme.module';
import { NgModule } from '@angular/core';
import { AvatarModule } from 'ngx-avatar';
import { WeightSheetComponent } from './weight-sheet/weight-sheet.component';
import { CarInfoComponent } from './car-info/car-info.component';
import { WeightStorageComponent } from './weight-storage/weight-storage.component';
import { NgxsModule } from '@ngxs/store';
import { ContactInfoComponent } from './contact-info/contact-info.component';

const routes: Routes = [
	{
		path: '',
		component: WeightingComponent
	}
];

@NgModule({
	declarations: [
		WeightingComponent,
		WeightSheetComponent,
		WeightStorageComponent,
		CarInfoComponent,
		ContactInfoComponent
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
		NbTooltipModule,
		MatAutocompleteModule,
		MatFormFieldModule,
		MatSortModule,
		MatSelectModule,
		MatBadgeModule,
		NgbModule,
		NbDialogModule.forChild(),
		NgxsModule.forFeature([]),
		AvatarModule
	],
	exports: [],
	providers: [ WeightingService ]
})
export class WeightingModule {}
