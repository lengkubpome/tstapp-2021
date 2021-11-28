import { MatPaginatorIntl } from "@angular/material/paginator";

export function CustomPaginator(): any {
	const customPaginatorIntl = new MatPaginatorIntl();

	customPaginatorIntl.itemsPerPageLabel = "จำนวนต่อหน้า:";

	return customPaginatorIntl;
}
