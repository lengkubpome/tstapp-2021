import { ContactListComponent } from "./contact-list/contact-list.component";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
	{
		path: "",
		component: ContactListComponent,
		children: [
			{
				path: "",
				component: ContactListComponent,
			},
			// {
			// 	path: "new",
			// 	component: ContactNewComponent,
			// },
		],
	},
];

export const ContactRoutes = RouterModule.forChild(routes);
