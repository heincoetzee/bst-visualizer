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
    const numberRegExp = /^\d{1,3}$/;
    let value = algorithmValue.value.trim(" ");

    if (numberRegExp.exec(value) === null) {
        errorMessage.textContent = "Please enter a number (1 - 999)";
        algorithmValue.value = "";
        algorithmValue.focus();
    }
    else {
        errorMessage.textContent = "";
        value = Number(value);
        let algorithmButtonValue = performAlgorithmButton.textContent;

        // Inserting a node
        if (algorithmButtonValue === "Insert") {
            ctx.strokeStyle = "black";
            bst.insert(value);
        }

        // Searching for a node
        else if (algorithmButtonValue === "Search") {
            ctx.textAlign = "left";
            ctx.font = "16px Lato";
            ctx.clearRect(10, 10, 300, 30);
            
            let object = bst.search(value);
            if ((bst.root !== null) && object === null) {
                ctx.fillText(`${value} was not found`, 20, 20);
            }
            else {
                ctx.fillText(`${bst.search(value).value} was found`, 20, 20);
            }
            ctx.stroke();

            ctx.font = "18px Lato";
            ctx.textAlign = "center";
        }

        // Deleting a node
        else if (algorithmButtonValue === "Delete") {
            console.log("Delete node");
            bst.delete(value);
        }

        algorithmValue.value = "";
        algorithmValue.focus();
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

clearBoardButton.addEventListener("click", () => {
    bst.deleteAll();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(bst.root);
});