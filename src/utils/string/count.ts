/** 按 JS 字符数（UTF-16 码元）计算长度，注意 emoji 记 2 */
export function countLength(str: string): number {
	return str ? str.length : 0;
}

/** 按 UTF-8 计算字节数 */
export function countUtf8Bytes(str: string): number {
	if(!str) return 0;
	let len = 0;
	for(let i = 0; i < str.length; i++) {
		const code = str.codePointAt(i)!;
		if(code < 0x80) len += 1;
		else if(code < 0x800) len += 2;
		else if(code < 0x10000) len += 3;
		else len += 4;                 // 增补平面（emoji 等）
		if(code > 0xffff) i++;        // 消费了代理对，跳过低代理码元
	}
	return len;
}

/** 按 UTF-16 计算字节数 */
export function countUtf16Bytes(str: string): number {
	return str ? str.length * 2 : 0;
}

/**
 * 按"半角 1 字节、全角 2 字节"计算（双字节字符集口径，业务常用）
 * 即 ASCII < 0x80 记 1，其余（中日韩、全角标点等）记 2；emoji 记 2
 */
export function countDbcBytes(str: string): number {
	if(!str) return 0;
	let len = 0;
	for(let i = 0; i < str.length; i++) {
		const code = str.codePointAt(i)!;
		len += code < 0x80 ? 1 : 2;
		if(code > 0xffff) i++;
	}
	return len;
}

/** 零宽连接符（不可见，不计数） */
const ZWJ = 0x200D;

/**
 * 按用户感知字符数计算：每个码点算 1，ZWJ 连接符不计
 * 不合并 emoji 序列——"👨👩👧" 按看到的样子算 3
 */
export function countGraphemes(str: string): number {
	if(!str) return 0;
	let count = 0;
	for(let i = 0; i < str.length; i++) {
		const code = str.codePointAt(i)!;
		if(code !== ZWJ) count++;
		if(code > 0xffff) i++;   // codePointAt 已合成代理对，跳过低码元
	}
	return count;
}
