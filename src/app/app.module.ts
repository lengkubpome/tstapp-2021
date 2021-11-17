import { environment } from "./../environments/environment";
import { stateList } from "./shared/state";
import { ThemeModule } from "./@theme/theme.module";
import { CoreModule } from "./@core/core.module";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
	NbThemeModule,
	NbLayoutModule,
	NbSidebarModule,
	NbMenuModule,
	NbDatepickerModule,
	NbDialogModule,
	NbWindowModule,
	NbToastrModule,
} from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { AppRoutingModule } from "./app-routing.module";
import { NgxsModule } from "@ngxs/store";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { HttpClientModule } from "@angular/common/http";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { provideFirestore, getFirestore } from "@angular/fire/firestore";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireModule } from "@angular/fire/compat";

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		NbThemeModule.forRoot(),
		NbLayoutModule,
		NbEvaIconsModule,
		AppRoutingModule,
		NbLayoutModule,
		NbSidebarModule.forRoot(),
		NbMenuModule.forRoot(),
		NbDatepickerModule.forRoot(),
		NbDialogModule.forRoot(),
		NbWindowModule.forRoot(),
		NbToastrModule.forRoot(),
		CoreModule.forRoot(),
		ThemeModule.forRoot(),
		// NGXS
		NgxsModule.forRoot([...stateList], {
			developmentMode: !environment.production,
		}),
		NgxsLoggerPluginModule.forRoot(),
		NgxsReduxDevtoolsPluginModule.forRoot(),
		// Firebase
		provideFirebaseApp(() => initializeApp(environment.firebase)),
		provideAuth(() => getAuth()),
		provideFirestore(() => getFirestore()),
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule,
		AngularFireAuthModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
