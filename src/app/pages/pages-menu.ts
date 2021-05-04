import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
	{
		title: 'ชั่งน้ำหนัก',
		icon: 'home-outline',
		link: '/pages/weighting',
		home: true
	},
	// {
	// 	title: 'FEATURES',
	// 	group: true
	// },
	{
		title: 'รายรับ',
		icon: 'layout-outline',
		children: [
			// {
			// 	title: 'ภาพรวม',
			// 	link: '/pages/layout/stepper'
			// },
			{
				title: 'ขายสินค้า',
				link: '/pages/layout/list'
			}
		]
	},
	{
		title: 'รายจ่าย',
		icon: 'edit-2-outline',
		children: [
			{
				title: 'การซื้อสินค้า',
				link: '/pages/forms/inputs'
			},
			{
				title: 'ค่าใช้จ่าย',
				link: '/pages/forms/layouts'
			}
		]
	},
	{
		title: 'ผู้ติดต่อ',
		icon: 'keypad-outline',
		link: '/pages/ui-features'
	},
	{
		title: 'สินค้า',
		icon: 'browser-outline'
	},
	{
		title: 'ตั้งค่า',
		icon: 'message-circle-outline',
		children: [
			{
				title: 'ข้อมูลองค์กร',
				link: '/pages/extra-components/calendar'
			},
			{
				title: 'ข้อมูลเอกสาร',
				link: '/pages/extra-components/progress-bar'
			},
			{
				title: 'เครื่องชั่งน้ำหนัก',
				link: '/pages/extra-components/progress-bar'
			},
			{
				title: 'ผู้ใช้งาน',
				link: '/pages/extra-components/spinner'
			}
		]
	}
];
