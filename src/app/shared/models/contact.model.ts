export interface IContact {
	id: string;
	firstName: string;
	lastName?: string;
	address?: string;
	bankAccount?: IBankAccount[];
}

export interface IBankAccount {
	bankName: string;
	accountName: string;
	accountNumber: string;
}
