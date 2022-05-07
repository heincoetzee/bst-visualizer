import BST from "./bst.js";

const performAlgorithmButton = document.querySelector(".perform-algorithm button");
const algorithmValue = document.querySelector(".perform-algorithm input");
const clearBoardButton = document.querySelector(".clear");

const canvas = document.querySelector("#canvas");
canvas.width = window.innerWidth;
canvas.height = canvas.width / 2.5;

// maybe change the width and height as the window is being resized later
// using window's resize event

const ctx = canvas.getContext("2d");
ctx.font = "18px Lato";
ctx.textBaseline = "middle";
ctx.textAlign = "center";
ctx.fillStyle = "black";
ctx.strokeStyle = "black";

const bst = new BST(canvas, ctx);

const performAlgorithm = () => {
    // To insert a node
    let algorithmButtonValue = performAlgorithmButton.textContent;
    if (algorithmButtonValue === "Insert") {
        const numberRegExp = /^\d{1,3}$/;
        let value = algorithmValue.value.trim(" ");

        if (numberRegExp.exec(value) === null) {
            errorMessage.textContent = "Please enter a number (1 - 999)";
            algorithmValue.value = "";
            algorithmValue.focus();
        }
        else {
            errorMessage.textContent = "";
            bst.insert(value);
            algorithmValue.value = "";
            algorithmValue.focus();
            console.log(bst.values);
        }
    }
    else if (algorithmButtonValue === "Search") {
        console.log("Search for node");
    }
    else if (algorithmButtonValue === "Delete") {
        console.log("Delete node");
    }
};

performAlgorithmButton.addEventListener("click", () => {
    performAlgorithm();
});

algorithmValue.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        performAlgorithm();
    }
});