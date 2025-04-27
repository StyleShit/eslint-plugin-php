declare module 'php-parser' {
	// There is a typing issue in `php-parser` that `name` is typed as `string`.
	class Constant extends Node {
		name: string | Identifier;
		value: Node | string | number | boolean | null;
	}

	class Property extends Statement {
		name: string | Identifier;
		value: Node | null;
		readonly: boolean;
		nullable: boolean;
		type: Identifier | Identifier[] | null;
		attrGroups: AttrGroup[];
	}
}
