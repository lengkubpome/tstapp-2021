import { IWeighting } from 'src/app/shared/models/weighting.model';

// tslint:disable-next-line:no-namespace
export namespace WeightingAction {
	export class FetchAll {
		static readonly type = '[Weighting] Fetch All';
	}

	export class NewId {
		static readonly type = '[Weighting] New ID';
	}

	export class Add {
		static readonly type = '[Weighting] Add';

		constructor(public payload: IWeighting) {}
	}

	export class Edit {
		static readonly type = '[Weighting] Edit';

		constructor(public payload: IWeighting, public id: string) {}
	}

	export class Void {
		static readonly type = '[Weighting] Void';

		constructor(public id: string) {}
	}
}
