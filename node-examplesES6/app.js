// const rect = {
//   perimeter: (x, y) => 2 * (x + y),
//   area: (x, y) => x * y,
// };
//const rectangle = require("./rectangle");
//const rect = require("./rectangle");
import { rectangle } from "./rectangle";

function solveRect(l, w) {
  console.log(`Solving for rectangle with dimensions: ${l}, ${w}`);

  // if (l <= 0 || w <= 0) {
  //   console.log(
  //     `Rectangle dimensions must be greater than zero. Received: ${l}, ${w} `
  //   );
  rect(l, w, (err, rectangle) => {
    if (err) {
      console.log("ERROR:", err.message);
    } else {
      console.log(
        `Area of rectangle with dimensions ${l}, ${w} is: ${rectangle.area()}`
      );
      console.log(
        `Perimeter of rectangle with dimensions ${l}, ${w} is: ${rectangle.perimeter()}`
      );
    }
  });
  console.log("This statemet is logged after the call to react()");
}

solveRect(2, 4);
solveRect(3, 5);
solveRect(0, 5);
solveRect(5, -3);
