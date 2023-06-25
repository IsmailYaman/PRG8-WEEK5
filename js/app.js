const k = 3;
const machine = new kNear(k);
let vector = [];

var button1 = document.getElementById("checkVector");
button1.addEventListener(
    "click",
    function (e) {
        updateVector();
        // predicting
        let prediction = machine.classify(vector);
        let resultElement = document.getElementById("result");
        resultElement.innerText = `${prediction}`;
    },
    false
);

var button2 = document.getElementById("saveVector");
button2.addEventListener(
    "click",
    function (e) {
        updateVector();
        let label = document.getElementById("vectorLabel").value;
        if (label) {
            machine.learn(vector, label);
            console.log("Learned current mood as ", label);
        }
    },
    false
);

function updateVector() {
    vector = document.getElementById("array").textContent.split(",");
    vector = vector.map((vecItem) => parseInt(vecItem));
    vector = vector.filter((vecItem) => !isNaN(vecItem));
}
