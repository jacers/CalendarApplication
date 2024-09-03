// Selecting DOM elements (Elements in the CalendarPage.html)
const prevBtn = document.getElementById("prevButton");
const nextBtn = document.getElementById("nextButton");
const monthYearDisplay = document.getElementById("monthYearDisplay");
const daysContainer = document.querySelector(".days");
const viewSelectionContent = document.getElementById("viewSelectionContent");

// Initializing the "current" date to display to user
let currentDate = new Date();

// Creating an instance of Views from the Views class
const views = new Views(currentDate, daysContainer, monthYearDisplay);

// Event listeners for buttons to change the date
prevBtn.addEventListener("click", () => {

    // Creating a variable that contains the value of the user selction
    const currentView = viewSelectionContent.value;

    if (currentView === "month") {
        currentDate.setMonth(currentDate.getMonth() - 1);
        views.renderCalendarMonth();
    } else if (currentView === "year") {
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        views.renderCalendarYear();
    } else if (currentView === "week") {
        currentDate.setDate(currentDate.getDate() - 7);
        views.renderCalendarWeek();
    } else if (currentView === "day") {
        currentDate.setDate(currentDate.getDate() - 1);
        views.renderCalendarDay();
    }
});

nextBtn.addEventListener("click", () => {

    // Creating a variable that contains the value of the user selction
    const currentView = viewSelectionContent.value;

    if (currentView === "month") {
        currentDate.setMonth(currentDate.getMonth() + 1);
        views.renderCalendarMonth();
    } else if (currentView === "year") {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        views.renderCalendarYear();
    } else if (currentView === "week") {
        currentDate.setDate(currentDate.getDate() + 7);
        views.renderCalendarWeek();
    } else if (currentView === "day") {
        currentDate.setDate(currentDate.getDate() + 1);
        views.renderCalendarDay();
    }
});


// The current calendar look upon opening the page (The initial render)
// Can be changed to something else (this is temporary to see if the views are "working")
views.renderCalendarMonth();

// Event listener for selection change in the view (Users will choose what view they would like to see)
viewSelectionContent.addEventListener("change", function() {
    const selectedValue = this.value;

    // Clear previous content if necessary (which probably will if view is changed)
    daysContainer.innerHTML = "";

    switch (selectedValue) 
    {
        case "month":
            daysContainer.classList.remove("dayViewContainer", "yearViewContainer", "weekViewContainer");
            views.renderCalendarMonth();
            break;
        case "day":
            daysContainer.classList.remove("yearViewContainer", "weekViewContainer", "monthViewContainer");
            views.renderCalendarDay();
            break;
        case "year":
            daysContainer.classList.remove("weekViewContainer", "monthViewContainer", "dayViewContainer");
            views.renderCalendarYear();
            break;
        case "week":
            daysContainer.classList.remove("dayViewContainer", "yearViewContainer", "monthViewContainer");
            views.renderCalendarWeek();
            break;
    }
});

// Trigger the change event on page load to set the default view
viewSelectionContent.dispatchEvent(new Event("change"));