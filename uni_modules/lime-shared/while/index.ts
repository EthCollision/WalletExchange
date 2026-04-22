// @ts-nocheck

// 来自kux大佬的神之一手
// 原地址 https://ext.dcloud.net.cn/plugin?id=23291
export type ControlCommand = 'continue' | 'break' | null;

export type ControllableWhileReturn = {
	start: () => void;
	abort: () => void;
	execContinue: () => 'continue';
	execBreak: () => 'break';
};

export type Controller = {
	abort: () => void;
};

export function controllableWhile(
	condition : () => boolean,
	body: (controller: Controller) => ControlCommand
): ControllableWhileReturn {
	let isActive = true;
	
	const controller: Controller = {
		abort: () => {
			isActive = false;
		}
	};
	
	const execContinue = () => 'continue';
	const execBreak = () => 'break';
	
	return {
		start: () => {
			// #ifdef APP-ANDROID
			UTSAndroid.getDispatcher('io').async((_) => {
			// #endif
				while (isActive && condition()) {
					const result = body(controller);
					if (result == 'break') {
						controller.abort();
						break;
					} else if (result == 'continue') {
						continue;
					}
				}
			// #ifdef APP-ANDROID
			}, null);
			// #endif
		},
		abort: controller.abort,
		execContinue: execContinue,
		execBreak: execBreak
	} as ControllableWhileReturn;
}