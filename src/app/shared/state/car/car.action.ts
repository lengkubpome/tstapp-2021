import { ICar } from "./../../models/car.model";

// tslint:disable-next-line:no-namespace
export namespace CarAction {
	export class FetchCars {
		static readonly type = "[Car] Get Cars";
	}

	export class Add {
		static readonly type = "[Car] Add";

		constructor(public payload: ICar) {}
	}

	export class Edit {
		static readonly type = "[Car] Edit";

		constructor(public payload: ICar, public id: string) {}
	}

	export class Delete {
		static readonly type = "[Car] Delete";

		constructor(public id: string) {}
	}

	export class FetchCarTypes {
		static readonly type = "[Car] Get Car Types";
	}

	// export class FetchOwners {
	// 	static readonly type = "[Car] Fetch Contact All";

	// 	constructor(public payload: ICar, public id: string) {}
	// }
}
