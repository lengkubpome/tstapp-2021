import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IContact } from "../models/contact.model";

@Injectable({
	providedIn: "root",
})
export class ContactService {
	constructor(private http: HttpClient) {}

	getContacts(): Observable<IContact[]> {
		return this.http.get<IContact[]>("assets/data/contact-dummy2.json");
	}
}
