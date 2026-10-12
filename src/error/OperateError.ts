/**
 * 用户操作不当导致异常
 * @remarks
 * 这种错误全局一般出蓝色错误提示
 * @example
 * ```ts
 * throw new OperateError("手机号未填写");
 * ```
 * @hideconstructor
 */
export class OperateError extends Error {
}
