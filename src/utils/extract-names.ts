import { type Identifier } from 'php-parser';

type Nameable = {
	name: string | Identifier;
};

export function extractNames(names: Nameable[]) {
	return names.map(({ name }) =>
		typeof name === 'string' ? name : name.name,
	);
}
