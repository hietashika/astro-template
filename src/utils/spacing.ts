/**
 * スペーシング属性の値からクラス名を生成するヘルパー関数
 * padding, margin, gap などのスペーシング属性に使用可能
 *
 * @param value - 属性値（例：'1', '-2', '3'）
 * @param prefix - クラス名のプレフィックス（例：'padding', 'margin', 'gap'）
 * @returns 生成されたクラス名（例：'padding--1', 'margin--neg2'）
 */
export function getSpacingClass(
	value: string | undefined,
	prefix: string,
): string {
	if (!value) return "";

	// マイナス値の処理
	if (value.startsWith("-")) {
		return `${prefix}--neg${value.substring(1)}`;
	}

	return `${prefix}--${value}`;
}

/**
 * CSSのショートハンド記法のスペーシング値を解析し、方向ごとのクラス名を生成する
 * padding: "1 2 3 4" -> [paddingTop--1, paddingRight--2, paddingBottom--3, paddingLeft--4]
 * margin: "1 2" -> [marginBlock--1, marginInline--2]
 * 
 * @param value - ショートハンド記法の値（例: '1', '1 2', '1 2 3', '1 2 3 4'）
 * @param basePrefix - 基本となるプレフィックス（例: 'padding', 'margin'）
 * @returns 生成されたクラス名の配列
 */
export function parseSpacingShorthand(
	value: string | undefined,
	basePrefix: string,
): string[] {
	if (!value) return [];

	const values = value.trim().split(/\s+/);
	const result: string[] = [];

	// CSSのショートハンド記法に従って処理
	if (values.length === 1) {
		// 全方向同じ値: padding: 1 -> padding--1
		return [getSpacingClass(values[0], basePrefix)];
	} else if (values.length === 2) {
		// 上下・左右: padding: 1 2 -> paddingBlock--1, paddingInline--2
		const [blockVal, inlineVal] = values;
		// Block方向（上下）
		if (blockVal) result.push(getSpacingClass(blockVal, `${basePrefix}Block`));
		// Inline方向（左右）
		if (inlineVal) result.push(getSpacingClass(inlineVal, `${basePrefix}Inline`));
	} else if (values.length === 3) {
		// 上・左右・下: padding: 1 2 3 -> paddingTop--1, paddingInline--2, paddingBottom--3
		const [topVal, inlineVal, bottomVal] = values;
		// 上
		if (topVal) result.push(getSpacingClass(topVal, `${basePrefix}Top`));
		// 左右
		if (inlineVal) result.push(getSpacingClass(inlineVal, `${basePrefix}Inline`));
		// 下
		if (bottomVal) result.push(getSpacingClass(bottomVal, `${basePrefix}Bottom`));
	} else if (values.length === 4) {
		// 上・右・下・左: padding: 1 2 3 4 -> paddingTop--1, paddingRight--2, paddingBottom--3, paddingLeft--4
		const [topVal, rightVal, bottomVal, leftVal] = values;
		// 上
		if (topVal) result.push(getSpacingClass(topVal, `${basePrefix}Top`));
		// 右
		if (rightVal) result.push(getSpacingClass(rightVal, `${basePrefix}Right`));
		// 下
		if (bottomVal) result.push(getSpacingClass(bottomVal, `${basePrefix}Bottom`));
		// 左
		if (leftVal) result.push(getSpacingClass(leftVal, `${basePrefix}Left`));
	}

	return result;
}

/**
 * 複数のスペーシング属性からクラス名を生成するヘルパー関数
 *
 * @param values - 属性値のオブジェクト（例：{ padding: '1', margin: '2' }）
 * @returns 生成されたクラス名の配列
 */
export function getSpacingClasses(
	values: Record<string, string | undefined>,
): string[] {
	const result: string[] = [];

	Object.entries(values)
		.filter(([_, value]) => value !== undefined)
		.forEach(([prefix, value]) => {
			// paddingとmarginの場合はショートハンド対応
			if (prefix === 'padding' || prefix === 'margin') {
				const shorthandClasses = parseSpacingShorthand(value, prefix);
				result.push(...shorthandClasses);
			} else {
				// その他の属性は従来通り
				result.push(getSpacingClass(value, prefix));
			}
		});

	return result;
}

/**
 * Gapプロパティのための特殊なクラス名生成ヘルパー関数
 * スペースで区切られた2つの値（row-gap column-gap）をサポート
 *
 * @param value - gap属性値（例：'1', '2 3'）
 * @param options - オプション設定
 * @returns 生成されたクラス名または複数のクラス名
 */
export function getGapClasses(
	value: string | undefined,
	options: {
		useDimensionalProps?: boolean; // trueの場合row-gap/column-gap属性を使用、falseの場合クラス名を使用
		rowPrefix?: string; // 行方向のプロパティ名・クラス名（デフォルト: 'rowGap'）
		columnPrefix?: string; // 列方向のプロパティ名・クラス名（デフォルト: 'columnGap'）
		defaultPrefix?: string; // 単一値の場合のプロパティ名・クラス名（デフォルト: 'gap'）
	} = {},
): string[] | Record<string, string> {
	const {
		useDimensionalProps = false,
		rowPrefix = "rowGap",
		columnPrefix = "columnGap",
		defaultPrefix = "gap",
	} = options;

	if (!value) return useDimensionalProps ? {} : [];

	// スペースで区切られた値かチェック
	const values = value.trim().split(/\s+/);

	if (values.length === 1) {
		// 単一の値の場合
		return useDimensionalProps
			? { [defaultPrefix]: value }
			: [getSpacingClass(value, defaultPrefix)];
	}

	if (values.length === 2) {
		// 2つの値がある場合、row-gapとcolumn-gap
		const [rowGap, columnGap] = values;

		return useDimensionalProps
			? { [rowPrefix]: rowGap, [columnPrefix]: columnGap }
			: [
					getSpacingClass(rowGap, rowPrefix),
					getSpacingClass(columnGap, columnPrefix),
				];
	}

	// 不正な形式の場合
	return useDimensionalProps ? {} : [];
}

/**
 * フォントサイズクラスを取得する
 * @param fontSize フォントサイズの値
 * @returns フォントサイズのクラス名
 */
export function getFontSizeClass(fontSize: string | undefined): string {
	console.log(`getFontSizeClass called with: ${fontSize}`);
	if (!fontSize) return "";
	return `font-size-${fontSize}`;
}