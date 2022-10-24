import { RuleTester } from "eslint";
import Rule from "./no-unnecessary-hook-def.js";

const ruleTester = new RuleTester({
	parserOptions: {
		ecmaVersion: 2015
	}
});


ruleTester.run("foo", Rule, {
	valid: [
		{
			code: `const x = 3;`
		},
		// {
		// 	code: `const useThing = () => {
		// 		const f = useOtherThing();
		// 	}`
		// },
		// {
		// 	code: `const useThing = function() {
		// 		const f = useOtherThing();
		// 	}`
		// },
		// {
		// 	code: `function useThing() {
		// 		const f = useOtherThing();
		// 	}`
		// }
	],

	invalid: [
		{
			code: `const useName = (person) => {
				return person.name;
			}`,
			errors: [{}]
		},
		{
			code: `const useName = (person) => person.name;`,
			errors: [{}]
		},
		{
			code: `const useName = function(person){
				return person.name;
			}`,
			errors: [{}]
		},
		{
			code: `function useName(person) {
				return person.name
			}`,
			errors: [{}]
		}
	]
})
