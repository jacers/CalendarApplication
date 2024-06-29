// Selecting DOM elements (Elements in the CalendarPage.html)
const prevBtn = document.getElementById("prevButton");
const nextBtn = document.getElementById("nextButton");
const monthYearDisplay = document.getElementById("monthYearDisplay");
const daysContainer = document.querySelector(".days");

// Modal buttons
const openModalBtn        = document.getElementById("openModalBtn"    );
const modal               = document.getElementById("colorPickerModal");
const closeModalBtn       = document.querySelector (".close"          );

// Color input elements
const sundayColorInput    = document.getElementById("sundayColor"     );
const mondayColorInput    = document.getElementById("mondayColor"     );
const tuesdayColorInput   = document.getElementById("tuesdayColor"    );
const wednesdayColorInput = document.getElementById("wednesdayColor"  );
const thursdayColorInput  = document.getElementById("thursdayColor"   );
const fridayColorInput    = document.getElementById("fridayColor"     );
const saturdayColorInput  = document.getElementById("saturdayColor"   );

// Initializing the "current" date to display to user
let currentDate = new Date();

// Function to have the whole calendar displayed
function renderCalendar() {
    // Clearing the days currently being displayed
    daysContainer.innerHTML = "";

    // Getting the first day and last day of the current month that the user is on
    // FDOM, has a 1 to indicate that we want the first day
    // LDOM, has a 0 to indicate the last day of the previous month and the +1 on getMonth gets us the future month (so last day of current month)
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Calculating the number of days in the month and the starting date of the month
    const daysInMonth = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay();

    // Dynamically updates the display of the month and year for the user
    // Refers to the HTML element and converts currentDate in String to display
    monthYearDisplay.textContent = currentDate.toLocaleString("default", { month: "long" }) + " " + currentDate.getFullYear();

    
    // Loop to render the days of the previous month before the current month will start
    // Displays the previous month days so that the next month can start off where it ended (improves cohesiveness)
    const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    for (let i = startDay; i > 0; i--) 
    {
        // Div elements will be created for each day before the start of the current month
        const dayElement = document.createElement("div");

        // Adds the CSS class to each div element
        dayElement.classList.add("otherMonth");

        // Writes in the prevoius month days into the calendar
        dayElement.textContent = prevMonthDays - i + 1;

        // Appends each dayElement to the daysContainer
        daysContainer.appendChild(dayElement);
    }
    

    // Loop to render the days in the current month
    for (let i = 1; i <= daysInMonth; i++) 
    {
        // Div elements will be created for each day of the current month
        const dayElement = document.createElement("div");

        // Sets the day numbers to 1 (and overwrites the previous month days number)
        dayElement.textContent = i;

        // Sets the days of the week to their respective colors
        const dayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), i).getDay();
        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        dayElement.classList.add(daysOfWeek[dayOfWeek]);

        // Appending the numbered days to the current month to the calendar display
        daysContainer.appendChild(dayElement);
    }

    // Filling the remaining days with the next month's days to ensure 6 weeks are always displayed
    const totalDisplayedDays = startDay + daysInMonth;
    const nextMonthDays = 42 - totalDisplayedDays; // 42 = 7 days * 6 weeks
    
    // Loop to render in next month's days to fill out the remaning empty boxes
    // OPTIONAL CAN BE REMOVED
    for (let i = 1; i <= nextMonthDays; i++) 
    {
        const dayElement = document.createElement("div");
        dayElement.classList.add("otherMonth");
        dayElement.textContent = i;
        daysContainer.appendChild(dayElement);
    }
    
    
}

// Function to update day colors after selecting a new one
function updateDayColors() {
    document.querySelectorAll('.sunday'   ).forEach(day => day.style.backgroundColor = sundayColorInput   .value);
    document.querySelectorAll('.monday'   ).forEach(day => day.style.backgroundColor = mondayColorInput   .value);
    document.querySelectorAll('.tuesday'  ).forEach(day => day.style.backgroundColor = tuesdayColorInput  .value);
    document.querySelectorAll('.wednesday').forEach(day => day.style.backgroundColor = wednesdayColorInput.value);
    document.querySelectorAll('.thursday' ).forEach(day => day.style.backgroundColor = thursdayColorInput .value);
    document.querySelectorAll('.friday'   ).forEach(day => day.style.backgroundColor = fridayColorInput   .value);
    document.querySelectorAll('.saturday' ).forEach(day => day.style.backgroundColor = saturdayColorInput .value);
}

// Event listener to go backward a month
prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    updateDayColors();
});

// Event listener to go forward a month
nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    updateDayColors();
});

// Event listener to open the modal
openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

// Event listener to close the modal
closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close the modal if the user clicks outside of it
window.addEventListener("click", (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

// Event listeners for color inputs to update day colors live
sundayColorInput.addEventListener   ("input", updateDayColors);
mondayColorInput.addEventListener   ("input", updateDayColors);
tuesdayColorInput.addEventListener  ("input", updateDayColors);
wednesdayColorInput.addEventListener("input", updateDayColors);
thursdayColorInput.addEventListener ("input", updateDayColors);
fridayColorInput.addEventListener   ("input", updateDayColors);
saturdayColorInput.addEventListener ("input", updateDayColors);

// The current calendar look upon opening the page
renderCalendar();
updateDayColors();
