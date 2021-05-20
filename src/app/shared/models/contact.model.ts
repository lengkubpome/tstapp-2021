export interface Contact {
	id: string;
	firstName: string;
	lastName?: string;
	bankAccount?: BankAccount[];
}

export interface BankAccount {
	bankName: string;
	accountName: string;
	accountNumber: string;
}
