import { ContactComponent } from "./contact.component";
import { ContactListComponent } from "./contact-list/contact-list.component";
import { Routes, RouterModule } from "@angular/router";
import { ContactDetailComponent } from "./contact-detail/contact-detail.component";

const routes: Routes = [
	{
		path: "",
		component: ContactComponent,
		children: [
			{
				path: "",
				component: ContactListComponent,
			},
			{
				path: ":id",
				component: ContactDetailComponent,
			},
		],
	},
	// {
	// 	path: "**",
	// 	component: ContactComponent,
	// },
];

export const ContactRoutes = RouterModule.forChild(routes);
