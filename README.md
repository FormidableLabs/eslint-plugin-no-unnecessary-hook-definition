# `eslint-plugin-no-unnecessary-hook-definition`

This library contains a simple ESLint plugin with a single rule to disallow defining React "hooks" that perhaps shouldn't be considered "hooks". This library enforces the following rule:

> A function should only be considered a React "hook" (e.g., its name starts with `use`) if it calls another hook.

This rule ensures your codebase is not littered with "fake hooks" like the following:

```js
// ❌ This will get flagged
const useFirstName = (person) => {
  return person.firstName;
};
```

since this function, as an example, has no reliance on React or its hook ecosystem and is probably best declared as a plain 'ol function like `getFirstName`.

## Setup & Usage

Start by installing the plugin:

```sh
npm install -D eslint-plugin-no-unnecessary-hook-definition

# Or...

yarn add -D eslint-plugin-no-unnecessary-hook-definition
```

Then add the plugin to your `.eslintrc` configuration file in both the `plugins` and `rules` fields:

```json
{
  "plugins": ["no-unnecessary-hook-definition", "..."],
  "rules": {
    "no-unnecessary-hook-definition/rule": 2
  }
}
```

That's it! Happy coding!
