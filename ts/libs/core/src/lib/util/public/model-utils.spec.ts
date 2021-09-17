/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { initSelf, isValueEqual } from './model-utils';
import { InterfaceOf } from './util-types';

describe('initSelf()', () => {

    class Person {
        name: string;
        surname: string;
        spouse?: Person;

        constructor(initData?: Partial<Person>) {
            initSelf(this, initData);
        }
    }

    class PersonWithChildren extends Person {
        children?: Person[];

        constructor(initData?: Partial<PersonWithChildren>) {
            super(initData);
            initSelf(this, initData);
        }
    }

    class PersonWithNickname extends Person {
        nickname = 'Johnny';

        constructor(initData?: Partial<PersonWithNickname>) {
            super(initData);
            initSelf(this, initData);
        }
    }

    it('works with undefined', () => {
        const p = new Person();
        expect(p instanceof Person).toBe(true);
        expect(p.name).toBeUndefined();
        expect(p.surname).toBeUndefined();
        expect(p.spouse).toBeUndefined();
    });

    it('works with full init data', () => {
        const spouse = new Person();
        spouse.name = 'Jane';
        spouse.surname = 'Doe';

        const p = new Person({
            name: 'John',
            surname: 'Doe',
            spouse,
        });

        expect(p instanceof Person).toBe(true);
        expect(p.name).toEqual('John');
        expect(p.surname).toEqual('Doe');
        expect(p.spouse).toBe(spouse);
    });

    it('works with partial init data', () => {
        const p = new Person({
            surname: 'Doe',
        });

        expect(p instanceof Person).toBe(true);
        expect(p.name).toBeUndefined();
        expect(p.surname).toEqual('Doe');
        expect(p.spouse).toBeUndefined();
    });

    it('works for subclasses', () => {
        const spouse = new Person();
        spouse.name = 'Jane';
        spouse.surname = 'Doe';
        const children = [
            new Person({ name: 'Junior', surname: 'Doe' }),
        ]

        const p = new PersonWithChildren({
            name: 'John',
            surname: 'Doe',
            spouse,
            children,
        });

        expect(p instanceof PersonWithChildren).toBe(true);
        expect(p.name).toEqual('John');
        expect(p.surname).toEqual('Doe');
        expect(p.spouse).toBe(spouse);
        expect(p.children).toBe(children);
    });

    it('overwrites default values if they are specified', () => {
        const p = new PersonWithNickname({
            name: 'John',
            surname: 'Doe',
            nickname: 'Champ',
        });

        expect(p instanceof PersonWithNickname).toBe(true);
        expect(p.name).toEqual('John');
        expect(p.surname).toEqual('Doe');
        expect(p.nickname).toEqual('Champ');
    });

    it('does not overwrite default values if they are not specified', () => {
        const p = new PersonWithNickname({
            name: 'John',
            surname: 'Doe',
        });

        expect(p instanceof PersonWithNickname).toBe(true);
        expect(p.name).toEqual('John');
        expect(p.surname).toEqual('Doe');
        expect(p.nickname).toEqual('Johnny');
    });

});

describe('isValueEqual()', () => {

    class Person {
        spouse?: Person;
        children?: Person[];

        constructor(
            public name: string,
            public surname: string,
        ) {}
    }

    function createPlainPersonObj(name: string, surname: string): InterfaceOf<Person> {
        return { name, surname };
    }

    describe('returns true', () => {

        it('for a === b', () => {
            const a = new Person('John', 'Doe');
            expect(isValueEqual(a, a)).toBe(true);
        });

        it('for a = null & b = null', () => {
            expect(isValueEqual(null, null)).toBe(true);
        });

        it('for a = undefined & b = undefined', () => {
            expect(isValueEqual(undefined, undefined)).toBe(true);
        });

        it('for equal numbers', () => {
            expect(isValueEqual(10, 10)).toBe(true);
        });

        it('for equal strings', () => {
            expect(isValueEqual('test', 'test')).toBe(true);
        });

        it('for equal plain objects', () => {
            const a = createPlainPersonObj('John', 'Doe');
            const b = createPlainPersonObj('John', 'Doe');
            expect(isValueEqual(a, b)).toBe(true);
        });

        it('for equal class instances', () => {
            const a = new Person('John', 'Doe');
            const b = new Person('John', 'Doe');
            expect(isValueEqual(a, b)).toBe(true);
        });

        it('for value-equal class instance (a) and plain object (b)', () => {
            const a = new Person('John', 'Doe');
            const b = createPlainPersonObj('John', 'Doe');
            expect(isValueEqual(a, b)).toBe(true);
        });

        it('for value-equal plain object (a) and class instance (b)', () => {
            const a = createPlainPersonObj('John', 'Doe');
            const b = new Person('John', 'Doe');
            expect(isValueEqual(a, b)).toBe(true);
        });

        it('for nested class instance/plain object', () => {
            const a = new Person('John', 'Doe');
            a.spouse = new Person('Jane', 'Doe');

            const b = createPlainPersonObj('John', 'Doe');
            b.spouse = createPlainPersonObj('Jane', 'Doe');

            expect(isValueEqual(a, b)).toBe(true);
        });

        it('for nested array', () => {
            const a = new Person('John', 'Doe');
            a.spouse = new Person('Jane', 'Doe');
            a.children = [
                new Person('Junior', 'Doe'),
                new Person('Junior2', 'Doe'),
            ];

            const b = createPlainPersonObj('John', 'Doe');
            b.spouse = createPlainPersonObj('Jane', 'Doe');
            b.children = [
                createPlainPersonObj('Junior', 'Doe'),
                createPlainPersonObj('Junior2', 'Doe'),
            ];

            expect(isValueEqual(a, b)).toBe(true);
        });

    });

    describe('returns false', () => {

        it('for a = null & b = class instance', () => {
            const p = new Person('John', 'Doe');
            expect(isValueEqual(null, p)).toBe(false);
        });

        it('for a = class instance & b = null', () => {
            const p = new Person('John', 'Doe');
            expect(isValueEqual(p, null)).toBe(false);
        });

        it('for a = undefined & b = class instance', () => {
            const p = new Person('John', 'Doe');
            expect(isValueEqual(undefined, p)).toBe(false);
        });

        it('for a = class instance & b = undefined', () => {
            const p = new Person('John', 'Doe');
            expect(isValueEqual(p, undefined)).toBe(false);
        });

        it('for unequal numbers', () => {
            expect(isValueEqual(10, 20)).toBe(false);
        });

        it('for unequal strings', () => {
            expect(isValueEqual('test', 'something else')).toBe(false);
        });

        it('for unequal plain objects', () => {
            const a = createPlainPersonObj('John', 'Doe');
            const b = createPlainPersonObj('Jane', 'Doe');
            expect(isValueEqual(a, b)).toBe(false);
        });

        it('for plain objects with different property counts', () => {
            const a = createPlainPersonObj('John', 'Doe');
            const b = createPlainPersonObj('John', 'Doe');
            b.spouse = createPlainPersonObj('Jane', 'Doe');
            expect(isValueEqual(a, b)).toBe(false);
        });

        it('for unequal class instances', () => {
            const a = new Person('John', 'Doe');
            const b = new Person('Jane', 'Doe');
            expect(isValueEqual(a, b)).toBe(false);
        });

        it('for value-unequal class instance (a) and plain object (b)', () => {
            const a = new Person('John', 'Doe');
            const b = createPlainPersonObj('John', 'Johnson');
            expect(isValueEqual(a, b)).toBe(false);
        });

        it('for value-unequal plain object (a) and class instance (b)', () => {
            const a = createPlainPersonObj('John', 'Doe');
            const b = new Person('John', 'Johnson');
            expect(isValueEqual(a, b)).toBe(false);
        });

        it('for unequal nested class instance object', () => {
            const a = new Person('John', 'Doe');
            a.spouse = new Person('Jane', 'Doe');

            const b = new Person('John', 'Doe');
            b.spouse = new Person('Janet', 'Doe');

            expect(isValueEqual(a, b)).toBe(false);
        });

        it('for nested arrays with unequal objects', () => {
            const a = new Person('John', 'Doe');
            a.spouse = new Person('Jane', 'Doe');
            a.children = [
                new Person('Junior', 'Doe'),
                new Person('Junior2', 'Doe'),
            ];

            const b = new Person('John', 'Doe');
            b.spouse = new Person('Jane', 'Doe');
            b.children = [
                new Person('Junior', 'Doe'),
                new Person('Junior3', 'Doe'),
            ];

            expect(isValueEqual(a, b)).toBe(false);
        });

        it('for nested arrays with unequal lengths', () => {
            const a = new Person('John', 'Doe');
            a.spouse = new Person('Jane', 'Doe');
            a.children = [
                new Person('Junior', 'Doe'),
                new Person('Junior2', 'Doe'),
            ];

            const b = new Person('John', 'Doe');
            b.spouse = new Person('Jane', 'Doe');
            b.children = [
                new Person('Junior', 'Doe'),
                new Person('Junior2', 'Doe'),
                new Person('Junior3', 'Doe'),
            ];

            expect(isValueEqual(a, b)).toBe(false);
        });

    });

});
