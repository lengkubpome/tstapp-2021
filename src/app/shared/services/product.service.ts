import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IProduct, ProductData } from "../models/product.model";
import { HttpClient } from "@angular/common/http";
@Injectable({
	providedIn: "root",
})
export class ProductService extends ProductData {
	constructor(private afs: AngularFirestore, private http: HttpClient) {
		super();
	}

	// getProducts(): Observable<IProduct[]> {
	// 	return this.http.get<IProduct[]>('assets/data/product-dummy.json');
	// }

	getProducts(): Observable<IProduct[]> {
		const productCollection = this.afs.collection<IProduct>("products");
		return productCollection.valueChanges();
	}
}
