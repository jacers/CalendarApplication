// Selecting DOM elements (Elements in the CalendarPage.html)
const prevBtn = document.getElementById("prevButton");
const nextBtn = document.getElementById("nextButton");
const monthYearDisplay = document.getElementById("monthYearDisplay");
const daysContainer = document.querySelector(".days");

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

// Event listener for the buttons that change the months
prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// The current calendar look upon opening the page
renderCalendar();

