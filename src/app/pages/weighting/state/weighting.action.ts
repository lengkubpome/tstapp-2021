import { IWeighting } from "src/app/shared/models/weighting.model";

// tslint:disable-next-line:no-namespace
export namespace WeightingAction {
	export class FetchAll {
		static readonly type = "[Weighting] Fetch All";
	}

	export class GenerateID {
		static readonly type = "[Weighting] Generate WeightSheet ID";
	}

	export class CreateWeightSheet {
		static readonly type = "[Weighting] Create WeightSheet";
		constructor(public payload: IWeighting) {}
	}

	export class EditWeightSheet {
		static readonly type = "[Weighting] Edit WeightSheet";
		constructor(public payload: IWeighting, public id: string) {}
	}

	export class FetchWeightingType {
		static readonly type = "[Weighting] Weighting Types";
	}
}
