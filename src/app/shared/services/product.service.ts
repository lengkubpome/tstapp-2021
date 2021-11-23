import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IProduct } from "../models/product.model";
import { HttpClient } from "@angular/common/http";
@Injectable({
	providedIn: "root",
})
export class ProductService {
	constructor(private afs: AngularFirestore, private http: HttpClient) {}

	// getProducts(): Observable<IProduct[]> {
	// 	return this.http.get<IProduct[]>('assets/data/product-dummy.json');
	// }

	getProducts(): Observable<IProduct[]> {
		const productCollection = this.afs.collection<IProduct>("products");
		return productCollection.valueChanges();
	}
}
