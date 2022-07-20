const { Timer } = require('timer-node');

const timer = new Timer({ label: 'test-timer' });

const testtime = timer.start();
console.log(testtime.time());

// const fn = (a) => {
//   let sum = 0;
//   for (let i = 0; i < 10000000; i += 1) {
//     sum += a * i;
//   }
//   return sum;
// };

// const benchmark = Timer.benchmark(fn.bind(fn, 5));
// console.log(benchmark.time()); // { d: 0, h: 0, m: 0, s: 0, ms: 53 }
// console.log(benchmark.format('%label: %ms ms'));
