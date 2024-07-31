import request from '/@/utils/request';

export const useGeneratorModulePreviewApi = (moduleName: any, description: any) => {
	return request({
		url: '/gen/module/preview',
		method: 'get',
		params: {
			moduleName: moduleName,
			description: description
		 },
	});
};