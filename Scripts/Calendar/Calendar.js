// Constructs a new event to be added to the calendar
class Event {
    constructor(name, location, startDate, startTime, endDate, endTime, notes, label) {
        this.name = name; // Name of the event
        this.location = location; // Location where the event takes place
        this.startDate = startDate; // Start date, formatted as a date with no time
        this.startTime = startTime; // Start time, formatted as a time with no date
        this.endDate = endDate; // End date, formatted as a date with no time
        this.endTime = endTime; // End time, formatted as a time with no date
        this.notes = notes; // Any notes of the event
        this.label = label; // Label associated with the event
    }

    // Combines and returns the startDate and startTime parameters
    getStart() {
        return new Date(`${this.startDate}T${this.startTime}`)
    }

    // Combines and returns the endDate and endTime parameters
    getEnd() {
        return new Date(`${this.endDate}T${this.endTime}`)
    }

    // Formats a date as Month Day, Year
    formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateObj = new Date(date);
        // Adjust for timezone offset; without this, the date will be one day off
        dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
        return dateObj.toLocaleDateString('en-US', options);
    }

    // Formats a time as H:MM AM/PM
    formatTime(time) {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        return date.toLocaleTimeString('en-US', options);
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

    // Adds the label to the options under the event label dropdown selector
    addLabelOption() {
        const eventLabelDropdown = document.querySelector('#eventLabelDropdown');
        const newLabelOption = eventLabelDropdown.querySelector('option[value="newEvent"]');
        const newOption = document.createElement('option');

        newOption.value = labels.length - 1;
        newOption.innerHTML = this.getEmojiAndName();

        newLabelOption.parentNode.insertBefore(newOption, newLabelOption);
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
const searchBtn  = document.getElementById("openEventsViewer" );
const closeEventsViewerBtn = document.querySelector(".closeEventsViewer");
const eventsViewerModal    = document.getElementById("eventsViewerModal");

// Modal for label maker; will appear in front of and disable other elements
// TODO: Consistent formatting
const eventLabelDropdown = document.getElementById("eventLabelDropdown");
const labelMakerModal    = document.getElementById("labelMakerModal"   );
const closeLabelMakerBtn = document.querySelector (".closeLabelMaker"  );
const emojiPreview       = document.getElementById("emojiPreview"      );
const saveLabelBtn       = document.getElementById("saveLabel"         );

const emojiPicker = document.querySelector("emoji-picker");
emojiPicker.addEventListener("emoji-click", (event) => {
    labelEmoji = event.detail.unicode;
    emojiPreview.innerText = labelEmoji;
});

// Event variables
// TODO: Consistent formatting
let labelEmoji = ""; // Variable to store selected emoji
let events     = []; // Array to store all events
let labels     = []; // Array to store all labels

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
    for (let i = startDay; i > 0; i--) {
        // Div elements will be created for each day before the start of the current month
        const dayElement = document.createElement("div");

        // Adds the CSS class to each div element
        dayElement.classList.add("otherMonth");

        // Writes in the prevoius month days into the calendar
        dayElement.innerHTML = `${prevMonthDays - i + 1}<br>`;

        // Appends each dayElement to the daysContainer
        daysContainer.appendChild(dayElement);
    }
    

    // Loop to render the days in the current month
    for (let i = 1; i <= daysInMonth; i++) {
        // Div elements will be created for each day of the current month
        const dayElement = document.createElement("div");

        // Sets the day numbers to 1 (and overwrites the previous month days number)
        dayElement.innerHTML = `${i}`;

        // Get events for the day and adds the emoji and colors from the labels
        const dayEvents = getEventsForDay(i);
        dayEvents.forEach(event => {
            // Create a emoji element
            const emojiPreview = document.createElement("preview");
            emojiPreview.innerHTML = `<br>${event.label.getEmojiAndColor()}`;

            // Add the emoji to the calendar
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
    for (let i = 1; i <= nextMonthDays; i++) {
        const dayElement = document.createElement("div");
        dayElement.classList.add("otherMonth");
        dayElement.innerHTML = `${i}<br>`
        daysContainer.appendChild(dayElement);
    }
    
    
}

// TODO: Consistent formatting
// Function to update day colors after selecting a new one
function updateDayColors() {
    document.querySelectorAll('.sunday').forEach(day => day.style.backgroundColor = sundayFillColorInput   .value);
    document.querySelectorAll('.monday').forEach(day => day.style.backgroundColor = mondayFillColorInput   .value);
    document.querySelectorAll('.tuesday').forEach(day => day.style.backgroundColor = tuesdayFillColorInput  .value);
    document.querySelectorAll('.wednesday').forEach(day => day.style.backgroundColor = wednesdayFillColorInput.value);
    document.querySelectorAll('.thursday').forEach(day => day.style.backgroundColor = thursdayFillColorInput .value);
    document.querySelectorAll('.friday').forEach(day => day.style.backgroundColor = fridayFillColorInput   .value);
    document.querySelectorAll('.saturday').forEach(day => day.style.backgroundColor = saturdayFillColorInput .value);
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
searchBtn.addEventListener("click", () => {
    const eventsList = document.getElementById("eventList");
    const pastEventsList = document.getElementById("pastEventList");
    eventsList.innerHTML = ""; // Clear the current events list
    pastEventsList.innerHTML = ""; // Clear the past events list

    // Filter out current and past events
    const now = new Date();
    const currentEvents = events.filter(event => new Date(event.endDate) >= now);
    const pastEvents = events.filter(event => new Date(event.endDate) < now);

    // Sort current events by start date
    const sortedCurrentEvents = currentEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    // Creates a table for the current events
    sortedCurrentEvents.forEach(event => createEventsTable(event, eventsList));

    // Creates a table for the past events
    pastEvents.forEach(event => createEventsTable(event, pastEventsList));

    eventsViewerModal.style.display = "block";
});

// Function to aid the creation of current and past events tables
function createEventsTable(event, tableElement) {
    const row = document.createElement("tr");

    // Create cell for the name
    const nameCell = document.createElement("td");
    nameCell.textContent = event.name;

    if(event.location != "") {
        nameCell.innerHTML += `<br> at ${event.location}`;
    }

    row.appendChild(nameCell);

    // Create cell for the label
    const labelCell = document.createElement("td");
    labelCell.innerHTML = event.label.getLabel();
    row.appendChild(labelCell);

    // Create cell for the from date
    const startsCell = document.createElement("td");
    startsCell.textContent = event.formatDate(event.startDate);
    startsCell.innerHTML += `<br> at ${event.formatTime(event.startTime)}`;
    row.appendChild(startsCell);

    // Create cell for the to date
    const endsCell = document.createElement("td");
    endsCell.textContent = event.formatDate(event.endDate);
    endsCell.innerHTML += `<br> at ${event.formatTime(event.endTime)}`;
    row.appendChild(endsCell);

    // Create cell for the dropdown menu
    const optionsCell = document.createElement('td');
    const optionsDropdown = document.createElement('div');
    optionsDropdown.className = 'dropdown';

    // Create the dropdown button with image
    const dropButton = document.createElement('button');
    dropButton.className = 'optionsDropButton';
    const optionsImg = document.createElement('img');
    optionsImg.src = '../Images/verticleDots.png';
    optionsImg.alt = 'Toggle Panel';
    optionsImg.style.width = '30px'; // Ensure the image fits the button
    optionsImg.style.height = '30px'; // Ensure the image fits the button
    dropButton.appendChild(optionsImg);
    optionsDropdown.appendChild(dropButton);

    // Create the dropdown content
    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'dropdownContent';
    dropdownContent.style.display = 'none'; // Hidden by default
    dropdownContent.innerHTML = `
        <a href="#" id="editEventBtn">Edit</a>
        <a href="#" id="deleteEventBtn">Delete</a>
    `;
    optionsDropdown.appendChild(dropdownContent);

    const editEventBtn = dropdownContent.querySelector('#editEventBtn');
    const deleteEventBtn = dropdownContent.querySelector('#deleteEventBtn');

    // Edit button functionality
    editEventBtn.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default anchor behavior

        // Replace name with input field
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = event.name;

        // Replace location with input field
        const locationInput = document.createElement("input");
        locationInput.type = "text";
        locationInput.value = event.location || "";

        // Format the name cell
        nameCell.innerHTML = "";
        nameCell.appendChild(nameInput);
        nameCell.appendChild(document.createElement("br"));   // The newline
        nameCell.appendChild(document.createTextNode("at ")); // Where the location input goes
        nameCell.appendChild(locationInput);

        // Replace label with dropdown
        labelCell.innerHTML = "";
        labelCell.appendChild(eventLabelDropdown);

        // Replace from date with date input
        const fromDateInput = document.createElement("input");
        fromDateInput.type = "date";
        fromDateInput.value = event.startDate;
        startsCell.innerHTML = "";
        startsCell.appendChild(fromDateInput);

        // Replace from time with time input
        const fromTimeInput = document.createElement("input");
        fromTimeInput.type = "time";
        fromTimeInput.value = event.startTime;
        fromTimeInput.appendChild(document.createElement("br"));
        startsCell.appendChild(fromTimeInput);

        // Replace to date with date input
        const toDateInput = document.createElement("input");
        toDateInput.type = "date";
        toDateInput.value = event.endDate;
        endsCell.innerHTML = "";
        endsCell.appendChild(toDateInput);

        // Replace to time with time input
        const toTimeInput = document.createElement("input");
        toTimeInput.type = "time";
        toTimeInput.value = event.endTime;
        toTimeInput.appendChild(document.createElement("br"));
        endsCell.appendChild(toTimeInput);

        // Change dropdown button to a checkmark button
        const checkmarkButton = document.createElement("button");
        checkmarkButton.innerHTML = "✔"; // You can use an image here instead
        checkmarkButton.className = 'checkmarkButton';
        optionsCell.innerHTML = "";
        optionsCell.appendChild(checkmarkButton);

        // Save changes when checkmark is clicked
        checkmarkButton.addEventListener('click', function () {
            const eventName      = nameInput.value;
            const eventLocation  = locationInput.value;
            const labelIndex     = eventLabelDropdown.value;
            const eventStartDate = fromDateInput.value;
            const eventStartTime = fromTimeInput.value;
            const eventEndDate   = toDateInput.value;
            const eventEndTime   = toTimeInput.value;

            // Warns the user if no name is inputted
            if (!eventName) {
                alert("Please name this event.");
                return;
            }

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

            // Update the event object
            event.name = eventName;
            event.location = eventLocation;
            event.label = selectedLabel;
            event.startDate = eventStartDate;
            event.startTime = eventStartTime;
            event.endDate = eventEndDate;
            event.endTime = eventEndTime;

            // Replace inputs with plain text
            nameCell.textContent = event.name;
            if(event.location != "") {
                nameCell.innerHTML += `<br> at ${event.location}`;
            }

            labelCell.innerHTML = "";
            labelCell.innerHTML = event.label.getLabel();

            startsCell.innerHTML = "";
            startsCell.textContent = event.formatDate(event.startDate);
            startsCell.innerHTML += `<br> at ${event.formatTime(event.startTime)}`;

            endsCell.textContent = event.formatDate(event.endDate);
            endsCell.innerHTML += `<br> at ${event.formatTime(event.endTime)}`;

            // Replace checkmark button with original dropdown button
            optionsCell.innerHTML = "";
            optionsCell.appendChild(optionsDropdown);

            // Re-render the calendar and events list
            renderCalendar();
        });
    });

    deleteEventBtn.addEventListener('click', function (e) {
        e.preventDefault();

        // Find the index of the event in the events array
        const eventIndex = events.indexOf(event);

        // Remove the event from the events array
        if (eventIndex > -1) {
            events.splice(eventIndex, 1);
        }

        // Remove the corresponding row from the table
        tableElement.removeChild(row);

        // Re-render the calendar and events list
        renderCalendar();
    });

    // Toggle dropdown visibility on button click
    dropButton.addEventListener('click', function () {
        dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
    });

    // Append the dropdown to the cell
    optionsCell.appendChild(optionsDropdown);

    // Append the cell to the row
    row.appendChild(optionsCell);

    tableElement.appendChild(row);
}

// Search bar for the eventViewerModal
function searchEvents() {
    var input, filter, eventTable, pastEventTable, tr, td, i, txtValue;

    // Get the user input and filter it so it is case-insensitive
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();

    // Get information from the event table and past event table
    eventTable = document.getElementById("eventTable");
    pastEventTable = document.getElementById("pastEventTable");
  
    // Search for active events
    tr = eventTable.getElementsByTagName("tr"); // Get all rows from the active events table
    for (i = 1; i < tr.length; i++) {           // Loop through each row excluding the header row
        // Get the first column of each row and check if there is a value
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            // There is a value; get the text content
            txtValue = td.textContent || td.innerText;

            // Check if the case-insensitive text content matches the case-insensitive filter
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                // The text content matches the filter; display the associated row
                tr[i].style.display = "";
            } else {
                // The text content does not match the filter; hide the associated row
                tr[i].style.display = "none";
            }
        }
    }
  
    // Search for past events
    tr = pastEventTable.getElementsByTagName("tr"); // Get all rows from the active events table
    for (i = 1; i < tr.length; i++) {               // Loop through each row excluding the header row
        // Get the first column of each row and check if there is a value
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            // There is a value; get the text content
            txtValue = td.textContent || td.innerText;

            // Check if the case-insensitive text content matches the case-insensitive filter
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                // The text content matches the filter; display the associated row
                tr[i].style.display = "";
            } else {
                // The text content does not match the filter; hide the associated row
                tr[i].style.display = "none";
            }
        }
    }
}

// Event listener to close the event viewer modal
closeEventsViewerBtn.addEventListener("click", () => {
    eventsViewerModal.style.display = "none";
});

// Add listener to the dropdown menu
eventLabelDropdown.addEventListener("change", function() {
    if (eventLabelDropdown.value === "newEvent") {
        openlabelMakerModal();               // Function to open the label maker modal
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
    if (event.target == colorPickerModal || 
        event.target == newEventModal    ||
        event.target == labelMakerModal  ||
        event.target == eventsViewerModal) {
    // TODO: Consistent formatting
        colorPickerModal .style.display = "none";
        newEventModal    .style.display = "none";
        labelMakerModal  .style.display = "none";
        eventsViewerModal.style.display = "none";
    }
});

// Implementation of the event save button
saveEventBtn.addEventListener("click", () => {
    // Temporary variables that will be added to a new event
    // TODO: Consistent formatting
    const eventName      = document.getElementById("eventName"     ).value;
    const eventLocation  = document.getElementById("eventLocation" ).value;
    const eventStartDate = document.getElementById("eventStartDate").value;
    const eventStartTime = document.getElementById("eventStartTime").value;
    const eventEndDate   = document.getElementById("eventEndDate"  ).value;
    const eventEndTime   = document.getElementById("eventEndTime"  ).value;
    const eventNotes     = document.getElementById("eventNotes"    ).value;
    const labelIndex     = eventLabelDropdown                       .value;

    // Warns the user if no name is inputted
    if (!eventName) {
        alert("Please name this event.");
        return;
    }

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
    const selectOption = eventLabelDropdown.querySelector('option[value="select"]'); // Needed to set label back to select
    selectOption.selected = true;

    newEventModal.style.display = "none";
    renderCalendar();
});

// Implementation of the label save button
saveLabelBtn.addEventListener("click", () => {
    const labelName = document.getElementById("labelName").value;
    const labelColor = document.getElementById("labelColor").value;
    // labelEmoji = document.getElementById("emojiPreview").value;
    labelEmoji = '😐'; // temp please fix this emoji preview doesn't work rn

    // Warns the user if no name is inputted
    if (!labelName) {
        alert("Please provide a name for the label.");
        return;
    }

    // Warns the user if no emoji is inputted
    if (!labelEmoji) {
        alert("Please provide an emoji for the label.");
        return;
    }

    // Warns the user if no color is inputted
    // Note: Should not happen under normal circumstances
    if (!labelColor) {
        alert("Please provide an emoji for the label.");
        return;
    }

    const newLabel = new Label(labelName, labelEmoji, labelColor);
    
    newLabel.addLabelOption(); // New method does what old code did
    labels.push(newLabel);

    // Reset the label maker modal
    document.getElementById("labelName").value = "";
    document.getElementById("labelColor").value = "#ffffff";
    emojiPreview.innerText = "";
    labelEmoji = "";

    // Close the label maker modal
    labelMakerModal.style.display = "none";
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
