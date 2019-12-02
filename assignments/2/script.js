// Ömercan Balandı
// 2018280065

// #Task

// Gündelik hayatta kullandığımız sayı sembollerine Hindu-Arap sayıları denmektedir. 
// Ancak sayıları göstermek için kullanılan başka sayı sembolleri de vardır. 
// Bunlardan biri de Romalıların kullandığı sembollerdir. 
// Roma rakamları belirli harf sembollerinin yan yana tekrarlanmasıyla ifade edilir. 
// Örneğin 10’luk sistemde 49 olarak ifade edilen sayı roma rakamları ile XLIX şeklinde yazılır. 
// Temel Roma Rakamları tablosunu ve roma rakamlarının yazımında kullanılan iki temel kural olan 
// Toplama Kuralı ve Çıkarma Kuralını da kullanarak;

// Onluk tabanda verilen bir sayıya karşılık gelen Roma rakamları ile yazılan eşdeğerinin bulunması, ve
// Roma rakamları halinde verilmiş bir sayının onluk karşılıklarının elde edilmesini sağlayacak, 
// C#, C++, Java veya JavaScript dillerinin biriyle kodlanmış bir program yazınız. 
// Bu programda hem onluk tabanda, hem de Roma rakamları ile verilecek 
// en büyük sayı limiti 3999 (MMMCMXCIX), en küçük sayı ise 1 (I) olacaktır.

// #Roma rakamları

// I=1, V=5, X=10, L=50, C=100, D=500, M=1000

// Roma rakamları yazım kuralları

// - Bir harf, en fazla üç defa yan yana yazılabilir.
// - Bir harfin sağına, kendisinden daha küçük değerli bir harf gelirse, toplanarak okunur.
// - Sol tarafa yazıldığında ise çıkarılır.

const numbersTable = {
    "I":    1,
    "IV":   4,
    "V":    5,
    "IX":   9,
    "X":    10,
    "XL":   40,
    "L":    50,
    "XC":   90,
    "C":    100,
    "CD":   400,
    "D":    500,
    "CM":   900,
    "M":    1000
}

/**
 * Logic
 * -------------------------------------------------
 */

const romanNumbers = Object.keys(numbersTable);
const romanValues = Object.values(numbersTable);
const unrepeatableRomanNumbers = ["V", "L", "D"];
const romanNumbersRepeatRuleLimit = 3;

const Validate = {
    areNumbersValid: input => {
        for (let i = 0; i < input.length; i++) { 
            let char = input[i];

            if (romanNumbers.indexOf(char) == -1) {
                return false;
            }
        }

        return true;
    },

    checkRepeatRuleLimit: input => {
        for (let i = 0; i < input.length; i++) { 
            let char = input[i];

            if (i + romanNumbersRepeatRuleLimit < input.length - 1) {
                let nextCharIndex = i + 1;
                let repetitionCounter = 0;
    
                for (let j = nextCharIndex; j < nextCharIndex + romanNumbersRepeatRuleLimit; j++) {
                    let nextChar = input[j];
    
                    if (char == nextChar) {
                        repetitionCounter += 1;
                    }
                }
    
                if (repetitionCounter > 2) {
                    return false;
                }
            }
        }

        return true;
    },

    checkUnrepeatables: input => {
        for (let i = 0; i < unrepeatableRomanNumbers.length; i++) {
            let unrepeatableChar = unrepeatableRomanNumbers[i];
            let repetitionCounter = 0;
    
            for (let j = 0; j < input.length; j++) {
                if (unrepeatableChar == input[j]) {
                    repetitionCounter += 1;
                }
            }
    
            if (repetitionCounter > 1) {
                return false;
            }
        }

        return true;
    },

    arePairsValid: input => {
        let currentIndex = 0;
        while (currentIndex < input.length) {
            let incrementAmount = 1;
            if (currentIndex + 1 < input.length) {
                if (numbersTable[input[currentIndex]] < numbersTable[input[currentIndex + 1]]) {
                    incrementAmount = 2;

                    let pair = input[currentIndex] + input[currentIndex + 1];
                    if (romanNumbers.indexOf(pair) == -1) {
                        return false;
                    }
                }
            }

            currentIndex += incrementAmount;
        }

        return true;
    },

    getValidationPipeline: () => {
        return [
            Validate.areNumbersValid,
            Validate.checkRepeatRuleLimit,
            Validate.checkUnrepeatables,
            Validate.arePairsValid
        ];
    },

    isInputValid: input => {
        let validationPipeline = Validate.getValidationPipeline();
        for (let i = 0; i < validationPipeline.length; i++) {
            if (!validationPipeline[i](input)) return false;
        }
    
        return true;
    }
}

const Convert = {
    toHinduArab: input => {
        let currentIndex = 0;
        let sum = 0;
        while (currentIndex < input.length) {
            let incrementAmount = 1;
            let value = numbersTable[input[currentIndex]];

            if (currentIndex + 1 < input.length) {
                if (numbersTable[input[currentIndex]] < numbersTable[input[currentIndex + 1]]) {
                    incrementAmount = 2;

                    let pair = input[currentIndex] + input[currentIndex + 1];
                    value = numbersTable[pair];
                }
            }

            sum += value;
            currentIndex += incrementAmount;
        }

        return sum;
    },

    toRoman: input => {
        let romanSum = "";
        for (let i = 0; i < input.length; i++) {
            let digit =  input[i];
            let digitAsInteger = parseInt(digit, 10);
            let digitPlace = Math.pow(10, (input.length - 1) - i);
            let valueAsInteger = digitAsInteger * digitPlace;

            if (romanValues.indexOf(valueAsInteger) > -1) {
                let valueIndex = romanValues.indexOf(valueAsInteger);
                let romanValue = romanNumbers[valueIndex];
                romanSum += romanValue;
            } else {
                let scaleValue = 0;

                if (digitAsInteger > 5) {
                    let fivePowerValueIndex = romanValues.indexOf(5 * digitPlace);
                    let fiveRomanValue = romanNumbers[fivePowerValueIndex];
                    romanSum += fiveRomanValue;

                    scaleValue = 5;
                }

                let valueIndex = romanValues.indexOf(digitPlace);
                let romanValue = romanNumbers[valueIndex];

                for (let j = 0; j < digitAsInteger - scaleValue; j++) {
                    romanSum += romanValue;
                }
            }
        }

        return romanSum;
    }
}

/**
 * UI
 * -------------------------------------------------
 */

const toggleBtns = document.querySelectorAll(".toggle-btn");
const contentBlocks = document.querySelectorAll(".content");

toggleBtns.forEach(btn => {
    btn.addEventListener("click", function() {
        contentBlocks.forEach(e => e.style.display = "none");
        toggleBtns.forEach(e => e.classList.remove("active"));
        let contentId = this.getAttribute("data-target");
        this.classList.add("active");
        document.querySelector(`#${contentId}`).style.display = "block";
    });
});

const toRomanInput = document.querySelector("#toRomanInput");
const toRomanButton = document.querySelector("#toRomanButton");
const toRomanResult = document.querySelector("#toRomanResult");

toRomanButton.addEventListener("click", () => {
    let value = toRomanInput.value;
    if (parseInt(value, 10) > 0 && parseInt(value, 10) < 4000) {
        toRomanResult.innerHTML = Convert.toRoman(value);
    } else {
        toRomanResult.innerHTML = "Lütfen Geçerli Bir Değer Girin."
    }
});

const toHinduArapInput = document.querySelector("#toHinduArapInput");
const toHinduArapButton = document.querySelector("#toHinduArapButton");
const toHinduArapResult = document.querySelector("#toHinduArapResult");

toHinduArapButton.addEventListener("click", () => {
    let value = toHinduArapInput.value.toUpperCase();
    if (Validate.isInputValid(value)) {
        let result = Convert.toHinduArab(value);
        if (parseInt(result, 10) > 0 && parseInt(result, 10) < 4000) {
            toHinduArapResult.innerHTML = result;
        } else {
            toHinduArapResult.innerHTML = "Lütfen Geçerli Bir Değer Girin."
        }

    } else {
        toHinduArapResult.innerHTML = "Lütfen Geçerli Bir Değer Girin."
    }
});