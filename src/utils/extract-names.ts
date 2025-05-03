import { type Identifier } from 'php-parser';

type Nameable = {
	name: string | Identifier;
};

export function extractNames(names: Nameable[]) {
	return names.map(extractName);
}

export function extractName(name: Nameable) {
	return typeof name.name === 'string' ? name.name : name.name.name;
}
