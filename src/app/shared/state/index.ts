import { SystemState } from "./system/system.state";
import { ProvinceState } from "./province/province.state";
import { ContactState } from "./contact/contact.state";
import { ProductState } from "./product/product.state";
import { CarState } from "./car/car.state";
import { SettingState } from "./setting/setting.state";

export const stateList = [
	SystemState,
	CarState,
	ProductState,
	ContactState,
	ProvinceState,
	SettingState,
];
