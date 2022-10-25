import { RuleTester } from "eslint";
import { rule } from "./no-unnecessary-hook-def";

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
  },
});

ruleTester.run("foo", rule, {
  valid: [
    // Calling hook from plain 'ol fn.
    {
      code: `const useThing = () => {
				useEffect();
			}`,
    },
    {
      code: `const useThing = () => useMyOtherThing();`,
    },
    {
      code: `const useThing = function() {
    		useEffect();
    	}`,
    },
    {
      code: `function useThing() {
    		useEffect();
    	}`,
    },

    // Calling hook from Object method.
    {
      code: `const useThing = () => {
    		Namespace.useOtherThing();
    	}`,
    },
    {
      code: `const useThing = () => Namespace.useOtherThing();`,
    },
    {
      code: `const useThing = function(){
    		Namespace.useOtherThing();
    	}`,
    },
    {
      code: `function useThing(){
    		Namespace.useOtherThing();
    	}`,
    },

    // Make sure this isn't impacting other "things"
    {
      code: `const x = 13;`,
    },
    {
      code: `const useTheForce = true;`,
    },
  ],

  invalid: [
    {
      code: `const useName = (person) => {
				return person.name;
			}`,
      errors: [{}],
    },
    {
      code: `const useName = (person) => person.name;`,
      errors: [{}],
    },
    {
      code: `const useName = function(person){
    		return person.name;
    	}`,
      errors: [{}],
    },
    {
      code: `function useName(person) {
    		return person.name
    	}`,
      errors: [{}],
    },
  ],
});
