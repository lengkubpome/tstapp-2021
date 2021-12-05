import { Component, OnDestroy } from "@angular/core";
import { RouterDataResolved } from "@ngxs/router-plugin";
import { Actions, ofActionSuccessful } from "@ngxs/store";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
	selector: "app-root",
	template: "<router-outlet></router-outlet>",
})
export class AppComponent implements OnDestroy {
	private destroy$ = new Subject<void>();

	constructor(actions$: Actions) {
		actions$
			.pipe(ofActionSuccessful(RouterDataResolved), takeUntil(this.destroy$))
			.subscribe((action: RouterDataResolved) => {
				console.log(action.routerState.root.firstChild.data);
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
