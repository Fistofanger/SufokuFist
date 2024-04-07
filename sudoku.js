function read(match) {
  const fs = require("fs");
  const { EOL } = require("os");
  const puzzlesTxt = fs.readFileSync("./puzzles.txt", "utf-8");

  //arrPuzzles - одномерный массивб каждый элемент это строка из puzzle.txt
  const arrPuzzles = puzzlesTxt.split(EOL);

  //arrSudoku - массив где каждый элемент это одно значение всего судоку (81 элемент)
  let arrSudoku;
  for (let i = 0; i <= arrPuzzles.length; i += 1) {
    arrSudoku = arrPuzzles[match - 1].split("");
    break;
  }

  //playngField - игровое поле, двумерный массив, где вложенные масивы это строки по 9 элементов
  let playingField = [];
  for (let i = 0; i < arrSudoku.length; i += 9) {
    playingField.push(arrSudoku.slice(i, i + 9));
  }
  return playingField;
}

function getNewEtalon(i, j, arr, haveOnlyOneElement) {
  let etalon = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  arr.forEach((el) => {
    if (el[j] !== "-") etalon.splice(etalon.indexOf(el[j]), 1);
  });
  arr[i].forEach(([el]) => {
    if (etalon.includes(String(el))) etalon.splice(etalon.indexOf(el), 1);
  });

  function spliceFromSmallArray(x, y, arr, etalon) {
    for (let k = x; k < x + 3; k++) {
      for (let n = y; n < y + 3; n++) {
        if (arr[k][n] !== "-" && etalon.includes(String(arr[k][n])))
          etalon.splice(etalon.indexOf(arr[k][n]), 1);
      }
    }
    return etalon;
  }

  if (i < 3) {
    if (j < 3) {
      etalon = spliceFromSmallArray(0, 0, arr, etalon);
    } else if (j < 6) {
      etalon = spliceFromSmallArray(0, 3, arr, etalon);
    } else {
      etalon = spliceFromSmallArray(0, 6, arr, etalon);
    }
  } else if (i < 6) {
    if (j < 3) {
      etalon = spliceFromSmallArray(3, 0, arr, etalon);
    } else if (j < 6) {
      etalon = spliceFromSmallArray(3, 3, arr, etalon);
    } else {
      etalon = spliceFromSmallArray(3, 6, arr, etalon);
    }
  } else {
    if (j < 3) {
      etalon = spliceFromSmallArray(6, 0, arr, etalon);
    } else if (j < 6) {
      etalon = spliceFromSmallArray(6, 3, arr, etalon);
    } else {
      etalon = spliceFromSmallArray(6, 6, arr, etalon);
    }
  }

  if (Array.isArray(etalon) && etalon.length === 1) {
    return [etalon[0], (haveOnlyOneElement += 1)];
  } else {
    return [etalon, haveOnlyOneElement];
  }
}

function solve(arr) {
  let haveOnlyOneElement = 0;
  const arrOfArr = [];
  arr.forEach((el, i) => {
    arrOfArr[i] = [];
    el.forEach((elRow, j) => {
      elRow === "-"
        ? ([arrOfArr[i][j], haveOnlyOneElement] = getNewEtalon(
            i,
            j,
            arr,
            haveOnlyOneElement
          ))
        : (arrOfArr[i][j] = elRow);
    });
  });
  return [arrOfArr, haveOnlyOneElement];
}

function isSolved(arr) {
  let result = 0;
  arr.forEach((el) => {
    el.forEach((elRow) => {
      if (Array.isArray(elRow)) result += 1;
    });
  });
  return result;
}
function getNewArrWithoutArr(arr) {
  let res = [];
  arr.forEach((el, i) => {
    res[i] = [];
    el.forEach((elRow, j) => {
      if (Array.isArray(elRow)) {
        res[i][j] = "-";
      } else {
        res[i][j] = elRow;
      }
    });
  });
  return res;
}

function setNewElemFromArrayOfTwo(arr) {
  let res = [];
  let count = 0;
  arr.forEach((el, i) => {
    res[i] = [];
    el.forEach((elRow, j) => {
      if (Array.isArray(elRow) && elRow.length === 2 && count === 0) {
        count += 1;
        res[i][j] = elRow[0];
      } else {
        res[i][j] = elRow;
      }
    });
  });
  return res;
}

function prettyBoard(num) {
  let arr = read(num);
  console.table(arr);
  let counter = 1;
  let [tempArr, haveOnlyOneElement] = solve(arr);
  let res;
  do {
    arr = getNewArrWithoutArr(tempArr);
    [tempArr, haveOnlyOneElement] = solve(arr);
    // console.table(tempArr);
    res = isSolved(tempArr);
    counter++;
    if (haveOnlyOneElement === 0) {
      tempArr = setNewElemFromArrayOfTwo(tempArr);
      //   console.table(tempArr);
      //   haveOnlyOneElement = 1;
    }
  } while (haveOnlyOneElement);
  // } while (res !== 0);
  console.log(`Решено за ${counter} итераций`);
  return console.table(tempArr);
}

prettyBoard(7);

module.exports = {
  prettyBoard,
};
