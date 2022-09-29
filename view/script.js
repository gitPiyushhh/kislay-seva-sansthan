'use-strict';
const plusBtn1 = document.getElementById('expandIcon1');
const text1 = document.getElementById('expandText1');
const plusMinus1 = document.getElementById('plusMinus1');
const plusBtn2 = document.getElementById('expandIcon2');
const text2 = document.getElementById('expandText2');
const plusMinus2 = document.getElementById('plusMinus2');

plusBtn1.addEventListener('click', function() {
    text1.classList.toggle('invisible');
    plusMinus1.classList.toggle('invisible');
});

plusBtn2.addEventListener('click', function() {
    text2.classList.toggle('invisible');
    plusMinus2.classList.toggle('invisible');
});
