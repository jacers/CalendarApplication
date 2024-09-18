// Importing from Firebase 
import { database, doc, setDoc, collection, addDoc, auth, query, where, getDocs} from "../Firebase";

// Importing needed references
import { adjustTextColor, openDayEventsModal, Event } from "./Events";
//import { Label } from "./labelPanelLabel";

// Selecting DOM elements (Elements in the CalendarPage.html)
export const prevBtn = document.getElementById("prevButton");
export const nextBtn = document.getElementById("nextButton");
export const monthYearDisplay = document.getElementById("monthYearDisplay");
export const daysContainer = document.querySelector (".days");

// Modal for color picker; will appear in front of and disable other elements
export const openModalBtn = document.getElementById("openModalBtn");
export const modal = document.getElementById("colorPickerModal");
export const closeModalBtn = document.querySelector (".close");

// Color picker's user interaction elements
export const openColorPickerBtn = document.getElementById("openColorPickerBtn");
export const colorPickerModal = document.getElementById("colorPickerModal"  );
export const closeColorPickerBtn = document.querySelector(".closeColorPicker" );

// Modal for new event; will appear in front of and disable other elements
export const openNewEventBtn = document.getElementById("openNewEvent");
export const newEventModal = document.getElementById("newEventModal");
export const closeNewEventBtn = document.querySelector (".closeNewEvent");
export const eventCatDropdown = document.querySelector("#eventCatDropdown");
export const labelInput = document.querySelector("#labInputs");
export const saveEventBtn = document.getElementById("saveEvent");

// Modal to view events; will appear in front of and disable other elements
export const searchBtn = document.getElementById("openEventsViewer");
export const closeEventsViewerBtn = document.querySelector(".closeEventsViewer");
export const eventsViewerModal = document.getElementById("eventsViewerModal");

// Modal to view events within a day; will appear in front of and disable other elements
export const dayEventsViewerModal = document.getElementById("dayEventsViewerModal");
export const closeDayEventsModal = document.querySelector(".closeDayEventsModal");
export const selectedDayElement = document.getElementById("selectedDay");
export const dayEventList = document.getElementById("dayEventList");

// Modal for label maker; will appear in front of and disable other elements
export const eventLabelDropdown = document.getElementById("eventLabelDropdown");
export const labelMakerModal = document.getElementById("labelMakerModal");
export const closeLabelMakerBtn = document.querySelector (".closeLabelMaker");
export const emojiPreview = document.getElementById("emojiPreview");
export const emojiPreviewEdit = document.getElementById("emojiPreviewEdit");
export const saveLabelBtn = document.getElementById("saveLabel");

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
export const catMakerModal = document.querySelector('.catMakerModal');
export const closeNewCat = document.querySelector('.closeNewCat');
export const saveCat = document.querySelector('.saveCat');
export const categoryName = document.querySelector('#categoryName');
export const catEditorModal = document.querySelector('.catEditorModal'); 
export const labEditorModal = document.querySelector('.labelEditorModal'); 

// Event variables
export let labelEmoji = ""; // Variable to store selected emoji
export let events = []; // Array to store all events
export let labels = []; // Array to store all labels
export let categories = []; // Array to store all categories

// Color picker input elements
const sundayFillColorInput = document.getElementById("sundayFillColor");
const mondayFillColorInput = document.getElementById("mondayFillColor");
const tuesdayFillColorInput = document.getElementById("tuesdayFillColor");
const wednesdayFillColorInput = document.getElementById("wednesdayFillColor");
const thursdayFillColorInput = document.getElementById("thursdayFillColor");
const fridayFillColorInput = document.getElementById("fridayFillColor");
const saturdayFillColorInput = document.getElementById("saturdayFillColor");

// Initializing the "current" date to display to user
export let currentDate = new Date();

// Helper function to normalize date (removes time)
function normalizeDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Function that returns events for a specific day
export function getEventsForDay(day, month = currentDate.getMonth(), year = currentDate.getFullYear()) {
    return events.filter(event => {
        const eventStart = normalizeDate(new Date(event.startDate)); // Strip time from start date
        const eventEnd = normalizeDate(new Date(event.endDate)); // Strip time from end date
        //eventEnd.setDate(eventEnd.getDate() + 1); // Makes sure the full range is included on the calendar view
        const currentDay = new Date(year, month, day); // The current day being rendered

        return currentDay >= eventStart && currentDay <= eventEnd;
    });
}

// Function to have the whole calendar displayed
export function renderCalendar() {
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
        dayElement.innerHTML = `${i}<br>`

        // Get events for the day from the next month
        const nextMonthEvents = getEventsForDay(i, currentDate.getMonth() + 1, currentDate.getFullYear());
        
        // Going through each event and adding it graphically to calendar
        nextMonthEvents.forEach(event => {
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
        event.target == labEditorModal) {
        colorPickerModal.style.display = "none";
        newEventModal.style.display = "none";
        labelMakerModal.style.display = "none";
        eventsViewerModal.style.display = "none";
        catMakerModal.style.display = "none";
        catEditorModal.style.display = "none";
        labEditorModal.style.display = "none";
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


/* STORAGE TO DATABASE */
// Function to convert a Label instance to a plain object
function labelToPlainObject(label) {
    if (!label) return null;
    return {
        name: label.name,
        emoji: label.emoji,
        color: label.color,
        id: label.id,
        isChecked: label.isChecked
    };
}

// Function to add an event for the authenticated user
export async function addEvent(event) {
    const user = auth.currentUser;
    console.log(user + "USER");

    if (!user) {
        console.error("No authenticated user found.");
        return;
    }

    console.log("Auth user found:", user.uid);
    const userId = user.uid;
    const eventsRef = collection(database, "Users", userId, "Events");

    // Ensure event is a valid object
    if (!event || typeof event !== "object") {
        console.error("Invalid event object:", event);
        return;
    }

    // Ensure event has necessary fields
    if (!event.name) {
        console.warn("Event missing name:", event);
        return;
    }

    // Check if event already exists
    const q = query(eventsRef, where("name", "==", event.name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        console.log("Event already exists:", event.name);
        return; // Skip adding this event
    }

    // Convert Label instance to plain object
    const labelPlain = labelToPlainObject(event.label);

    // Extract values from the Event object
    const plainEvent = {
        name: event.name,
        location: event.location,
        startDate: event.startDate,
        startTime: event.startTime,
        endDate: event.endDate,
        endTime: event.endTime,
        notes: event.notes,
        label: labelPlain
    };

    // Add the event to the Firestore collection
    try {
        await addDoc(eventsRef, plainEvent);
        console.log("Event added successfully:", event.name);
    } catch (error) {
        console.error("Error adding event:", error);
    }
}
/* STORAGE TO DATABASE */



/*
// Function to fetch events from Firestore
async function fetchEventsFromFirestore() {
    const user = auth.currentUser;
    if (!user) {
        console.error("No authenticated user found.");
        return [];
    }

    try {
        const userId = user.uid;
        const eventsRef = collection(database, 'Users', userId, 'Events');
        const querySnapshot = await getDocs(eventsRef);

        // Parse Firestore documents into Event objects
        const events = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return parseFirestoreEvent(data); // Convert to Event object
        });
        return events;
    } catch (error) {
        console.error("Error fetching events from Firestore:", error);
        return [];
    }
}

// Function to convert a Firestore document to an Event object
function parseFirestoreEvent(data) {
    const label = data.label ? new Label(data.label.name, data.label.emoji, data.label.color) : null;
    return new Event(
        data.name,
        data.location,
        data.startDate,
        data.startTime,
        data.endDate,
        data.endTime,
        data.notes,
        label
    );
}


// Function to load events
async function loadEvents() {
    try {
        const fetchedEvents = await fetchEventsFromFirestore();
        events.length = 0; // Clear existing events
        events.push(...fetchedEvents); // Add fetched events to the array
        console.log("Events loaded successfully:", events);
        renderCalendar(); // Call this to update the calendar UI
    } catch (error) {
        console.error("Error loading events:", error);
    }
}

// Listener for authentication state changes
auth.onAuthStateChanged(async (user) => {
    if (user) {
        console.log("User logged in:", user.uid);
        await loadEvents(); // Load events when user logs in
    } else {
        console.log("No user logged in.");
    }
});

// Function to check if the user is authenticated and load events
async function initializeApp() {
    const user = auth.currentUser;
    if (user) {
        console.log("User is authenticated on page load:", user.uid);
        await loadEvents(); // Load events if the user is already logged in
    } else {
        console.log("No authenticated user found on page load.");
    }
}

// Call initializeApp when the page loads
document.addEventListener("DOMContentLoaded", initializeApp);
*/

/* Making Label class again because import destroys the website */
class Label {
    constructor(name, emoji, color, id, isChecked ) {
        this.name = name;        // Name of the label
        this.emoji = emoji;      // Emoji associated with the label
        this.color = color;      // Color associated with the label
        this.id = id; // Generate a unique ID for each label
        this.isChecked = isChecked;  // Determines if the checkbox is marked
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

        // Giving new option proper value and name/emoji
        newOption.value = this.id;
        newOption.innerHTML = this.getEmojiAndName();

        // Inserting this before the new label option to maintain consistency and readability
        newLabelOption.parentNode.insertBefore(newOption, newLabelOption);
    }

    // Removes the label from the options under the event label dropdown selector
    removeLabelOption() {
        const eventLabelDropdown = document.querySelector('#eventLabelDropdown');
        const optionToRemove = eventLabelDropdown.querySelector(`option[value="${this.id}"]`);
        if(optionToRemove) {
            optionToRemove.remove();
        }
    }

    // Updates name and emoji after change, changes html if label is present as an option
    changeNameAndEmoji(name, emoji) {
        this.name = name;
        this.emoji = emoji;

        const targetLabOption = eventLabelDropdown.querySelector(`option[value="${this.id}"]`);
        if(targetLabOption) {
            targetLabOption.innerHTML = this.getEmojiAndName();
        }
    }
}

// Function to parse Firestore label data into Label objects
function parseLabel(data) {
    return new Label(
        data.name,
        data.emoji,
        data.color,
        data.id,
        data.isChecked
    );
}

/* LOAD EVENTS FOR USER */
async function fetchEventsFromFirestore() {
    const user = auth.currentUser;
    if (!user) {
        console.error("No authenticated user found.");
        return [];
    }

    try {
        const userId = user.uid;
        const eventsRef = collection(database, 'Users', userId, 'Events');
        const querySnapshot = await getDocs(eventsRef);

        // Create Event objects from Firestore documents
        const events = querySnapshot.docs.map(doc => {
            const data = doc.data();

            // Parse label data if it exists
            let label = null;
            if (data.label) {
                label = parseLabel(data.label); // Ensure parseLabel is correctly implemented
            }

            // Create and return an Event object
            return new Event(
                data.name || '', // Ensure 'name' field exists
                data.location || '', // Ensure 'location' field exists
                data.startDate || '', // Ensure 'startDate' field exists
                data.startTime || '', // Ensure 'startTime' field exists
                data.endDate || '', // Ensure 'endDate' field exists
                data.endTime || '', // Ensure 'endTime' field exists
                data.notes || '', // Ensure 'notes' field exists
                label // Attach the parsed label if available
            );
        });

        console.log(events);
        return events;
    } catch (error) {
        console.error("Error fetching events from Firestore:", error);
        return [];
    }
}

// Function to load events
async function loadEvents() {
    try {
        const fetchedEvents = await fetchEventsFromFirestore();
        events.length = 0; // Clear existing events
        events.push(...fetchedEvents); // Add fetched events to the array
        console.log("Events loaded successfully:", events);
        renderCalendar(); // Call this to update the calendar UI
    } catch (error) {
        console.error("Error loading events:", error);
    }
}

// Listener for authentication state changes
auth.onAuthStateChanged(async (user) => {
    if (user) {
        console.log("User logged in:", user.uid);
        await loadEvents(); // Load events when user logs in
    } else {
        console.log("No user logged in.");
    }
});

// Function to check if the user is authenticated and load events
async function initializeApp() {
    const user = auth.currentUser;
    if (user) {
        console.log("User is authenticated on page load:", user.uid);
        await loadEvents(); // Load events if the user is already logged in
    } else {
        console.log("No authenticated user found on page load.");
    }
}

// Call initializeApp when the page loads
document.addEventListener("DOMContentLoaded", initializeApp);
/* LOAD EVENTS FOR USER */




// The current calendar look upon opening the page
renderCalendar();
updateDayColors();