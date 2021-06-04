import { ICarType } from './../../models/car.model';

// tslint:disable-next-line:no-namespace
export namespace CarTypeAction {
	export class FetchAll {
		static readonly type = '[CarType] Fetch All';
	}

	export class Add {
		static readonly type = '[CarType] Add';

		constructor(public payload: ICarType) {}
	}

	export class Edit {
		static readonly type = '[CarType] Edit';

		constructor(public payload: ICarType, public id: string) {}
	}

	export class Delete {
		static readonly type = '[CarType] Delete';

		constructor(public id: string) {}
	}
}
