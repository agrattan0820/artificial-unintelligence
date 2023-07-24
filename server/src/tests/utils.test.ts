import { describe, expect, test } from "@jest/globals";
import { getRandomInt, shuffleArray } from "../utils";

describe("randomInt", () => {
  test("expects random integer to be greater than or equal to 0 and less than 100", () => {
    const randomInt = getRandomInt(0, 100);
    expect(randomInt).toBeGreaterThanOrEqual(0);
    expect(randomInt).toBeLessThan(100);
  });
  test("expects random integer to be 50 if the min is 50 and the max is 51", () => {
    const randomInt = getRandomInt(50, 51);
    expect(randomInt).toBe(50);
  });
});

describe("shuffleArray", () => {
  test("expects the outputted array to have the same length as the original array", () => {
    const arrOfNums = Array.from({ length: 100 }, (_, i) => i + 1);
    const arrCopy = [...arrOfNums];
    const shuffledArray = shuffleArray(arrCopy);

    expect(shuffledArray.length).toBe(arrOfNums.length);
  });
  test("expects the outputted array's contents to not match the original array's", () => {
    const arrOfNums = Array.from({ length: 100 }, (_, i) => i + 1);
    const arrCopy = [...arrOfNums];
    const shuffledArray = shuffleArray(arrCopy);

    expect(shuffledArray).not.toEqual(arrOfNums);
  });
});
