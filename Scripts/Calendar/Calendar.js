// Constructs a new event to be added to the calender
class Event {
    constructor(name, location, startDate, startTime, endDate, endTime, notes, label) {
        // TODO: Consistent formatting
        this.name      = name     ; // Name of the event
        this.location  = location ; // Location where the event takes place
        this.startDate = startDate; // Start date, formatted as a date with no time
        this.startTime = startTime; // Start time, formatted as a time with no date
        this.endDate   = endDate  ; // End date, formatted as a date with no time
        this.endTime   = endTime  ; // End time, formatted as a time with no date
        this.notes     = notes    ; // Any notes of the event
        // TODO: replace or combine with label.
        this.label     = label    ; // Label associated with the event
    }

    // Combines and returns the startDate and startTime parameters
    getStart() {
        return new Date(`${this.startDate}T${this.startTime}`)
    }

    // Combines and returns the endDate and endTime parameters
    getEnd() {
        return new Date(`${this.endDate}T${this.endTime}`)
    }
}

// Constructs a new label to be added to events
class Label {
    constructor(name, emoji, color) {
        // TODO: Consistent formatting
        this.name  = name ; // Name of the label
        this.emoji = emoji; // Emoji associated with the label
        this.color = color; // Color associated with the label
    }

    // Combines and returns the name and emoji parameters
    getEmojiAndName() {
        return `${this.emoji} ${this.name}`;
    }

    getEmojiAndColor() {
        return `<span style="background-color:${this.color}; border-radius: 5px; padding: 2px 4px;">${this.emoji}</span>`;
    }

    getLabel() {
        return `${this.getEmojiAndColor()} ${this.name}`;
    }
}

// Selecting DOM elements (Elements in the CalendarPage.html)
// TODO: Consistent formatting
const prevBtn          = document.getElementById("prevButton"      );
const nextBtn          = document.getElementById("nextButton"      );
const monthYearDisplay = document.getElementById("monthYearDisplay");
const daysContainer    = document.querySelector (".days"           );

// Modal for color picker; will appear in front of and disable other elements
const openModalBtn = document.getElementById("openModalBtn");
const modal = document.getElementById("colorPickerModal");
const closeModalBtn = document.querySelector (".close");

// TODO: Consistent formatting
const openColorPickerBtn  = document.getElementById("openColorPickerBtn");
const colorPickerModal    = document.getElementById("colorPickerModal"  );
const closeColorPickerBtn = document.querySelector (".closeColorPicker" );

// Modal for new event; will appear in front of and disable other elements
// TODO: Consistent formatting
const openNewEventBtn  = document.getElementById("openNewEvent"   );
const newEventModal    = document.getElementById("newEventModal"  );
const closeNewEventBtn = document.querySelector (".closeNewEvent" );
const saveEventBtn     = document.getElementById("saveEvent"      );

// Modal to view events; will appear in front of and disable other elements
// TODO: Consistent formatting
const openEventsViewerBtn  = document.getElementById("openEventsViewer" );
const closeEventsViewerBtn = document.querySelector(".closeEventsViewer");
const eventsViewerModal    = document.getElementById("eventsViewerModal");

// Modal for label maker; will appear in front of and disable other elements
// TODO: Integrate with labels
// TODO: Consistent formatting
const eventLabelDropdown = document.getElementById("eventLabelDropdown");
const labelMakerModal    = document.getElementById("labelMakerModal"   ); // TODO: Either replace this modal with the New Label maker or implement the label maker with the New Label maker
const closeLabelMakerBtn = document.querySelector(".closeLabelMaker"   );
const emojiPreview       = document.getElementById("emojiPreview"      );
const saveLabelBtn       = document.getElementById("saveLabel"         );

// Event variables
// TODO: Consistent formatting
let labelEmoji = ""; // Variable to store selected emoji
let events     = []; // Array to store all events
let labels     = []; // Array to store all labels

// Color picker input elements
const sundayColorInput = document.getElementById("sundayColor");
const mondayColorInput = document.getElementById("mondayColor");
const tuesdayColorInput = document.getElementById("tuesdayColor");
const wednesdayColorInput = document.getElementById("wednesdayColor");
const thursdayColorInput = document.getElementById("thursdayColor");
const fridayColorInput = document.getElementById("fridayColor");
const saturdayColorInput = document.getElementById("saturdayColor");

// Initializing the "current" date to display to user
let currentDate = new Date();

// Function that returns events for a specific day
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

        // Get events for the day and adds the emoji and colors from the labels
        const dayEvents = getEventsForDay(i);
        dayEvents.forEach(event => {
            const emojiPreview = document.createElement("preview");
            emojiPreview.innerHTML = event.label.getEmojiAndColor();
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
    document.querySelectorAll('.sunday').forEach(day => day.style.backgroundColor = sundayColorInput   .value);
    document.querySelectorAll('.monday').forEach(day => day.style.backgroundColor = mondayColorInput   .value);
    document.querySelectorAll('.tuesday').forEach(day => day.style.backgroundColor = tuesdayColorInput  .value);
    document.querySelectorAll('.wednesday').forEach(day => day.style.backgroundColor = wednesdayColorInput.value);
    document.querySelectorAll('.thursday').forEach(day => day.style.backgroundColor = thursdayColorInput .value);
    document.querySelectorAll('.friday').forEach(day => day.style.backgroundColor = fridayColorInput   .value);
    document.querySelectorAll('.saturday').forEach(day => day.style.backgroundColor = saturdayColorInput .value);
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

// Event listener to open the new event modal
openNewEventBtn.addEventListener("click", () => {
    newEventModal.style.display = "block";
});

// Event listener to close the new event modal
closeNewEventBtn.addEventListener("click", () => {
    newEventModal.style.display = "none";
});

// Event listener to open the event viewer modal
openEventsViewerBtn.addEventListener("click", () => {
    const eventsList = document.getElementById("eventList");
    eventsList.innerHTML = ""; // Clear the list

    // Cycles through each event on the events arrays and displays them on the list
    events.forEach(event => {
        const listEvent = document.createElement("li");
        listEvent.innerHTML = `${event.name} | ${event.label.getLabel()} | From: ${event.startDate}, To: ${event.endDate}`;
        eventsList.appendChild(listEvent);
    });

    eventsViewerModal.style.display = "block";
});

// Event listener to close the event modal
closeEventsViewerBtn.addEventListener("click", () => {
    eventsViewerModal.style.display = "none";
});

// Add listener to the dropdown menu
// TODO: Integrate with labels
eventLabelDropdown.addEventListener("change", function() {
    if (eventLabelDropdown.value === "newEvent") {
        openlabelMakerModal();              // Function to open the label maker modal
        eventLabelDropdown.value = "select"; // Reset the dropdown to the default option
    }
});

// Event listener to open the label maker modal
// TODO: Possibly group this with the rest of the functions, rather than the rest of the modal openers
function openlabelMakerModal() {
    labelMakerModal.style.display = "block";
}

// Event listener to close the label maker modal
closeLabelMakerBtn.addEventListener("click", () => {
    labelMakerModal.style.display = "none";
});

// Close any of the modals if the user clicks outside of it
window.addEventListener("click", (event) => {
    if (event.target == colorPickerModal || event.target == newEventModal) {
    // TODO: Consistent formatting
        colorPickerModal .style.display = "none";
        newEventModal    .style.display = "none";
        labelMakerModal  .style.display = "none";
        eventsViewerModal.style.display = "none";
    }
});


    // Warns the user if no label is inputted
    if (!labelIndex || labelIndex === "select" || labelIndex === "newEvent") {
        alert("Please label this event.");
        return;
    }

    // Warns the user if no start or end date and time are given
    if (!eventStartDate || !eventStartTime || !eventEndDate || !eventEndTime) {
        alert("Please select a date and time for the event to start and end.");
        return;
    }

    // Combines the dates and times of the start and end date
    const startDateTime = new Date(`${eventStartDate}T${eventStartTime}`);
    const endDateTime   = new Date(`${eventEndDate  }T${eventEndTime  }`);

    // Warns the user if the event starts after it has ended
    if (startDateTime >= endDateTime) {
        alert("The event cannot start after it has ended.");
        return;
    }
    
    const selectedLabel = labels[labelIndex];

    // Create an instance of the Event class
    const newEvent = new Event(eventName, eventLocation, eventStartDate, eventStartTime, eventEndDate, eventEndTime, eventNotes, selectedLabel);

    // Add the new event to the events array
    events.push(newEvent);

    // TODO: This is only to help debugging, may need to be deleted or commented out later.
    console.log("Event Name:           ", eventName                      );
    console.log("Event Location:       ", eventLocation                  );
    console.log("Event Start:          ", startDateTime                  );
    console.log("Event End:            ", endDateTime                    );
    console.log("Event Notes:          ", eventNotes                     );
    console.log("Label Name:           ", selectedLabel.name             );
    console.log("Label Emoji:          ", selectedLabel.emoji            );
    console.log("Label Color:          ", selectedLabel.color            );
    console.log("Label Name and Emoji: ", selectedLabel.getEmojiAndName());

    // Clear the input fields
    // TODO: Consistent formatting
    document.getElementById("eventName"     ).value = "";
    document.getElementById("eventLocation" ).value = "";
    document.getElementById("eventStartDate").value = "";
    document.getElementById("eventStartTime").value = "";
    document.getElementById("eventEndDate"  ).value = "";
    document.getElementById("eventEndTime"  ).value = "";
    document.getElementById("eventNotes"    ).value = "";

    newEventModal.style.display = "none";
    renderCalendar();
});

// Implementation of the label save button
saveLabelBtn.addEventListener("click", () => {
    const labelName = document.getElementById("labelName").value;
    const labelColor = document.getElementById("labelColor").value;

    // Warns the user if no name is inputted
    if (!labelName) {
        alert("Please provide a name for the label.");
        return;
    }

    // Warns the user if no emoji is inputted
    if (!labelEmoji) {
        alert("Please provide a emoji for the label.");
        return;
    }

    // Warns the user if no color is inputted
    // Note: Should not happen under normal circumstances
    if (!labelColor) {
        alert("Please provide a emoji for the label.");
        return;
    }

    const newLabel = new Label(labelName, labelEmoji, labelColor);
    labels.push(newLabel);

    // Optionally, you can add the new label to the dropdown for future events
    const option = document.createElement("option");
    option.value = labels.length - 1; // Use the index as the value
    option.text = newLabel.getEmojiAndName();
    option.style.backgroundColor = labelColor; // TODO: Supposed to change the background color of the option but it doesn't work
    eventLabelDropdown.add(option);

    // Reset the label maker modal
    document.getElementById("labelName").value = "";
    document.getElementById("labelColor").value = "#ffffff";
    emojiPreview.innerText = "";
    labelEmoji = "";

    // Close the label maker modal
    labelMakerModal.style.display = "none";
});

// Event listeners for color inputs to update day colors live
sundayColorInput.addEventListener("input", updateDayColors);
mondayColorInput.addEventListener("input", updateDayColors);
tuesdayColorInput.addEventListener("input", updateDayColors);
wednesdayColorInput.addEventListener("input", updateDayColors);
thursdayColorInput.addEventListener("input", updateDayColors);
fridayColorInput.addEventListener("input", updateDayColors);
saturdayColorInput.addEventListener("input", updateDayColors);

// The current calendar look upon opening the page
renderCalendar();
updateDayColors();
