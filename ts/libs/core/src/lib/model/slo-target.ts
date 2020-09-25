import { SlocType } from '../transformation';
import { ObjectReference } from './object-reference';

export class SloTarget {

    @SlocType(() => ObjectReference)
    targetRef: ObjectReference;

}
