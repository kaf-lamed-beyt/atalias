# atalias | [ah tah lias] | (@)-alias

at (@) custom aliases for your Next.js projects, without the forward slashes

## Why?

When you create an app or website with Next.js, you get the option to add custom [import aliases](https://nextjs.org/docs/advanced-features/module-path-aliases). Before this feature, I've used custom aliases and I've been quite attached to using the **at(@)-aliases**

Next.js allows you customize this, actually. So you can decide to use any character you like, to represent your custom aliases. The **at(@)alias** that Next.js provides has a forward-slash in front of it &mdash; i have no idea why it is like that,

And I think it is like that, irrespective of the symbol you decide to use. So you get that trailing forward-slash accompanying your import definitions.

So, a typical component that would appear like this, for me, previously:

```tsx
import SideBar from "@components/sidebar";
```

Became:

```tsx
import SideBar from "@/components/sidebar";
```

I wasn't satisfied. No. I did not like it. I think my issues are just too much. Most of the time, I'd find myself, editing the `compilerOptions` in `tsconfig.json` &mdash; `jsconfig.json`, majority of the time.

**Why not automate it?** &mdash; And here I am. Hopefully, you'd find it useful.

## Usage

Install the package with npm, yarn or pnpm, globally

```bash
npm install -g atalias
```

If you're on linux, consider adding the `sudo` prefix before "npm"

The tool assumes that you have a `src` folder in your project. To create an alias, you can type the command below into your terminal.

```bash
create-atalias src/components
```

To create multiple aliases at a time, you can do so by making the entries comma-separated like so:

```bash
create-atalias src/hooks, src/layouts, src/containers, src/utils
```

## Options

Say you forgot the aliases you have created, and to avoid conflicting aliases, you can list all the aliases you have in the terminal by adding the `-l` flag to **create-atalias** like so:

```bash
create-atalias -l
```

## Contributing.

See something that doesn't look good? &mdash; even in this README, typos fit plenty. Shoot a PR.

## LICENSE

[MIT](LICENSE) © 2023 kaf-lamed-beyt
