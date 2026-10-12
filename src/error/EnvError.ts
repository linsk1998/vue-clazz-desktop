/**
 * 程序运行环境错误
 * @remarks
 * 这种错误全局一般出红色错误提示
 * @example
 * ```ts
 * throw new EnvError("网络异常，请检查网络信号");
 * ```
 * ```ts
 * throw new EnvError("定位失败，请检查是否开启GPS");
 * ```
 * @hideconstructor
 */
export class EnvError extends Error {
}
