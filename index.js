const fs = require('fs');
let input = fs.readFileSync('./input.txt').toString();
input = input.split(',').map(n => Number(n));

const ParamMode = Object.freeze({ position: '0', immediate: '1' });

const nextInstIndex = (instIndex, TESTdiagProg) => {
  let res = instIndex;
  const inst = TESTdiagProg[instIndex].toString().padStart(5, '0');
  const opCode = inst[3].toString() + inst[4].toString();

  if (opCode === '01' || opCode === '02' || opCode === '07' || opCode === '08') {
    res += 4;
  } else if (opCode === '03' || opCode === '04') {
    res += 2;
  } else if (opCode === '05' || opCode === '06') {
    res += 3;
  }

  return res;
};

const runOpCode = (instIndex, TESTdiagProg, arrayInputInst, logOutputsYN = true) => {
  const inst = TESTdiagProg[instIndex].toString().padStart(5, '0');
  const opCode = inst[3].toString() + inst[4].toString();
  const modeFirstParam = inst[2].toString();
  const modeSecondParam = inst[1].toString();
  //const modeThirdParam = inst[0].toString();

  let jumpToIndex = null;
  let output = null;

  if (opCode === '03') {
    const inputIndex = TESTdiagProg[instIndex + 1];

    TESTdiagProg[inputIndex] = arrayInputInst[0];
    arrayInputInst.length > 1 && arrayInputInst.shift();
  } else if (opCode === '99') {
    return { success: false, jumpToIndex: jumpToIndex, output: output };
  } else {
    const auxArg1 = TESTdiagProg[instIndex + 1];
    const arg1 = modeFirstParam === ParamMode.immediate ? auxArg1 : TESTdiagProg[auxArg1];
    const auxArg2 = TESTdiagProg[instIndex + 2];
    const arg2 = modeSecondParam === ParamMode.immediate ? auxArg2 : TESTdiagProg[auxArg2];
    const saveIndex = TESTdiagProg[instIndex + 3];

    switch (opCode) {
      case '01':
        TESTdiagProg[saveIndex] = arg1 + arg2;
        break;
      case '02':
        TESTdiagProg[saveIndex] = arg1 * arg2;
        break;
      case '04':
        logOutputsYN && console.log(arg1);
        output = arg1;
        break;
      case '05':
        jumpToIndex = arg1 !== 0 ? arg2 : null;
        break;
      case '06':
        jumpToIndex = arg1 === 0 ? arg2 : null;
        break;
      case '07':
        TESTdiagProg[saveIndex] = arg1 < arg2 ? 1 : 0;
        break;
      case '08':
        TESTdiagProg[saveIndex] = arg1 === arg2 ? 1 : 0;
        break;
      default:
        break;
    }
  }

  return { success: true, jumpToIndex: jumpToIndex, output: output };
};

const findDiagnosticCode = (inputInst, diagProg) => {
  let instIndex = 0;
  let TESTdiagProg = [...diagProg];

  while (true) {
    const executeOpCode = runOpCode(instIndex, TESTdiagProg, [inputInst]);
    const jumpToIndex = executeOpCode.jumpToIndex;

    if (!executeOpCode.success) {
      break;
    }

    if (jumpToIndex === null) {
      instIndex = nextInstIndex(instIndex, TESTdiagProg);
    } else {
      instIndex = jumpToIndex;
    }
  }
};

findDiagnosticCode(1, input);
findDiagnosticCode(5, input);



