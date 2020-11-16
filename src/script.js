var inputMatrix = [];
var bMatrix = [];
var aMatrix = [];
var aStrategiesArray = [];
var bStrategiesArray = [];
var estimate = [];
var resultMatrix = [];
var aStrategies = 3;
var bStrategies = 3;
var iteration = 3;

$(document).ready(function() {
    setListeners();
});

function setListeners() {
    $('#A-sett input').change(function() {
        aStrategies = $(this).val();
        changeMatrixLayout();
        clearArrays()
    })

    $('#B-sett input').change(function() {
        bStrategies = $(this).val();
        changeMatrixLayout();
        clearArrays()
    })

    $('#It-sett input').change(function() {
        iteration = eval($(this).val());
        clearArrays()
    })

    $('#matrix').on("change", "input", function() {
        inputMatrix[$(this).index()] = eval($(this).val());
        clearArrays();
    })

    $('#start-button').click(function() {
        calculate();
    })
}

function changeMatrixLayout() {
    $('#a-lables').empty();
    for (let i = 1; i <= aStrategies; i++) {
        $('#a-lables').append("<span>A" + i + "</span>");
    }

    $('#b-lables').empty();
    for (let i = 1; i <= bStrategies; i++) {
        $('#b-lables').append("<span>B" + i + "</span>");
    }

    inputMatrix = [];
    $('#matrix').empty();
    $('#matrix').css({
        "grid-template-columns": "repeat(" + bStrategies + ", 64px)",
        "grid-template-rows": "repeat(" + aStrategies + ", 64px)"
    });

    for (let i = 0; i < aStrategies*bStrategies; i++) {
        $('#matrix').append('<input type="number" max="20">');
    }
}

function activateButton() {
    $('#start-button')[0].disabled = false;
}

function calculate() {
    let aMaxIndex = 0;
    let aMax = inputMatrix[0];

    for (let i = 0; i < aStrategies; i++) {
        for (let j = 0; j < bStrategies; j++) {
            if (inputMatrix[i*bStrategies + j] > aMax) {
                aMaxIndex = i;
            }
        }
    }

    aStrategiesArray.push(eval(aMaxIndex));
    bMatrix.push(getRow(aStrategiesArray[0]));
    bStrategiesArray.push(eval(getMinIndex(getRow(aStrategiesArray[0]))));
    aMatrix.push(getColumn(getMinIndex(getRow(aStrategiesArray[0]))));
    let vMin = Math.min.apply(null, bMatrix[0]);
    let vMax = Math.max.apply(null, aMatrix[0]);
    estimate.push([vMin, vMax, (vMin + vMax)/2]);
    let row = [aStrategiesArray[0]].concat(bMatrix[0]).concat(bStrategiesArray[0]).concat(aMatrix[0]).concat(estimate[0]);
    resultMatrix.push(row);
    console.log(row);

    for (let i = 1; i < iteration; i++) {
        aStrategiesArray.push(getMaxIndex(aMatrix[i - 1]));
        bMatrix.push(arrayAddition(bMatrix[i - 1], getRow(getMaxIndex(aMatrix[i - 1]))));
        bStrategiesArray.push(getMinIndex(bMatrix[i]));
        aMatrix.push(arrayAddition(aMatrix[i - 1], getColumn(getMinIndex(bMatrix[i]))));
        vMin = Math.min.apply(null, bMatrix[i]);
        vMax = Math.max.apply(null, aMatrix[i]);
        estimate.push([vMin/(i + 1), vMax/(i + 1), (vMin/(i + 1) + vMax/(i + 1))/2]);
        row = [aStrategiesArray[i]].concat(bMatrix[i]).concat(bStrategiesArray[i]).concat(aMatrix[i]).concat(estimate[i]);
        resultMatrix.push(row);
        console.log(row);
    }

    createResultMatrix()
}

function getRow(rowNum) {
    let row = [];
    for (let i = 0; i < bStrategies; i++) {
        row.push(inputMatrix[rowNum * bStrategies + i]);
    }

    return row;
}

function getColumn(columnNum) {
    let column = [];
    for (let i = 0; i < bStrategies; i++) {
        column.push(inputMatrix[i * bStrategies + columnNum]);
    }

    return column;
}

function getMaxIndex(array) {
    let maxIndex = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] > array[maxIndex]) {
            maxIndex = i;
        }
    }

    return maxIndex;
}

function getMinIndex(array) {
    let minIndex = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] < array[minIndex]) {
            minIndex = i;
        }
    }

    return minIndex;
}

function arrayAddition(first, second) {
    let result = [];

    for (let i = 0; i < first.length; i++) {
        result[i] = first[i] + second[i];
    }

    return result;
}

function clearArrays() {
    bMatrix = [];
    aMatrix = [];
    aStrategiesArray = [];
    bStrategiesArray = [];
    estimate = [];
    resultMatrix = [];
}

function createResultMatrix() {
    let col = (eval(aStrategies) + eval(bStrategies) + 5);

    $('#result-matrix').css('display', 'block');
    $('#out-matrix').css({
        "grid-template-columns": "repeat(" + col + ", 64px)",
        "grid-template-rows": "repeat(" + iteration + ", 64px)"
    });
    $('#top-lables').empty();
    $('#num-lables').empty();
    $('#out-matrix').empty();

    $('#top-lables').append('<span>i</span>');
    for (let i = 0; i < bStrategies; i++){
        $('#top-lables').append("<span>B" + i + "</span>");
    }

    $('#top-lables').append('<span>j</span>');
    for (let i = 0; i < aStrategies; i++){
        $('#top-lables').append("<span>A" + i + "</span>");
    }

    $('#top-lables').append('<span>V(min)</span>');
    $('#top-lables').append('<span>V(max)</span>');
    $('#top-lables').append('<span>V(ср)</span>');

    for (let i = 0; i < iteration; i++){
        $('#num-lables').append("<span>" + i + "</span>");
    }

    let minV = resultMatrix[0][col - 2];
    let maxV = resultMatrix[0][col - 1];
    let everV = 0;
    
    for (let i = 0; i < iteration; i++) {
        for (let j = 0; j < col ; j++)
        if (j > col - 4) {
            $('#out-matrix').append('<span>' + resultMatrix[i][j].toFixed(3) + '</span>'); 
        } else {
            $('#out-matrix').append('<span>' + resultMatrix[i][j] + '</span>'); 
        } 

        if (resultMatrix[i][col - 2] < minV) {
            minV = resultMatrix[i][col - 2];
        }

        if (resultMatrix[i][col - 1] > maxV) {
            maxV = resultMatrix[i][col - 1];
        }
    }

    everV = (maxV + minV) / 2;

    $('#result').empty();
    $('#result').append('<span>V(min): ' + minV.toFixed(3) + '</span>');
    $('#result').append('<span>V(max): ' + maxV.toFixed(3) + '</span>');
    $('#result').append('<span>V(ср): ' + everV.toFixed(3) + '</span>');
}