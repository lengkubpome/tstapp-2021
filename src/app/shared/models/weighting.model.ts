export interface Weighting {
	id: string;
	status: 'done' | 'check-out' | 'check-in';
	type: string;
	carId: string;
	contactId?: string; // Contact;
	productId: string; // Product;
	price: number;
	wIn: {
		dateTime: Date;
		weight: number;
	};
	wOut: {
		dateTime: Date;
		weight: number;
	};
	weight: number;
	weightCut?: {
		amount: number;
		unit: 'kg' | '%';
	};
	weightNet?: number;
	amountNet?: number;
	comment?: string;
	payment?: Payment[];
}

export interface Payment {
	date: Date;
	payAccountId: string;
	amount: number;
	note: string;
}
