function main() {
    n = 50_000
    n_iters = 10_000
    console.log(JSON.stringify({
        "fastTrivial": time(fastTrivial, n, n_iters),
        "pastSearch": time(pastSearch, n, n_iters),
        "sieveOfEratosthenes": time(sieveOfEratosthenes, n, n_iters)
    }))
}

function time(f, n, iters) {
    // Check correct
    const test = trivial(n)
    const pred = f(n)

    console.assert(test.length == pred.length, f, test.length, pred.length)
    for (let i = 0; i < test.length; i++) console.assert(test[i] == pred[i])

    // Benchmark timings
    result = []

    for (let i = 0; i < iters; i++) {
        startTime = new Date()
        f(n)
        result.push(new Date() - startTime)
    }

    return result
}

// Goal: return an Array of all primes <= n
// Assumptions: n > 2

function trivial(n) {
    let result = []

    for (let i = 2; i <= n; i++) {
        let found = false
        
        for (let j = 2; j < i; j++) {
            if (i % j == 0) {
                found = true
                break
            }
        }

        if (!found) result.push(i)
    }

    return result
}

function fastTrivial(n) {
    let result = []

    for (let i = 2; i <= n; i++) {
        let found = false

        for (let j = 2; j <= Math.sqrt(i); ++j) {
            if (i % j == 0) {
                found = true
                break
            }
        }

        if (!found) result.push(i)
    }

    return result
}

function pastSearch(n) {
    let result = [2]

    for (let i = 3; i <= n; ++i) {
        const upperBound = Math.sqrt(n)
        let found = false

        for (const prime of result) {
            if (i % prime == 0) {
                found = true
                break
            } else if (prime > upperBound) {
                break
            }
        }

        if (!found) result.push(i)
    }

    return result
}

function sieveOfEratosthenes(n) {
    let primes = new Array(n + 1).fill(true)

    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (primes[i]) {
            for (let j = i * i; j <= n; j += i) {
                primes[j] = false
            }
        }
    }

    let result = []
    for (let i = 2; i <= n; i++) {
        if (primes[i]) result.push(i)
    }

    return result
}

main()
