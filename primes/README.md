# Polar Prime Spiral

This mini-project focuses on a simple and fast visualization of prime numbers plotted in polar coordinates in which each prime $p$ maps to $(r, \theta) = (p, p)$.

## Design Requirements

This visualization is designed strictly for use in my web portfolio, so I arbitrarily constructed a few design requirements:

- Graph primes up to around 10,000
- Points should have smooth hover effects and a tooltip to see which prime it corresponds to
- Residual classes corresponding to the visible arms (mod 22 or 44 are suggested by theory) should be animated
- Must run smoothly on mobile
- No precomputing (possibly negative performance impact for no empirical reason, this one is just for fun)

## Finding Primes

Since we will need to find the primes less than $n$ for some selection $n$, we are not necessarily interested in the fastest algorithms for verifying if a particular $m$ is prime since the time complexity $O(f(m))$ may be slow since applying over the entire domain of interest can convert our fast $O(f(m))$ to a slow $O(n \cdot f(m))$.

After some brief reading, the [Sieve of Eratosthenes](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes) was a clear theoretical frontrunner with a time complexity of $O(n \cdot \log(\log(n)))$. However, there are known [examples](https://youtu.be/sX2nF1fW7kI?si=lzpgIdKQMz96b_Cu&t=2113) of theoretically optimized algorithms performing worse than trivial competitors on unfriendly data.

I decided to add two more algorithms as a baseline: "fast trivial" and "past search". The fast trivial algorithm is the simplest brute-force algorithm with the optimization of using $\sqrt{n}$ as the upper bound for factor checking. The past search algorithm is a stronger optimization of fast trivial that only checks within list of known primes, which must contain all primes less than $n$ when searching for $n$'s factors by induction.

The time complexity of fast trivial is $O(n \cdot \sqrt{n})$

The time complexity of past search is $O(n \cdot \pi(\sqrt{n}))$ where $\pi$ is the [prime-counting function](https://en.wikipedia.org/wiki/Prime-counting_function). This is asymptotically $O(n \cdot \sqrt{n} / \log(n))$ by the [prime number theorem](https://en.wikipedia.org/wiki/Prime_number_theorem).

Some performance benchmarking reveals that the order of these asymptotic time complexities remain relevant with the scale of data for this project. See `analysis.ipynb`

In summary, the benchmark results confirmed that, for larger $n$, the algorithms very clearly follow the relative order predicted by their asymptotic time complexities. When $n = 50,000$, the order is still preserved but the difference in performance is fairly small. Decreasing this $n$ to scales relevant for this project, it turns out that the selection of algorithm has no substantial measurable effect on runtime. Nevertheless, I chose to implement the Sieve of Eratosthenes because 1) it sounds more interesting, 2) it's still technically faster, and 3) it scales better for if I decide to dramatically increase the prime count in the future.

With some additional optimizations like using a `Uint8Array` instead of a default JavaScript `Array`, the sieve's runtime is both fast and tightly distributed.

## Animating Residue Classes

This is by far the most significant factor impacting performance because it's the only component that's constantly running.

Finding the residue classes mod $k$ isn't very difficult. We can simply iterate through the previously found $m$ primes and place them into $k$ buckets in $O(m)$ time. We could do some work in an attempt to cache or possibly predict these classes, but the linear traversal is so fast that even a perfect optimization that runs instantly might not be noticeable. Further, this step only runs once, so tiny differences won't add up.

### Naive approach

The easiest approach I could come up with was a delayed callback chain that deferred animation to CSS. In JavaScript, this consists of some main function with one or two helpers that call each other in the desired order with some delay using built-in features like `setTimeout`. The helpers would simply run something like `circle.classList.add("highlight")` and `.remove` to animate a particular circle in and out of the highlight styling. When I implemented this, the performance was noticeably poor and substantially increased the browser's CPU usage. Unfortunately, a chain of thousands of `setTimeout`s that cause repaints is not ideal.

The callback chain can be shortened by replacing chains of `setTimeout`s with a finite number of `setInterval`s. This still uses JavaScript as the coordinator of all animation, which is inefficient.

### Optimized approach

Because we want to play the same animation on repeat, there is no need to occupy the JavaScript engine with managing this. Instead, we can precompute the timings for each stage of animation for each point and load them as infinite CSS animations. With this structure, the browser can optimize the looping animation because give it all the information up front instead of hiding it in the JavaScript. We also leave the main thread unoccupied after page load, which is a plus. The CPU load of this optimization is less than half of the `setTimeout` approach.

On a M2 Macbook Air, 6x CPU throttling in addition to a normal background load had minimal performance impact. With 20x CPU throttling, the animation becomes choppier, but still retains the majority of its movement and effects.
