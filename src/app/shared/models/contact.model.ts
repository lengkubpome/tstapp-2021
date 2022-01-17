import { ICar } from "./car.model";

export interface IContact {
	code: string;
	profileUrl?: string;
	mainId?: IContact; // เชื่อมกับร้านค้า

	general?: {
		code?: string;
		name?: string;
		prefixName?: string;
		firstName?: string;
		lastName?: string;

		legalType?: // | "human"
		// | "ordinaryPartnership"
		// | "shop"
		// | "bodyOfPersons"
		// | "companyLimited"
		// | "publicCompanyLimited"
		// | "limitedPartnership"
		// | "foundation"
		// | "association"
		// | "jointVenture"
		// | "other";
		| "บุคคลธรรมดา"
			| "ห้างหุ้นส่วนสามัญ"
			| "ร้านค้า"
			| "คณะบุคคล"
			| "บริษัทจำกัด"
			| "บริษัทมหาชนจำกัด"
			| "ห้างหุ้นส่วนจำกัด"
			| "มูลนิธิ"
			| "สมาคม"
			| "กิจการร่วมค้า"
			| "อื่นๆ";
		taxId?: string;
		branch?: string;
		address?: IAddress;
	};

	communication?: {
		phone?: string; // 'phone' | 'email' | 'line' | 'Web'
		telephone?: string; // 'phone' | 'email' | 'line' | 'Web'
		line?: {
			displayName: string;
			userId: string;
		};
		website?: string;
		email?: string;
		address?: IAddress;
	};

	attribute?: {
		vendor: boolean;
		customer: boolean;
		mainContact: boolean;
	};

	persons?: {
		prefix?: string;
		firstName?: string;
		lastName?: string;
		position?: string;
		phone?: string;
		email?: string;
		status?: string; // 'active' | 'inactive'
		linkContactId?: IContact;
	}[];

	bankAccounts?: IBankAccount[];

	memberClassId?: string;

	locationGoogle?: { lat: number; lng: number };

	carList?: ICar[];
}

export interface IBankAccount {
	main: boolean;
	ownerName?: string;
	bankNumber?: string;
	bankName?: string;
}

interface IAddress {
	contactName?: string;
	line?: string;
	subDistrict?: string;
	district?: string;
	province?: string;
	country?: string;
	postCode?: string;
}

export interface IMemberClass {
	id: string;
	name: string;
	description: string;
}

// export interface IContact1 {
// 	id: string;
// 	businessType: string; // 'Individual'|'Corporate';
// 	name: string;
// 	taxId: string;
// 	type: {
// 		vendor: boolean;
// 		customer: boolean;
// 		// employee: boolean;
// 	};
// 	branchCode?: string;
// 	individual?: {
// 		prefixName?: string;
// 		firstName: string;
// 		lastName: string;
// 		birthDate?: Date;
// 	};
// 	address?: IAddress;
// 	shippingAddress?: IAddress;

// 	primaryContactName?: string;
// 	communicates?: {
// 		phone1: string; // 'phone' | 'email' | 'line' | 'Web'
// 		phone2?: string;
// 		email?: string;
// 		lineId?: string;
// 	};

// 	profileImageUrl?: any;
// 	bankAccount?: IBankAccount;
// 	carList?: ICar[];
// }
