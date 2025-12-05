const calculator = $("#calculator");
const calculatorResult = $("#result-calculator");
const operationResult = $("#operation-calculator");
var focusedInput = null;
var previousNumber = null;
var previousOperation = null;
var isWrittingSecondNumber = false;
var isSecondNumberOneDigit = false;
var secondOperationSelected = false;
var arrayHistory = [];

document.addEventListener('keydown', (e) => {
    $(window).resize(function () {
        var valorCalculadora = $("#calculator").hasClass("hide");
        if (!valorCalculadora) {
            CloseCalculator();
            calculator.removeClass("hide");
            calculator.css("z-index", GetMaxZIndex() + 1);
            focusedInput = $("input:focus");
            focusedInput.blur();

            if (calculator.offset().left == $(window).width() / 2) {
                calculator.css({ "top": "-=" + (calculator.height() / 2).toString(), "left": "-=" + (calculator.width() / 2).toString() });
            }

            var pixelsLeft = screen.width - calculator.width();
            var pixelsTop = screen.height - calculator.height() * 1.4;

            calculator.draggable({
                drag: function (event, ui) {
                    ui.position.left = Math.min(pixelsLeft, ui.position.left);
                    ui.position.left = Math.max(0, ui.position.left);
                    ui.position.top = Math.min(pixelsTop, ui.position.top);
                    ui.position.top = Math.max(0, ui.position.top);
                }
            });
        }
    });

    if (e.key && e.key.toLowerCase() === 'c' && e.altKey) {
        calculator.removeClass("hide");
        calculator.css("z-index", GetMaxZIndex() + 1);

        focusedInput = $("input:focus");
        focusedInput.blur();

        if (calculator.offset().left == $(window).width() / 2) {
            calculator.css({ "top": "-=" + (calculator.height() / 2).toString(), "left": "-=" + (calculator.width() / 2).toString() });
        }

        var pixelsLeft = screen.width - calculator.width();
        var pixelsTop = screen.height - calculator.height() * 1.4;

        calculator.draggable({
            drag: function (event, ui) {
                ui.position.left = Math.min(pixelsLeft, ui.position.left);
                ui.position.left = Math.max(0, ui.position.left);
                ui.position.top = Math.min(pixelsTop, ui.position.top);
                ui.position.top = Math.max(0, ui.position.top);
            }
        });
    }

    if (e.keyCode == 27) { // if the esc key is pressed
        CloseCalculator();
    }

    if (!calculator.hasClass("hide")) { // if the calculator is displayed
        if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) { // if the keycode pressed is a number
            WriteNumber(e.key)
        }

        if (e.keyCode == 111 || e.keyCode == 106 || e.keyCode == 109 || e.keyCode == 107 || e.keyCode == 55 || e.keyCode == 187 || e.keyCode == 189) { // if the keycode pressed is a math operation
            PressOperator(e.key)
            if (previousNumber != null && calculatorResult.val() !== "0" && calculatorResult.val() !== "0.") {
                operationResult.val(e.key);
            }
        }

        if (e.keyCode == 8) // if the delete key is pressed
            ClearCalculator();

        if (e.keyCode == 110) // if the dot is pressed
            AddDot();

        if (e.keyCode == 13) { // if the enter button is pressed
            calculatorResult.focus();
            
            if (previousNumber != null && calculatorResult.val() !== "0" && calculatorResult.val() !== "0.") {
                SetEqual();
            }
            else if (calculatorResult.val() !== "0" && calculatorResult.val() !== "0." && previousNumber == null) {
                focusedInput.val(calculatorResult.val());
                CloseCalculator();
            }
        }

    }
});

$("#close-calculator").click(CloseCalculator);

$("#calculator-clear").on("click", ClearCalculator);

$(".calculator-number").on("click", function () {
    WriteNumber($(this).text())
});

$("#calculator-dot").on("click", function () {
    if (!calculatorResult.val().includes(".")) {
        calculatorResult.val(calculatorResult.val() + $(this).text());
    }
});

$(".btn-operator").on("click", function () {
    var operator = $(this).text();
    if (previousNumber != null && calculatorResult.val() !== "0" && calculatorResult.val() !== "0.") {
        previousOperation = operator == "X" ? "*" : operator;
        operationResult.val(previousOperation);
    }
    PressOperator(operator);
});

$("#calculator-equal").on("click", function () {
    if (previousNumber != null && calculatorResult.val() !== "0" && calculatorResult.val() !== "0.") {
        SetEqual();
    }
});

$("#calculator-accept").click(function () {
    if (calculatorResult.val() !== "0" && calculatorResult.val() !== "0.") {
        focusedInput.val(calculatorResult.val());
        CloseCalculator();
    }
});

function SetEqual() {
    calculatorResult.val(CalculateNumber());
    operationResult.val("");
    previousNumber = null;
    previousOperation = null;
    isWrittingSecondNumber = false;
    isSecondNumberOneDigit = false;
    secondOperationSelected = false;
}

function WriteNumber(number) {
    if (calculatorResult.val() === "0" || (isWrittingSecondNumber && !isSecondNumberOneDigit)) {
        calculatorResult.val(number);

        if (isWrittingSecondNumber)
            isSecondNumberOneDigit = true
    }
    else {
        calculatorResult.val(calculatorResult.val() + number);
    }
    secondOperationSelected = false;
}

function PressOperator(operator) {
    if (secondOperationSelected) {
        previousOperation = operator == "X" ? "*" : operator;
        return
    }
    if (calculatorResult.val() !== "0" && calculatorResult.val() !== "0." && previousNumber == null) {
        previousNumber = calculatorResult.val();
    }
    else if (previousNumber != null && isWrittingSecondNumber) {
        secondOperationSelected = true;
        if (!secondOperationSelected) {
            previousNumber = CalculateNumber();
            calculatorResult.val(previousNumber);
        }
    }
    
    if (calculatorResult.val() === "0" && previousNumber == null)
        return

    previousOperation = operator == "X" ? "*" : operator;
    isWrittingSecondNumber = true;
    operationResult.val(previousOperation);
}

function AddDot() {
    if (!calculatorResult.val().includes(".")) {
        calculatorResult.val(calculatorResult.val() + ".");
    }
}

function CloseCalculator() {
    calculator.addClass("hide");
    calculator.css("z-index", 0);
    focusedInput = null;
    ClearCalculator();
    arrayHistory = [];
    ClearHistory()
}

function ClearCalculator() {
    calculatorResult.val("0");
    operationResult.val("");
    previousNumber = null;
    previousOperation = null;
    isWrittingSecondNumber = false;
    isSecondNumberOneDigit = false;
    secondOperationSelected = false;
}

function GetMaxZIndex() {
    return Math.max(
        ...Array.from(document.querySelectorAll('body *'), el =>
            parseFloat(window.getComputedStyle(el).zIndex),
        ).filter(zIndex => !Number.isNaN(zIndex)),
        0,
    );
}

function CalculateNumber() {
    const result = eval(previousNumber + previousOperation + calculatorResult.val());
    isSecondNumberOneDigit = false;
    arrayHistory.push(previousNumber + " " + previousOperation + " " + calculatorResult.val() + " = " + result);
    GenerateHistory();

    return result;
}

function GenerateHistory() {
    arrayHistory.forEach(function (elemento, indice, array) {
        if ($("#elementHistory_" + indice).length == 0) {
            $("#listHistorial").append('<li id="elementHistory_' + indice + '" class="list-group-item historyItem">' + elemento + '</li>');
        }
    });
}

function ClearHistory() {
    $("#listHistorial .historyItem").remove()
}