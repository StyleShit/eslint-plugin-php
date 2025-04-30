import { RuleTester } from 'eslint';
import * as vitest from 'vitest';

RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;
