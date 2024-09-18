
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

// Event listener to open the new event modal
openNewEventBtn.addEventListener("click", () => {
    newEventModal.style.display = "block";
});

// Implementation of the event save button
saveEventBtn.addEventListener("click", () => {
    // Temporary variables that will be added to a new event
    const eventName = document.getElementById("eventName").value;
    const eventLocation = document.getElementById("eventLocation").value;
    const eventStartDate = document.getElementById("eventStartDate").value;
    const eventStartTime = document.getElementById("eventStartTime").value;
    const eventEndDate = document.getElementById("eventEndDate").value;
    const eventEndTime = document.getElementById("eventEndTime").value;
    const eventNotes = document.getElementById("eventNotes").value;
    const labelIndex = eventLabelDropdown.value;

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

    // Clear the input fields
    document.getElementById("eventName").value = "";
    document.getElementById("eventLocation").value = "";
    document.getElementById("eventStartDate").value = "";
    document.getElementById("eventStartTime").value = "";
    document.getElementById("eventEndDate").value = "";
    document.getElementById("eventEndTime").value = "";
    document.getElementById("eventNotes").value = "";
    const selectOption = eventLabelDropdown.querySelector('option[value="select"]'); // Needed to set label back to select
    selectOption.selected = true;

    newEventModal.style.display = "none";
    renderCalendar();
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

// Event listener to open the day event viewer modal
function openDayEventsModal(day) {
    selectedDayElement.textContent = `${currentDate.toLocaleString("default", { month: "long" })} ${day}, ${currentDate.getFullYear()}`;
    dayEventList.innerHTML = ""; // Clear the current events list

    const dayEvents = getEventsForDay(day);
    dayEvents.forEach(event => createEventsTable(event, dayEventList));

    dayEventsViewerModal.style.display = "block";
}

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
    optionsImg.src = '../../src/Images/verticleDots.png'; // PLEASE MAKE SURE I RECONNECTED THIS CORRECTLY SORRY
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
            const eventName = nameInput.value;
            const eventLocation = locationInput.value;
            const labelIndex = eventLabelDropdown.value;
            const eventStartDate = fromDateInput.value;
            const eventStartTime = fromTimeInput.value;
            const eventEndDate = toDateInput.value;
            const eventEndTime = toTimeInput.value;

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
            const endDateTime = new Date(`${eventEndDate}T${eventEndTime}`);

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

// Function to convert a hex color to RGB
function hexToRgb(hex) {
    // Remove the '#' if it's there
    hex = hex.replace('#', '');
    
    // Parse the hex into RGB components
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    
    return { r, g, b };
}

// Function to calculate brightness based on RGB values
function getBrightness({ r, g, b }) {
    // Use the luminance formula to get the brightness
    return (r * 299 + g * 587 + b * 114) / 1000;
}

// Function to change the text color based on the background color
function adjustTextColor(backgroundColorHex) {
    let rgb = hexToRgb(backgroundColorHex);
    let brightness = getBrightness(rgb);
    
    // If the brightness is high, use dark text; otherwise, use light text
    if (brightness > 128) {
        return 'black';
    } else {
        return 'white';
    }
}

/*
function createExampleEvents() {
    // Label is Meetings from work
    const E1 = new Event("Sponsor", "Felgar 300", "2024-09-11", "11:10", "2024-09-18", "11:50", "This meeting is stupid", labels[0]);
    events.push(E1);

    // Label is appointments from personal
    const E2 = new Event("Doctor", "Norman Regional", "2024-09-12", "9:00", "2024-09-12", "9:50", "GP Checkup", labels[3]);
    events.push(E2);

    // Label is local events from other
    const E3 = new Event("NMF", "Main Street", "2024-09-14", "10:00", "2024-09-21", "10:50", "", labels[5]);
    events.push(E3);

    // label is projects from work
    const E4 = new Event("Finish Events", "The streets", "2024-09-11", "5:00", "2024-09-18", "6:00", "", labels[1]);
    events.push(E4);

    // label is birthdays
    const E5 = new Event("Long birthday", "house", "2024-09-29", "10:00", "2024-10-6", "11:00", "", labels[2]);
    events.push(E5);

    renderCalendar();
}
    */