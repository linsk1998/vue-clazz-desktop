import { BizError, EnvError, RequestError, ServerError } from "@ting-ui/vue-desktop";
import { AjaxError, create, ResponseInterceptor } from "sky-ajax";

export default create({
	base: '/mock',
	interceptors: [
		new ResponseInterceptor((result) => {
			if(result.code === 0) {
				return result.data;
			} else {
				throw new BizError(result.msg, {
					code: result.code,
					data: result.data
				});
			}
		}, (error) => {
			if(error) {
				if(error instanceof AjaxError) {
					if(error.status >= 500) {
						let msg: string;
						switch(error.status) {
							case 504:
								msg = "服务器繁忙，请稍后尝试";
								break;
							default:
								msg = "服务器异常，请稍后尝试";
						}
						throw new ServerError(msg, {
							code: error.status,
							cause: error
						});
					} else if(error.status >= 400) {
						let msg: string;
						switch(error.status) {
							case 401:
								msg = "您没有登录";
								break;
							case 403:
								msg = "您没有权限";
								break;
							case 404:
								msg = "页面不存在";
								break;
							case 408:
								msg = "网络请求超时";
								break;
							case 413:
								msg = "您提交的数据过大";
								break;
							case 429:
								msg = "访问过于频繁";
								break;
							default:
								msg = "请求的数据不正确";
						}
						throw new RequestError(msg, {
							code: error.status,
							cause: error
						});
					}
					throw new EnvError("网络异常，请检查网络环境", {
						cause: error
					});
				}
			}
			throw error;
		})
	]
});
