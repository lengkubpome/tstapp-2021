import { ICar } from './car.model';
export interface IWeighting {
	id?: string;
	status:
		| 'success'
		| 'voided'
		| 'await-payment'
		| 'check-out'
		| 'check-in'
		| null;
	type?: string;
	carId?: string;
	contactId?: string; // Contact;
	destination?: string;
	productId?: string; // Product;
	price?: number;
	wIn?: {
		dateTime: Date;
		weight: number;
	};
	wOut?: {
		dateTime: Date;
		weight: number;
	};
	weight?: number;
	weightCut?: {
		amount: number;
		type: 'unit' | '%';
	};
	weightNet?: number;
	amountNet?: number;
	notes?: string;
	payment?: Payment[];
}

export interface Payment {
	date: Date;
	payAccountId: string;
	amount: number;
	note: string;
}

const WeightingDefault: IWeighting = {
	status: null
};

export class Weighting {
	private weighting: IWeighting;

	constructor() {
		this.weighting.status = null;
	}

	public getWeighting(): IWeighting {
		return this.weighting;
	}

	public getStatus(): string {
		return this.weighting.status;
	}

	public getCarId(carId: string): void {
		this.weighting.carId = carId;
	}

	public setCarId(carId: string): void {
		this.weighting.carId = carId;
	}

	public checkIn(): void {}
	public checkOut(): void {}
}
