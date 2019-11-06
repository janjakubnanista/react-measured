import { createUseBoundingBox } from 'react-measured';
import { createChecker } from '../utils/createChecker';
import { measureUsingBoundingClientRect } from '../utils/measureUsingBoundingClientRect';

const checker = createChecker(measureUsingBoundingClientRect);

export const useBoundingBox = createUseBoundingBox(checker);
