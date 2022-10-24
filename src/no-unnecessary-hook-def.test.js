import { RuleTester } from "eslint";
import Rule from "./no-unnecessary-hook-def.js";

const ruleTester = new RuleTester({
	parserOptions: {
		ecmaVersion: 2015
	}
});


ruleTester.run("foo", Rule, {
	valid: [
		// Calling hook from plain 'ol fn.
		{
			code: `const useThing = () => {
				useEffect();
			}`
		},
		{
			code: `const useThing = () => useMyOtherThing();`
		},
		{
			code: `const useThing = function() {
				useEffect();
			}`
		},
		{
			code: `function useThing() {
				useEffect();
			}`
		},

		// Calling hook from Object method.
		{
			code: `const useThing = () => {
				Namespace.useOtherThing();
			}`
		},
		{
			code: `const useThing = () => Namespace.useOtherThing();`
		},
		{
			code: `const useThing = function(){
				Namespace.useOtherThing();
			}`
		},
		{
			code: `function useThing(){
				Namespace.useOtherThing();
			}`
		},
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
		},
	]
})
