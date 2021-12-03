import { IContact } from "./contact.model";
import { Observable } from "rxjs";
export interface ICar {
	id: string;
	plateLCN: string; // Plate License Number
	plateLCP?: string; // Plate License Province
	type?: ICarType; // ICarType Id
}

export interface ICarType {
	id: string;
	name: string;
}

export interface ICarContact {
	car: ICar;
	contact: IContact;
	frequency: number;
}
