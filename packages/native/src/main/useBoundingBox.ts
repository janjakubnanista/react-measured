import { createUseBoundingBox } from 'react-measured';
import { NativeChecker } from '../utils/NativeChecker';

const checker = new NativeChecker();

export const useBoundingBox = createUseBoundingBox(checker);
