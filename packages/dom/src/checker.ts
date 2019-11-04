import { createChecker } from './utils/createChecker';

import { measureUsingBoundingClientRect } from './utils/measureUsingBoundingClientRect';

export const checker = createChecker(measureUsingBoundingClientRect);
