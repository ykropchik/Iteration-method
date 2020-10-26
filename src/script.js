var matrix = [];
var iteration = 0;

$(document).ready(function() {
    setListeners();
});

function setListeners() {
    $('#A-sett input').change(function() {
        changeMatrixLayout($(this).val(), $('#B-sett input').val());
    })

    $('#B-sett input').change(function() {
        changeMatrixLayout($('#A-sett input').val(), $(this).val());
    })

    $('#It-sett input').change(function() {
        iteration = $(this).val();
    })

    $('#matrix').on("change", "input", function() {
        matrix[$(this).index()] = $(this).val();
    })
}

function changeMatrixLayout(aCount, bCount) {
    if (aCount) {
        $('#a-lables').empty();
        for (var i = 1; i <= aCount; i++) {
            $('#a-lables').append("<span>A" + i + "</span>");
        }
    }

    if (bCount) {

        $('#b-lables').empty();
        for (var i = 1; i <= bCount; i++) {
            $('#b-lables').append("<span>B" + i + "</span>");
        }
    }

    matrix = [];
    $('#matrix').empty();
    $('#matrix').css({
        "grid-template-columns": "repeat(" + bCount + ", 64px)",
        "grid-template-rows": "repeat(" + aCount + ", 64px)"
    });

    for (var i = 0; i < aCount*bCount; i++) {
        $('#matrix').append('<input type="number" max="20">');
    }
}

function calculate() {

}