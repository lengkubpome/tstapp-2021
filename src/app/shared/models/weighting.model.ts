export interface Weighting {
	id: string;
	status: 'done' | 'check-out' | 'check-in';
	type: string;
	carId: string;
	contactId?: string; // Contact;
	destination?: string;
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
