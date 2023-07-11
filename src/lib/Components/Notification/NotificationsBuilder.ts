import { toast } from '@zerodevx/svelte-toast';

export const NotificationsOptions = {
	duration: 4000 // duration of progress bar tween to the `next` value
	//initial: 1, // initial progress bar value
	//next: 0, // next progress value
	//pausable: false, // pause progress bar tween on mouse hover
	//dismissable: true, // allow dismiss with close button
	//reversed: false, // insert new toast to bottom of stack
	//intro: { x: 256 } // toast intro fly animation settings

	//theme: {}, // css var overrides
	//classes: [] // user-defined classes
};

export function NotificationSuccess(title: string, message: string) {
	const finalMessage =
		`<h5 class="text-lime-800">${title != '' ? title : 'Success'}!</h5>` + message;
	toast.push(finalMessage, {
		duration: 3000,
		theme: {
			'--toastColor': 'mintcream',
			'--toastBackground': 'rgba(72,187,120,0.9)',
			'--toastBarBackground': '#2F855A'
		}
	});
}

export function NotificationError(title: string, message: string) {
	const finalMessage = `<h5 class="text-rose-800">${title != '' ? title : 'Error'}!</h5>` + message;
	toast.push(finalMessage, {
		duration: 3000,
		theme: {
			'--toastColor': 'mintcream',
			'--toastBackground': 'rgb(248 113 113)',
			'--toastBarBackground': 'rgb(220 38 38)'
		}
	});
}

export function NotificationWarning(message: string) {
	const finalMessage = '<h5 class="text-orange-800">Warning!</h5>' + message;
	toast.push(finalMessage, {
		duration: 3000,
		theme: {
			'--toastColor': 'mintcream',
			'--toastBackground': 'rgb(251 146 60)',
			'--toastBarBackground': 'rgb(234 88 12)'
		}
	});
}

export function ClearNotifications() {
	toast.pop(0);
}
