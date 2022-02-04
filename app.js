// Value
let copyFirstButton = document.getElementById("copyTextIconFirst");
let copySecondButton = document.getElementById("copyTextIconSecond");
let changeButton = document.getElementById("changeButton");
let firstLanguageButton = document.getElementById("firstLanguageSelection");
let secondLanguageButton = document.getElementById("secondLanguageSelection");
let languageModal = document.getElementById("languagesModal");
let languageButtonList = document.getElementById("languageButtonList");
let translateArea = document.getElementById("translateArea");
let translateArea2 = document.getElementById("translateArea2");


// Event Listeners
copyFirstButton.addEventListener("click", copyText);
copySecondButton.addEventListener("click", copyText);
changeButton.addEventListener("click", changeSelections);
firstLanguageButton.addEventListener("click", firstToggleModal);
secondLanguageButton.addEventListener("click", secondToggleModal);
document.addEventListener("DOMContentLoaded", loadPage);
languageButtonList.addEventListener("click", pickLanguages);
translateArea.addEventListener("focusout", apiPostTranslate)


// Functions
function copyText(e) {
    let textArea = document.getElementById(e.target.getAttribute("data-textAreaId"));
    textArea.select();
    textArea.setSelectionRange(0, 99999); //For mobile devices //
    navigator.clipboard.writeText(textArea.value);
}

function changeSelections() {
    localStorage.setItem("firstLang", firstLanguageButton.textContent);
    localStorage.setItem("secondLang", secondLanguageButton.textContent);

    secondLanguageButton.textContent = localStorage.getItem("firstLang");
    firstLanguageButton.textContent = localStorage.getItem("secondLang");

    source_name = secondLanguageButton.name;
    target_name = firstLanguageButton.name;
    firstLanguageButton.name = source_name;
    secondLanguageButton.name = target_name;

    translateArea.value = translateArea2.value;
    translateArea2.value = "";
    apiPostTranslate();
}

function loadPage() {
    let langsFromApi = apiGetLanguages();
    // let langsFromApi = ["lorem", "lorem", "lorem", "lorem", "lorem", "lorem", "lorem", "lorem", "lorem", "lorem", "lorem", "lorem"];

    for (let i = 0; i < langsFromApi.length; i++) {
        languageButtonList.innerHTML += `
            <div class="languages col-3">
                <button name="` + langsFromApi[i].code + `" style="border: none; background-color: inherit;" class="languagesAllButtons btn-default">` + langsFromApi[i].name + `</button>
            </div>
        `
        // secondLanguageList.innerHTML += `
        //     <div class="languages col-3">
        //         <button id="secondId" name="` + langsFromApi[i].code+ `" style="border: none; background-color: inherit;" class="languagesAllButtons btn-default secondLangsContent">` + langsFromApi[i].name+  `</button>
        //     </div>
        // `
    }
    lastUsedLang();
}

function apiGetLanguages() {
    let response = [];
    const xhr = new XMLHttpRequest();
    // xhr.open("GET", "https://libretranslate.com/languages", false);
    xhr.open("GET", "http://localhost:5000/languages", false);
    xhr.onload = function () {
        if (this.status) {
            response = JSON.parse(this.responseText);
        }
    }
    xhr.send();
    return response;
}

// function fadeInAndOut(thz) {
//     var elmt = thz.nextElementSibling;//Get the element that is below the button that
//     //was just clicked
//
//     elmt.classList.toggle("acordianPanelHidden");//Toggle the class which changes
//     //attributes which triggers the `transition` CSS
// }


let clickedSelectButton = "";

function firstToggleModal() {
    languageModal.classList.toggle("languageListHidden");
    if (clickedSelectButton === "second") {
        setTimeout(function () {
            languageModal.classList.toggle("languageListHidden");
        }, 300)
    }
    if (languageModal.classList.contains("languageListHidden")) {
        clickedSelectButton = "";
    } else {
        clickedSelectButton = "first";
    }
}

function secondToggleModal() {
    languageModal.classList.toggle("languageListHidden");
    if (clickedSelectButton === "first") {
        setTimeout(function () {
            languageModal.classList.toggle("languageListHidden");
        }, 300)
    }
    if (languageModal.classList.contains("languageListHidden")) {
        clickedSelectButton = "";
    } else {
        clickedSelectButton = "second";
    }
}

function pickLanguages(e) {

    let pickedLanguageButton;

    if (e.target.tagName === "DIV") {
        pickedLanguageButton = e.target.children[0];
    } else {
        pickedLanguageButton = e.target;
    }

    if (clickedSelectButton === "first") {
        firstLanguageButton.textContent = pickedLanguageButton.textContent;
        firstLanguageButton.name = pickedLanguageButton.name;
        firstToggleModal();
    } else if (clickedSelectButton === "second") {
        secondLanguageButton.textContent = pickedLanguageButton.textContent;
        secondLanguageButton.name = pickedLanguageButton.name;
        secondToggleModal();
    }
    let firstSelectionText = firstLanguageButton.textContent;
    let secondSelectionText = secondLanguageButton.textContent;
    localStorage.setItem("firstLang", firstSelectionText);
    localStorage.setItem("secondLang", secondSelectionText);

    let readLastLangs = localStorage.getItem("lastLang");
    if (readLastLangs === null) {
        readLastLangs = [];
    } else {
        readLastLangs = JSON.parse(readLastLangs);
    }

    if (readLastLangs.includes(firstSelectionText)) {

    } else {
        readLastLangs.push(firstSelectionText);
    }

    if (readLastLangs.includes(secondSelectionText)) {

    } else {
        readLastLangs.push(secondSelectionText);
    }

    localStorage.setItem("lastLang", JSON.stringify(readLastLangs));
    lastUsedLang();
    apiPostTranslate();
}

function lastUsedLang() {
    let lastUsedLanguages = document.getElementById("lastUsedLanguages");
    let readLastLangs = localStorage.getItem("lastLang");
    if (readLastLangs === null) {
        readLastLangs = [];
    } else {
        readLastLangs = JSON.parse(readLastLangs);
    }

    lastUsedLanguages.innerHTML = "";

    for (let i = 0; i < readLastLangs.length; i++) {
        lastUsedLanguages.innerHTML += `
        <div>` + readLastLangs[i] + `</div>
    `
    }
}

function apiPostTranslate() {
    const url = "http://localhost:5000/translate";
    const data = {
        q: translateArea.value,
        source: firstLanguageButton.name,
        target: secondLanguageButton.name,
    }
    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    }).then(
        response => response.json() // .json(), etc.
        // same as function(response) {return response.text();}
    ).then(
        response => {
            console.log('response', response);
            if (response.error) {
                console.log(response.error);

            } else {
                translateArea2.value = response.translatedText;
            }
        }
    ).catch((e) => {
        console.log('Error occurred.');
    });
}
