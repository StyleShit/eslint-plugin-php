import * as vitest from 'vitest';
import { RuleTester } from 'eslint';

RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;
