import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Action, NgxsOnInit, Selector, State, StateContext } from "@ngxs/store";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";

export class FetchBanks {
	static readonly type = "[Bank] Fetch Banks";
}

interface IBank {
	symbol: string;
	name_th: string;
	name_en: string;
}

export interface BankStateModel {
	banks: IBank[];
}

@State<BankStateModel>({
	name: "bank",
	defaults: { banks: [] },
})
@Injectable()
export class BankState implements NgxsOnInit {
	constructor(private http: HttpClient) {}
	ngxsOnInit(ctx?: StateContext<any>): void {
		console.log(
			`%cBankState => State initialized`,
			"color:white; background:orange;"
		);

		ctx.dispatch(new FetchBanks());
	}

	@Action(FetchBanks)
	fetchBank(ctx: StateContext<BankStateModel>): Observable<IBank[] | any> {
		return this.http.get<IBank[]>("assets/data/banks.json").pipe(
			tap((result) => {
				ctx.patchState({
					banks: result,
				});
			}),
			catchError((error) => {
				console.error(
					`%cBankState => @Action:fetchBank ${error}`,
					"color:white; background:red;"
				);
				console.log(error);

				return of(error);
			})
		);
	}
}
