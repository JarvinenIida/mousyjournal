// DATE AND TIME

const weekdayOutput = document.querySelector(".weekday");
const dateOutput = document.querySelector(".date");

const date = new Date();
const weekday = date.toLocaleString("en-US", {weekday: "long"});

const day = String(date.getDate()).padStart(2, '0');  // Ensure two digits for the day
const month = String(date.getMonth() + 1).padStart(2, '0');  // Ensure two digits for the month (months are 0-indexed)
const year = date.getFullYear();  // Get the full year (e.g., 2024)

// Format the date as dd.mm.yyyy
const formattedDate = `${day}.${month}.${year}`;

weekdayOutput.innerHTML = `<h2>${weekday}</h2>`;
dateOutput.innerHTML = `<h2>${formattedDate}</h2>`;



// TIMEBLOCK CALENDAR

const timeTable = document.querySelectorAll(".time-block");
const timeBlockList = Array.from(timeTable);
const textAreas = Array.from(document.querySelectorAll(".time-block-text"));
const classCarousel = ["rnd-none", "rnd-top", "rnd-bottom", "rnd", "border-bottom"];
const clearButton = document.querySelector(".clear-calendar");

// Save state to localStorage
function saveTimeBlockState() {
    const timeBlockData = timeBlockList.map((block, index) => ({
        class: [...block.classList].filter(cls => classCarousel.includes(cls))[0],
        text: textAreas[index]?.value || "", // Save text value of each input
    }));
    localStorage.setItem("timeBlockData", JSON.stringify(timeBlockData));
}

// Load state from localStorage
function loadTimeBlockState() {
    const storedData = JSON.parse(localStorage.getItem("timeBlockData"));
    if (storedData) {
        storedData.forEach((data, index) => {
            if (data.class) {
                timeBlockList[index].classList.remove(...classCarousel);
                timeBlockList[index].classList.add(data.class);
            }
            if (textAreas[index]) {
                textAreas[index].value = data.text || ""; // Restore the text value
            }
        });
    }
}

// Add double-click listener for cycling classes
timeBlockList.forEach((block, index) => {
    block.addEventListener("dblclick", () => {
        let classIndex = -1;

        // Find the current class index in the carousel
        for (let j = 0; j < classCarousel.length; j++) {
            if (block.classList.contains(classCarousel[j])) {
                classIndex = j;
                break;
            }
        }

        // Remove current class and add the next one
        if (classIndex !== -1) {
            block.classList.remove(classCarousel[classIndex]);
        }
        const nextClassIndex = (classIndex + 1) % classCarousel.length;
        block.classList.add(classCarousel[nextClassIndex]);

        // Save state after the change
        saveTimeBlockState();
    });
});

// Add input listener for saving text input changes
textAreas.forEach(input => {
    input.addEventListener("input", saveTimeBlockState);
});

// Add clear button functionality
clearButton.addEventListener("click", () => {
    timeBlockList.forEach(block => {
        block.classList.remove(...classCarousel);
        block.classList.add("border-bottom");
    });

    textAreas.forEach(input => {
        input.value = ""; // Clear the text values
    });

    // Save cleared state
    saveTimeBlockState();
});

// Load state on page load
document.addEventListener("DOMContentLoaded", loadTimeBlockState);



// SELF-CARE CHECKLIST

const dailyCheckList = Array.from(document.querySelectorAll(".checkbox"));

// Load checklist state from localStorage
function loadChecklistState() {
    const checklistState = JSON.parse(localStorage.getItem("checklistState")) || [];
    dailyCheckList.forEach((item, index) => {
        if (checklistState[index] === "checked") {
            item.classList.add("checked");
            item.classList.remove("unchecked");
        } else {
            item.classList.add("unchecked");
            item.classList.remove("checked");
        }
    });
}

// Save checklist state to localStorage
function saveChecklistState() {
    const checklistState = dailyCheckList.map((item) =>
        item.classList.contains("checked") ? "checked" : "unchecked"
    );
    localStorage.setItem("checklistState", JSON.stringify(checklistState));
}

// Attach event listeners to update state
dailyCheckList.forEach((item) => {
    item.addEventListener("click", () => {
        item.classList.toggle("checked");
        item.classList.toggle("unchecked");
        saveChecklistState();
    });
});

// Clear checklist
const clearChecklistButton = document.querySelector(".clear-checklist");

clearChecklistButton.addEventListener("click", () => {
    dailyCheckList.forEach((item) => {
        item.classList.remove("checked");
        item.classList.add("unchecked");
    });
    saveChecklistState(); // Update localStorage
});

// Load state on page load
loadChecklistState();



// FOOD LOG 

const breakfastContainer = document.querySelector(".breakfast");
const lunchContainer = document.querySelector(".lunch");
const dinnerContainer = document.querySelector(".dinner");
const newItemButtons = Array.from(document.querySelectorAll(".new-item"));
const clearFoodlogButton = document.querySelector(".clear-meals");

// Helper function to save the current state of food log to localStorage
function saveFoodLogState() {
    const foodLogState = {
        breakfast: Array.from(breakfastContainer.querySelectorAll(".food-item")).map((item) => ({
            weight: item.querySelector(".weight")?.value || "",
            food: item.querySelector(".food")?.value || "",
            calories: item.querySelector(".calories")?.value || "",
            protein: item.querySelector(".protein")?.value || "",
        })),
        lunch: Array.from(lunchContainer.querySelectorAll(".food-item")).map((item) => ({
            weight: item.querySelector(".weight")?.value || "",
            food: item.querySelector(".food")?.value || "",
            calories: item.querySelector(".calories")?.value || "",
            protein: item.querySelector(".protein")?.value || "",
        })),
        dinner: Array.from(dinnerContainer.querySelectorAll(".food-item")).map((item) => ({
            weight: item.querySelector(".weight")?.value || "",
            food: item.querySelector(".food")?.value || "",
            calories: item.querySelector(".calories")?.value || "",
            protein: item.querySelector(".protein")?.value || "",
        })),
    };
    localStorage.setItem("foodLogState", JSON.stringify(foodLogState));
}

// Helper function to render subheadings
function renderSubheadings() {
    const addHeading = (container, headingText) => {
        if (!container.querySelector("h4")) {
            const headingElement = document.createElement("h4");
            headingElement.textContent = headingText;
            container.insertBefore(headingElement, container.firstChild);
        }
    };
    addHeading(breakfastContainer, "breakfast");
    addHeading(lunchContainer, "lunch");
    addHeading(dinnerContainer, "dinner");
}

// Helper function to load the state of food log from localStorage
function loadFoodLogState() {
    const foodLogState = JSON.parse(localStorage.getItem("foodLogState")) || {
        breakfast: [],
        lunch: [],
        dinner: [],
    };

    // Function to render food items into a meal container
    function renderFoodItems(container, items) {
        container.querySelectorAll(".food-item").forEach((item) => item.remove()); // Clear existing items
        items.forEach((item) => {
            const foodItem = document.createElement("div");
            foodItem.classList.add("food-item");
            foodItem.innerHTML = `
                <input class="weight foodinput" type="text" placeholder="weight (g)" value="${item.weight}">
                <input class="food foodinput" type="text" placeholder="food item" value="${item.food}">
                <input class="calories foodinput" type="text" placeholder="calories (kcal)" value="${item.calories}">
                <input class="protein foodinput" type="text" placeholder="protein (g)" value="${item.protein}">
                <button class="delete hover transition">-</button>`;
            container.appendChild(foodItem);
        });
    }

    // Load saved data if it exists
    renderFoodItems(breakfastContainer, foodLogState.breakfast);
    renderFoodItems(lunchContainer, foodLogState.lunch);
    renderFoodItems(dinnerContainer, foodLogState.dinner);
    renderSubheadings(); // Ensure subheadings are added
}

// Add new food item to a meal
newItemButtons.forEach((button, index) => {
    const targetContainer = index === 0 ? breakfastContainer : index === 1 ? lunchContainer : dinnerContainer;

    button.addEventListener("click", () => {
        const newFoodItem = document.createElement("div");
        newFoodItem.classList.add("food-item");
        newFoodItem.innerHTML = `
            <input class="weight foodinput" type="text" placeholder="weight (g)">
            <input class="food foodinput" type="text" placeholder="food item">
            <input class="calories foodinput" type="text" placeholder="calories (kcal)">
            <input class="protein foodinput" type="text" placeholder="protein (g)">
            <button class="delete hover transition">-</button>`;
        targetContainer.appendChild(newFoodItem);
        saveFoodLogState(); // Save state whenever a new item is added
    });
});

// Delete food item
function handleDelete(event) {
    if (event.target.classList.contains("delete")) {
        event.target.parentElement.remove();
        saveFoodLogState(); // Save state after deletion
    }
}
breakfastContainer.addEventListener("click", handleDelete);
lunchContainer.addEventListener("click", handleDelete);
dinnerContainer.addEventListener("click", handleDelete);

// Clear all food inputs
clearFoodlogButton.addEventListener("click", () => {
    breakfastContainer.querySelectorAll(".food-item").forEach((item) => item.remove());
    lunchContainer.querySelectorAll(".food-item").forEach((item) => item.remove());
    dinnerContainer.querySelectorAll(".food-item").forEach((item) => item.remove());
    localStorage.removeItem("foodLogState"); // Clear state from storage
    renderSubheadings(); // Re-add subheadings
});

// Save state on input changes
document.addEventListener("input", (e) => {
    if (e.target.classList.contains("foodinput")) {
        saveFoodLogState();
    }
});

// Load state on page load
loadFoodLogState();





// WATER INTAKE 

const bottleArray = Array.from(document.querySelectorAll(".bottle"));
const initiallyFull = Array.from(document.querySelectorAll(".full-bottle"));
const initiallyEmpty = Array.from(document.querySelectorAll(".empty-bottle"));
const clearWaterButton = document.querySelector(".clear-water");

// Load water intake state from localStorage
function loadWaterState() {
    const savedWaterState = JSON.parse(localStorage.getItem("waterState")) || [];
    bottleArray.forEach((bottle, index) => {
        if (savedWaterState.includes(index)) {
            bottle.classList.add("active");
            initiallyEmpty[index].style.display = "block";
            initiallyFull[index].style.display = "none";
        } else {
            bottle.classList.remove("active");
            initiallyFull[index].style.display = "block";
            initiallyEmpty[index].style.display = "none";
        }
    });
}

// Save water intake state to localStorage
function saveWaterState() {
    const activeBottles = bottleArray
        .map((bottle, index) => (bottle.classList.contains("active") ? index : null))
        .filter((index) => index !== null);
    localStorage.setItem("waterState", JSON.stringify(activeBottles));
}

// Event listener for toggling bottles
bottleArray.forEach((bottle, index) => {
    bottle.addEventListener("click", () => {
        if (!bottle.classList.contains("active")) {
            bottle.classList.add("active");
            initiallyEmpty[index].style.display = "block";
            initiallyFull[index].style.display = "none";
        } else {
            bottle.classList.remove("active");
            initiallyFull[index].style.display = "block";
            initiallyEmpty[index].style.display = "none";
        }
        saveWaterState(); // Save the state after each interaction
    });
});

// Event listener for clearing water intake
clearWaterButton.addEventListener("click", () => {
    bottleArray.forEach((bottle, index) => {
        bottle.classList.remove("active");
        initiallyEmpty[index].style.display = "none";
        initiallyFull[index].style.display = "block";
    });
    saveWaterState(); // Update localStorage after clearing
});

// Initial load
loadWaterState();


// EXERCISE SYSTEM WITH LOCALSTORAGE

const exerciseContainer = document.querySelector(".exercise-container");
const newExerciseButtons = Array.from(document.querySelectorAll(".new-exercise-item"));
const clearExerciseButton = document.querySelector(".clear-exercises");

// Save exercises to localStorage
function saveExercises() {
    const exercises = [];
    const exerciseItems = Array.from(exerciseContainer.children);

    exerciseItems.forEach((item) => {
        const inputs = Array.from(item.querySelectorAll(".exercise-input"));
        const values = inputs.map((input) => input.value);
        exercises.push({ type: item.classList[0], values });
    });

    localStorage.setItem("exercises", JSON.stringify(exercises));
}

// Load exercises from localStorage
function loadExercises() {
    const savedData = localStorage.getItem("exercises");
    if (savedData) {
        const exercises = JSON.parse(savedData);
        exerciseContainer.innerHTML = ""; // Clear the container

        exercises.forEach((exercise) => {
            const newExercise = document.createElement("div");
            newExercise.classList.add(exercise.type);

            if (exercise.type === "weight-exercise") {
                newExercise.innerHTML = `
                    <input class="exercise-item exercise-input" type="text" placeholder="exercise" value="${exercise.values[0]}">
                    <input class="sets exercise-input" type="text" placeholder="sets" value="${exercise.values[1]}">
                    <input class="reps exercise-input" type="text" placeholder="reps" value="${exercise.values[2]}">
                    <input class="weight exercise-input" type="text" placeholder="weight" value="${exercise.values[3]}">
                    <button class="delete hover transition">-</button>`;
            } else if (exercise.type === "bw-exercise") {
                newExercise.innerHTML = `
                    <input class="exercise-item exercise-input" type="text" placeholder="exercise" value="${exercise.values[0]}">
                    <input class="sets exercise-input" type="text" placeholder="sets" value="${exercise.values[1]}">
                    <input class="reps exercise-input" type="text" placeholder="reps" value="${exercise.values[2]}">
                    <input class="duration exercise-input" type="text" placeholder="duration" value="${exercise.values[3]}">
                    <button class="delete hover transition">-</button>`;
            } else if (exercise.type === "cardio-exercise") {
                newExercise.innerHTML = `
                    <input class="exercise-item exercise-input" type="text" placeholder="exercise" value="${exercise.values[0]}">
                    <input class="duration exercise-input" type="text" placeholder="duration" value="${exercise.values[1]}">
                    <input class="distance exercise-input" type="text" placeholder="distance" value="${exercise.values[2]}">
                    <input class="burned-calories exercise-input" type="text" placeholder="calories" value="${exercise.values[3]}">
                    <button class="delete hover transition">-</button>`;
            }

            exerciseContainer.appendChild(newExercise);
        });
    }
}

// Add new exercise items
for (let i = 0; i < newExerciseButtons.length; i++) {
    let newExerciseButton = newExerciseButtons[i];

    newExerciseButton.addEventListener("click", () => {
        const newExercise = document.createElement("div");

        if (i === 0) {
            newExercise.classList.add("weight-exercise");
            newExercise.innerHTML = `
                <input class="exercise-item exercise-input" type="text" placeholder="exercise">
                <input class="sets exercise-input" type="text" placeholder="sets">
                <input class="reps exercise-input" type="text" placeholder="reps">
                <input class="weight exercise-input" type="text" placeholder="weight">
                <button class="delete hover transition">-</button>`;
        } else if (i === 1) {
            newExercise.classList.add("bw-exercise");
            newExercise.innerHTML = `
                <input class="exercise-item exercise-input" type="text" placeholder="exercise">
                <input class="sets exercise-input" type="text" placeholder="sets">
                <input class="reps exercise-input" type="text" placeholder="reps">
                <input class="duration exercise-input" type="text" placeholder="duration">
                <button class="delete hover transition">-</button>`;
        } else if (i === 2) {
            newExercise.classList.add("cardio-exercise");
            newExercise.innerHTML = `
                <input class="exercise-item exercise-input" type="text" placeholder="exercise">
                <input class="duration exercise-input" type="text" placeholder="duration">
                <input class="distance exercise-input" type="text" placeholder="distance">
                <input class="burned-calories exercise-input" type="text" placeholder="calories">
                <button class="delete hover transition">-</button>`;
        }

        exerciseContainer.appendChild(newExercise);
        saveExercises();
    });
}

// Delete individual exercise items
exerciseContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        e.target.parentElement.remove();
        saveExercises();
    }
});

// Clear all input values (retain structure)
clearExerciseButton.addEventListener("click", () => {
    const exerciseInputs = Array.from(document.querySelectorAll(".exercise-input"));
    exerciseInputs.forEach((input) => {
        input.value = ""; // Clear input values only
    });
    saveExercises(); // Save cleared state
});

// Save changes to input fields dynamically
exerciseContainer.addEventListener("input", () => {
    saveExercises();
});

// Load exercises on page load
loadExercises();





// SUMMARY/CALCULATOR

// Calculate calories 


const calorieInputs = document.querySelectorAll(".calories");
const calculateButton = document.querySelector(".calculate-summary");
const calorieOutput = document.querySelector(".cal-result");
const calorieText = document.querySelector(".calorie-text");




    calculateButton.addEventListener("click", () => {
    
        const inputArray = [];


        for (let i = 0; i < calorieInputs.length; i++) {
            inputArray.push(parseInt(calorieInputs[i].value) || 0);
        }

        let total = 0;

        for (let j = 0; j < inputArray.length; j++) {
            total += inputArray[j];
        }

        calorieOutput.innerText = `calorie intake: ${total} kcal`;
        calorieText.innerText = `${total} kcal`;
    });



// Calculate protein
const proteinInputs = document.querySelectorAll(".protein");
const proteinOutput = document.querySelector(".prot-result");
const proteinText = document.querySelector(".protein-text");



    calculateButton.addEventListener("click", () => {
    
        const inputArray = [];


        for (let i = 0; i < proteinInputs.length; i++) {
            inputArray.push(parseInt(proteinInputs[i].value) || 0);
        }

        let total = 0;

        for (let j = 0; j < inputArray.length; j++) {
            total += inputArray[j];
        }

        proteinOutput.innerText = `protein intake: ${total}g`;
        proteinText.innerText = `${total}g`;
    });


// Calculate water 

const waterBottles = Array.from(document.querySelectorAll(".bottle"));
const waterOutput = document.querySelector(".water-result");
const waterText = document.querySelector(".water-text");


calculateButton.addEventListener("click", () => {

    let result = 0;

    for (let i = 0; i < waterBottles.length; i++) {

        if (waterBottles[i].classList.contains("active")) {
            result += 5;
        }
    }

    result /= 10;
    waterOutput.innerText = `water intake: ${result}l`
    waterText.innerText = `${result}l`

})


// Calculate burnt calories

document.addEventListener("DOMContentLoaded", () => {
    const burnedInput = document.querySelector(".burned-calories");
    const burnedOutput = document.querySelector(".burned-result");
    const burnedText = document.querySelector(".burned-text");
    const calculateButton = document.querySelector(".calculate-summary");

    calculateButton.addEventListener("click", () => {
        let result = parseInt(burnedInput.value) || 0;
        result += 1450;
        burnedOutput.innerText = `TDEE: ${result} kcal`;
        burnedText.innerText = `${result} kcal`;
    });
});




// SUMMARY DISPLAY LOOP 

const icons = Array.from(document.querySelectorAll(".large-icon"));
const totalIcons = icons.length;

let currentIndex = 0;


function loopIcons() {
    icons[currentIndex].style.display = 'none';
    currentIndex = (currentIndex + 1) % totalIcons;
    icons[currentIndex].style.display = 'flex';
    setTimeout(loopIcons, 6000); 
  }

  loopIcons();

