# Rounded Hexagon

Making a rounded hexagon DOM element isn't substantial enough to constitute even a mini-project, but I went through enough trouble to do this one thing that I felt the need to write about it.

## Design Requirements

- Must be a DOM element
- Can contain other elements
- Can have an interactive background image

## Ideas

Most obvious way: CSS `clip-path`. Also somewhat tedious because I need to define an SVG path. Also somewhat boring. Maybe there's something better?

I looked around and found this [nice way to make a rounded hexagon](https://stackoverflow.com/a/29560121) and liked it alot. Unfortunately, I was unable to satisfy the interactive background image requirement in a clean and compact implementation.

[Another solution](https://stackoverflow.com/a/65504158) from the same post seemed fairly good, but didn't offer a substantial advantage over the `clip-path` solution.

## Implementation

Unfortunately, I ended up just using `clip-path` with a mostly accurate hexagon.

The implementation of that is very boring.
