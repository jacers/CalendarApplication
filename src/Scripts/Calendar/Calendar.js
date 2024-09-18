// Selecting DOM elements (Elements in the CalendarPage.html)
const prevBtn = document.getElementById("prevButton");
const nextBtn = document.getElementById("nextButton");
const monthYearDisplay = document.getElementById("monthYearDisplay");
const daysContainer = document.querySelector (".days");

// Modal for color picker; will appear in front of and disable other elements
const openModalBtn = document.getElementById("openModalBtn");
const modal = document.getElementById("colorPickerModal");
const closeModalBtn = document.querySelector (".close");

// Color picker's user interaction elements
const openColorPickerBtn = document.getElementById("openColorPickerBtn");
const colorPickerModal = document.getElementById("colorPickerModal"  );
const closeColorPickerBtn = document.querySelector(".closeColorPicker" );

// Modal for new event; will appear in front of and disable other elements
const openNewEventBtn = document.getElementById("openNewEvent");
const newEventModal = document.getElementById("newEventModal");
const closeNewEventBtn = document.querySelector (".closeNewEvent");
const eventCatDropdown = document.querySelector("#eventCatDropdown");
const labelInput = document.querySelector("#labInputs");
const saveEventBtn = document.getElementById("saveEvent");

// Modal to view events; will appear in front of and disable other elements
const searchBtn = document.getElementById("openEventsViewer");
const closeEventsViewerBtn = document.querySelector(".closeEventsViewer");
const eventsViewerModal = document.getElementById("eventsViewerModal");

// Modal to view events within a day; will appear in front of and disable other elements
const dayEventsViewerModal = document.getElementById("dayEventsViewerModal");
const closeDayEventsModal = document.querySelector(".closeDayEventsModal");
const selectedDayElement = document.getElementById("selectedDay");
const dayEventList = document.getElementById("dayEventList");

// Modal for label maker; will appear in front of and disable other elements
const eventLabelDropdown = document.getElementById("eventLabelDropdown");
const labelMakerModal = document.getElementById("labelMakerModal");
const closeLabelMakerBtn = document.querySelector (".closeLabelMaker");
const emojiPreview = document.getElementById("emojiPreview");
const emojiPreviewEdit = document.getElementById("emojiPreviewEdit");
const saveLabelBtn = document.getElementById("saveLabel");

// Emoji Picker for the maker modal
const emojiPicker = document. querySelector ("emoji-picker");
// Need to make another one of these that works for label edit
emojiPicker.addEventListener("emoji-click", (event) => {
    labelEmoji = event.detail.unicode;
    emojiPreview.innerText = labelEmoji;
});

// Emoji picker for the editor modal
const emojiEditPicker = document.querySelector("#emojiEditPicker");
emojiEditPicker.addEventListener("emoji-click", (event) => {
    labelEmoji = event.detail.unicode; 
    emojiPreviewEdit.innerText = labelEmoji;
})

// Modal for category maker
const catMakerModal = document.querySelector('.catMakerModal');
const closeNewCat = document.querySelector('.closeNewCat');
const saveCat = document.querySelector('.saveCat');
const categoryName = document.querySelector('#categoryName');
const catEditorModal = document.querySelector('.catEditorModal'); 
const labEditorModal = document.querySelector('.labelEditorModal'); 

// Event variables
let labelEmoji = ""; // Variable to store selected emoji
let events = []; // Array to store all events
let labels = []; // Array to store all labels
let categories = []; // Array to store all categories

// Color picker input elements
const sundayFillColorInput = document.getElementById("sundayFillColor");
const mondayFillColorInput = document.getElementById("mondayFillColor");
const tuesdayFillColorInput = document.getElementById("tuesdayFillColor");
const wednesdayFillColorInput = document.getElementById("wednesdayFillColor");
const thursdayFillColorInput = document.getElementById("thursdayFillColor");
const fridayFillColorInput = document.getElementById("fridayFillColor");
const saturdayFillColorInput = document.getElementById("saturdayFillColor");

// Initializing the "current" date to display to user
let currentDate = new Date();

// Helper function to normalize date (removes time)
function normalizeDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Function that returns events for a specific day
function getEventsForDay(day, month = currentDate.getMonth(), year = currentDate.getFullYear()) {
    return events.filter(event => {
        const eventStart = normalizeDate(new Date(event.startDate)); // Strip time from start date
        const eventEnd = normalizeDate(new Date(event.endDate)); // Strip time from end date
        //eventEnd.setDate(eventEnd.getDate() + 1); // Makes sure the full range is included on the calendar view
        const currentDay = new Date(year, month, day); // The current day being rendered

        return currentDay >= eventStart && currentDay <= eventEnd;
    });
}

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
    for (let i = startDay; i > 0; i--) {
        // Div elements will be created for each day before the start of the current month
        const dayElement = document.createElement("div");

        // Adds the CSS class to each div element
        dayElement.classList.add("otherMonth");

        // Writes in the prevoius month days into the calendar
        const dayNum = document.createElement("div"); // Adding dayNum element
        dayNum.classList.add('dayNum');
        dayNum.innerHTML = `${prevMonthDays - i + 1}`;
        dayElement.appendChild(dayNum); // Append dayNum

        // Get events for the day from the previous month
        const prevMonthEvents = getEventsForDay(prevMonthDays - i, currentDate.getMonth() - 1, currentDate.getFullYear());

        // Going through each event and adding it graphically to the calendar
        prevMonthEvents.forEach(event => {
            if (event.label.isChecked === false) {
                return;  // Skip unchecked labels
            }
            const eventBlock = document.createElement("div");
            eventBlock.classList.add("eventBlock");

            const eventText = document.createElement("span");
            eventText.classList.add("dayNum");
            eventText.innerHTML = `${event.label.emoji} ${event.name}`;
            eventBlock.appendChild(eventText);

            // Set event styles (background color, text color)
            eventBlock.style.background = event.label.color;
            eventBlock.style.color = adjustTextColor(event.label.color);

            dayElement.appendChild(eventBlock);
        });

        // Appends each dayElement to the daysContainer
        daysContainer.appendChild(dayElement);
    }
    
    // Getting todays date
    const today = new Date();

    // Loop to render the days in the current month
    for (let i = 1; i <= daysInMonth; i++) {
        // Div elements will be created for each day of the current month

        // Creating separete number for styling purposes
        const dayNum = document.createElement("div");
        dayNum.classList.add('dayNum')

        // Main day div
        const dayElement = document.createElement("div");

        // Sets the day numbers to 1 (and overwrites the previous month days number)
        dayNum.innerHTML = `${i}`;
        dayElement.appendChild(dayNum);

        // Get events for the day and adds the emoji and colors from the labels
        const dayEvents = getEventsForDay(i - 1);

        dayEvents.sort((a, b) => {
            const startA = new Date(a.startDate + 'T' + a.startTime);  // Combine startDate and startTime
            const startB = new Date(b.startDate + 'T' + b.startTime);  // Combine startDate and startTime
            return startA - startB;  // Sort by earliest to latest
        });

        dayEvents.forEach(event => {
            // Not showing events with unchecked labels
            if((event.label.isChecked == false)) {
                return;
            }

            // Div that contains all event blocks
            const eventBlock = document.createElement("div");
            eventBlock.classList.add("eventBlock");

            // Seperate text for if we decide to have some way to shorten it
            const eventText = document.createElement("span");
            eventText.innerHTML = `${event.label.emoji} ${event.name}`;
            eventBlock.appendChild(eventText);

            // Setting event background to it's label's color and adjusting it's text so it is readable
            eventBlock.style.background = event.label.color;
            eventBlock.style.color = adjustTextColor(event.label.color);

            dayElement.appendChild(eventBlock);
        });

        // Sets the days of the week to their respective colors
        const dayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), i).getDay();
        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        dayElement.classList.add(daysOfWeek[dayOfWeek]);

        // Adds small border around the day if it is the current day
        if (today.getDate() === i &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear()) {
            // Change the background color for today's date
            dayElement.style.border = "2px solid #376753";  
        }

        // Adds an event listener to each date to open an event viewer for that date
        dayElement.addEventListener("click", () => openDayEventsModal(i - 1));

        // Appending the numbered days to the current month to the calendar display
        daysContainer.appendChild(dayElement);
    }

    // Filling the remaining days with the next month's days to ensure 6 weeks are always displayed
    const totalDisplayedDays = startDay + daysInMonth;
    const nextMonthDays = 42 - totalDisplayedDays; // 42 = 7 days * 6 weeks
    
    // Loop to render in next month's days to fill out the remaning empty boxes
    for (let i = 1; i <= nextMonthDays; i++) {
        const dayElement = document.createElement("div");
        dayElement.classList.add("otherMonth");

        // Creating separate dayNum for styling purposes
        const dayNum = document.createElement("div"); 
        dayNum.classList.add('dayNum');
        dayNum.innerHTML = `${i}`;
        dayElement.appendChild(dayNum);

        // Get events for the day from the next month
        const nextMonthEvents = getEventsForDay(i, currentDate.getMonth() + 1, currentDate.getFullYear());
        
        // Going through each event and adding it graphically to calendar
        nextMonthEvents.forEach(event => {
            if((event.label.isChecked == false)) {
                return;
            }
            
            const eventBlock = document.createElement("div");
            eventBlock.classList.add("eventBlock");

            const eventText = document.createElement("span");
            eventText.classList.add("dayNum");
            eventText.innerHTML = `${event.label.emoji} ${event.name}`;
            eventBlock.appendChild(eventText);

            // Set event styles (background color, text color)
            eventBlock.style.background = event.label.color;
            eventBlock.style.color = adjustTextColor(event.label.color);

            dayElement.appendChild(eventBlock);
        });
        
        daysContainer.appendChild(dayElement);
    }   
}

// Function to update day colors after selecting a new one
function updateDayColors() {
    document.querySelectorAll('.sunday').forEach(day => day.style.backgroundColor = sundayFillColorInput.value);
    document.querySelectorAll('.monday').forEach(day => day.style.backgroundColor = mondayFillColorInput.value);
    document.querySelectorAll('.tuesday').forEach(day => day.style.backgroundColor = tuesdayFillColorInput.value);
    document.querySelectorAll('.wednesday').forEach(day => day.style.backgroundColor = wednesdayFillColorInput.value);
    document.querySelectorAll('.thursday').forEach(day => day.style.backgroundColor = thursdayFillColorInput.value);
    document.querySelectorAll('.friday').forEach(day => day.style.backgroundColor = fridayFillColorInput.value);
    document.querySelectorAll('.saturday').forEach(day => day.style.backgroundColor = saturdayFillColorInput.value);
}

// Getting more holidays based on the year we're in
let previousYear = currentDate.getFullYear();

function updateYear(newYear)
{
    if(newYear !== previousYear)
    {
        previousYear = newYear;
        fetchHolidays(newYear);
    }
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

    updateYear(currentDate.getFullYear());

    renderCalendar();
    updateDayColors();
});

// Event listener to open the color picker modal
openColorPickerBtn.addEventListener("click", () => {
    colorPickerModal.style.display = "block";
});

// Event listener to close the color picker modal
closeColorPickerBtn.addEventListener("click", () => {
    colorPickerModal.style.display = "none";
});

// Event listener to close the event viewer modal
closeEventsViewerBtn.addEventListener("click", () => {
    eventsViewerModal.style.display = "none";
});

// Event listener to open the day event viewer modal
closeDayEventsModal.addEventListener("click", () => {
    dayEventsViewerModal.style.display = "none";
});

// Close any of the modals if the user clicks outside of it
window.addEventListener("click", (event) => {
    if (event.target == colorPickerModal  || 
        event.target == newEventModal     ||
        event.target == labelMakerModal   ||
        event.target == eventsViewerModal ||
        event.target == catMakerModal     ||
        event.target == catEditorModal    ||
        event.target == labEditorModal    ||
        event.target == dayEventsViewerModal) {
        colorPickerModal.style.display = "none";
        newEventModal.style.display = "none";
        labelMakerModal.style.display = "none";
        eventsViewerModal.style.display = "none";
        catMakerModal.style.display = "none";
        catEditorModal.style.display = "none";
        labEditorModal.style.display = "none";
        dayEventsViewerModal.style.display = "none";
    }
});

// Event listeners for color inputs to update day colors live
sundayFillColorInput   .addEventListener("input", updateDayColors);
mondayFillColorInput   .addEventListener("input", updateDayColors);
tuesdayFillColorInput  .addEventListener("input", updateDayColors);
wednesdayFillColorInput.addEventListener("input", updateDayColors);
thursdayFillColorInput .addEventListener("input", updateDayColors);
fridayFillColorInput   .addEventListener("input", updateDayColors);
saturdayFillColorInput .addEventListener("input", updateDayColors);

// The current calendar look upon opening the page
renderCalendar();
updateDayColors();