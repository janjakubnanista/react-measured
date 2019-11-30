import { createUseBoundingBox } from 'react-measured';
import { createHTMLChecker } from './createHTMLChecker';

const checker = createHTMLChecker();

export const useBoundingBox = createUseBoundingBox(checker);
