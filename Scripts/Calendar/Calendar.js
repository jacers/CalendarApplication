class Event {
    constructor(name, location, startDate, startTime, endDate, endTime, notes, emoji) {
        this.name      = name     ;
        this.location  = location ;
        this.startDate = startDate;
        this.startTime = startTime;
        this.endDate   = endDate  ;
        this.endTime   = endTime  ;
        this.notes     = notes    ;
        this.emoji     = emoji    ;
    }

    getStart() {
        return new Date(`${this.startDate}T${this.startTime}`)
    }

    getEnd() {
        return new Date(`${this.endDate}T${this.endTime}`)
    }
}

// Selecting DOM elements (Elements in the CalendarPage.html)
const prevBtn          = document.getElementById("prevButton"      );
const nextBtn          = document.getElementById("nextButton"      );
const monthYearDisplay = document.getElementById("monthYearDisplay");
const daysContainer    = document.querySelector (".days"           );

// Modal for color picker; will appear in front of and disable other elements
const openColorPickerBtn  = document.getElementById("openColorPickerBtn");
const colorPickerModal    = document.getElementById("colorPickerModal"  );
const closeColorPickerBtn = document.querySelector (".closeColorPicker" );

// Modal for new event; will appear in front of and disable other elements
const openNewEventBtn  = document.getElementById("openNewEvent"   );
const newEventModal    = document.getElementById("newEventModal"  );
const closeNewEventBtn = document.querySelector (".closeNewEvent" );
const saveEventBtn     = document.getElementById("saveEvent"      );

// Modal to view events; will appear in front of and disable other elements
const openEventsViewerBtn  = document.getElementById("openEventsViewer" );
const closeEventsViewerBtn = document.querySelector(".closeEventsViewer");
const eventsViewerModal    = document.getElementById("eventsViewerModal");

// Modal for emoji picker; will appear in front of and disable other elements
const emojiButton         = document.getElementById("emojiButton"     );
const emojiPickerModal    = document.getElementById("emojiPickerModal");
const closeEmojiPickerBtn = document.querySelector(".closeEmojiPicker");
const emojiPreview        = document.getElementById("emojiPreview"    );

// Event variables
let eventEmoji = ""; // Variable to store selected emoji
let events     = []; // Array to store all events

// TODO: Consistent formatting
// Color picker input elements
const sundayColorInput    = document.getElementById("sundayColor"     );
const mondayColorInput    = document.getElementById("mondayColor"     );
const tuesdayColorInput   = document.getElementById("tuesdayColor"    );
const wednesdayColorInput = document.getElementById("wednesdayColor"  );
const thursdayColorInput  = document.getElementById("thursdayColor"   );
const fridayColorInput    = document.getElementById("fridayColor"     );
const saturdayColorInput  = document.getElementById("saturdayColor"   );

// Initializing the "current" date to display to user
let currentDate = new Date();

// Function to get events for a specific day
function getEventsForDay(day) {
    return events.filter(event => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

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

        // Get events for the day and add their emojis
        const dayEvents = getEventsForDay(i);
        dayEvents.forEach(event => {
            const emojiPreview = document.createElement("preview");
            emojiPreview.textContent = event.emoji;
            dayElement.appendChild(emojiPreview);
        });

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

// TODO: Consistent formatting
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

// Event listener to open the color picker modal
openColorPickerBtn.addEventListener("click", () => {
    colorPickerModal.style.display = "block";
});

// Event listener to close the color picker modal
closeColorPickerBtn.addEventListener("click", () => {
    colorPickerModal.style.display = "none";
});

// Event listener to open the event modal
openNewEventBtn.addEventListener("click", () => {
    newEventModal.style.display = "block";
});

// Event listener to close the event modal
closeNewEventBtn.addEventListener("click", () => {
    newEventModal.style.display = "none";
});

// Event listener to open the event viewer modal
openEventsViewerBtn.addEventListener("click", () => {
    const eventsList = document.getElementById("eventList");
    eventsList.innerHTML = ""; // Clear the list

    events.forEach(event => {
        const listEvent = document.createElement("li");
        listEvent.innerHTML = `${event.emoji} "${event.name}" | From: ${event.startDate}, To: ${event.endDate}`;
        eventsList.appendChild(listEvent);
    });

    eventsViewerModal.style.display = "block";
});

// Event listener to close the event modal
closeEventsViewerBtn.addEventListener("click", () => {
    eventsViewerModal.style.display = "none";
});

// Event listener to open the emoji picker modal
emojiButton.addEventListener("click", () => {
    emojiPickerModal.style.display = "block";
});

// Event listener to close the emoji picker modal
closeEmojiPickerBtn.addEventListener("click", () => {
    emojiPickerModal.style.display = "none";
});

// Close any of the modals if the user clicks outside of it
window.addEventListener("click", (event) => {
    if (event.target == colorPickerModal || event.target == newEventModal) {
        colorPickerModal .style.display = "none";
        newEventModal    .style.display = "none";
        emojiPickerModal .style.display = "none";
        eventsViewerModal.style.display = "none";
    }
});

// Implementation of the emoji picker (event group)
document.querySelector('emoji-picker').addEventListener('emoji-click', event => {
    const emoji = event.detail.unicode;
    emojiPreview.innerText = `Selected Emoji: ${emoji}`;
    emojiButton.innerText = emoji;
    eventEmoji = emoji;
    emojiPickerModal.style.display = "none";
});

// Implementation of the save button
saveEventBtn.addEventListener("click", () => {
    const eventName      = document.getElementById("eventName"     ).value;
    const eventLocation  = document.getElementById("eventLocation" ).value;
    const eventStartDate = document.getElementById("eventStartDate").value;
    const eventStartTime = document.getElementById("eventStartTime").value;
    const eventEndDate   = document.getElementById("eventEndDate"  ).value;
    const eventEndTime   = document.getElementById("eventEndTime"  ).value;
    const eventNotes     = document.getElementById("eventNotes"    ).value;

    if (!eventName) {
        alert("Please name this event.");
        return;
    }

    if (!eventEmoji) {
        alert("Please group this event.");
        return;
    }

    // Event needs a start/end date and time
    if (!eventStartDate || !eventStartTime || !eventEndDate || !eventEndTime) {
        alert("Please select a date and time for the event to start and end.");
        return;
    }

    // When given a start/end date and time, the two are combined
    const startDateTime = new Date(`${eventStartDate}T${eventStartTime}`);
    const endDateTime   = new Date(`${eventEndDate  }T${eventEndTime  }`);

    // Checks if the event starts after it has ended
    if (startDateTime >= endDateTime) {
        alert("The event cannot start after it has ended.");
        return;
    }
    
    // Create an instance of the Event class
    const newEvent = new Event(eventName, eventLocation, eventStartDate, eventStartTime, eventEndDate, eventEndTime, eventNotes, eventEmoji);

    // Add the new event to the events array
    events.push(newEvent);
    // TODO: Create events view, currently logs them
    console.log("Event Name:    ", eventName    );
    console.log("Event Location:", eventLocation);
    console.log("Event Start:   ", startDateTime);
    console.log("Event End:     ", endDateTime  );
    console.log("Event Notes:   ", eventNotes   );
    console.log("Event Emoji:   ", eventEmoji   );

    // Clear the input fields
    document.getElementById("eventName"     ).value = "";
    document.getElementById("eventLocation" ).value = "";
    document.getElementById("eventStartDate").value = "";
    document.getElementById("eventStartTime").value = "";
    document.getElementById("eventEndDate"  ).value = "";
    document.getElementById("eventEndTime"  ).value = "";
    document.getElementById("eventNotes"    ).value = "";
    //emojiButton.innerText = "Select Emoji";
    //eventEmoji = new String; //Not working

    newEventModal.style.display = "none";
    renderCalendar();
});

// TODO: Consistent formatting
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
