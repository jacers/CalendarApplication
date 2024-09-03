// Functions for the views of the calendar
// Can be expanded to have more functions if needed

class Views 
{
    constructor(currentDate, daysContainer, monthYearDisplay)
    {
        this.currentDate = currentDate;
        this.daysContainer = daysContainer;
        this.monthYearDisplay = monthYearDisplay;
    }

    // MONTH
    // Function to have the whole calendar displayed in Month format
    renderCalendarMonth() 
    {
        // Clearing the days currently being displayed
        daysContainer.innerHTML = "";

        // Removing other view containers to not have the views overlappping
        daysContainer.classList.remove("dayViewContainer");
        daysContainer.classList.remove("yearViewContainer");
        daysContainer.classList.remove("monthViewContainer");

        // Adding the month view container
        daysContainer.classList.add("monthViewContainer");

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

    // DAY
    // Function to render in a day view for the user to see
    renderCalendarDay()
    {
        // Clearing the days container just in case
        daysContainer.innerHTML = "";

        // Adds the dayViewContainer to the daysContainer to have the day view style
        daysContainer.classList.add("dayViewContainer");

        // Creates a new div element to assign to dayView
        const dayView = document.createElement("div");
        dayView.classList.add("dayView");

        // Loop that runs through the hours of the day
        for (let hour = 0; hour < 24; hour++) 
        {
            // Creates a new div element and adds the hour class to it
            const hourDiv = document.createElement("div");
            hourDiv.classList.add("hour");

            // Styling (Trying to move this to CSS but CSS is being a bit of a pain)
            // 60 px just to make some correlation to the 60 minutes (will make it easier to 
            // to have events located in the correct spots in day view)
            hourDiv.style.top = `${hour * 60}px`;

            // Creating a new span element for the hour label and sets the text elements
            // Span elements allows for mark up in part of the container/document
            const hourLabel = document.createElement("span");
            hourLabel.textContent = `${hour}:00`;

            // Appending the hour label to the hour container/div element
            hourDiv.appendChild(hourLabel);

            // Appending the hour block to the dayView element
            dayView.appendChild(hourDiv);
        }

        // Update the date being displayed to the users
        monthYearDisplay.textContent = currentDate.toLocaleDateString();

        // After all hours blocks have been rendered/added, it is appended to the daysContainer
        daysContainer.appendChild(dayView);
    }

    // YEAR
    // Function to render in a year view for the user to see
    renderCalendarYear()
    {
        // Clearing the day container
        daysContainer.innerHTML = "";

        // Adding the year view container
        daysContainer.classList.add("yearViewContainer");
        // Should be daysContainer.classList.add("yearViewContainer"); but that doesnt work, having it as =
        // screws up the month view but makes the year view work. IDK WHATS HAPPENING ANYMORE (probably CSS screwing this up)

        // Declaring the months
        const months = 
        [
            "January", "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November", "December"
        ];

        // Loop to create a month
        months.forEach((month, index) => {

            // Creating a new div element for each month
            const monthDiv = document.createElement("div");

            // Adding the styling to the div element
            monthDiv.classList.add("month");

            // Creating a new header element for tbe month title
            const monthTitle = document.createElement("h3");
            monthTitle.textContent = month;

            // Adding the title to the div element
            monthDiv.appendChild(monthTitle);

            // Creating a div element for the grid of days in the month
            const daysGrid = document.createElement("div");
            daysGrid.classList.add("monthDaysGrid");

            // Determine the number of days ib the month
            const daysInMonth = new Date(currentDate.getFullYear(), index + 1, 0).getDate();

            // Getting the first day of the month (0 indexing is Sunday)
            const firstDay = new Date(currentDate.getFullYear(), index, 1).getDay();

            // Fill the days grid with empty divs for the days before the first of the month
            for (let i = 0; i < firstDay; i++) 
            {
                const emptyDiv = document.createElement("div");
                emptyDiv.classList.add("emptyDay");
                daysGrid.appendChild(emptyDiv);
            }

            // Fill the days grid with days of the month
            for (let day = 1; day <= daysInMonth; day++) 
            {
                const dayDiv = document.createElement("div");
                dayDiv.classList.add("yearDay");
                dayDiv.textContent = day;
                daysGrid.appendChild(dayDiv);
            }

            // Adding the days to the month div
            monthDiv.appendChild(daysGrid);

            // Update the date displayed to the users
            monthYearDisplay.textContent = currentDate.getFullYear();

            // Appending the monthh div to the days container
            daysContainer.appendChild(monthDiv);
        });
    }

    // WEEK
    // Function to render in a week view for the user to see (IDK if we will actually implement this)
    renderCalendarWeek()
    {
        // Getting the date that will be displayed to users
        // Creating a startOfWeek variable
        const startOfWeek = new Date(currentDate);

        // Calculating the start date by getting the number assigned to current date and
        // subtracting it from the actual date (Sunday)
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        // Creating an endOfWeek variable
        const endOfWeek = new Date(startOfWeek);

        // Calculating the end date of the week by adding six (Saturday)
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        monthYearDisplay.textContent = `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;

        // Clear the days container
        daysContainer.innerHTML = "";

        // Add the weekViewContainer class to the daysContainer
        daysContainer.classList=("weekViewContainer");

        // Create headers and blocks for each day of the week
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        weekdays.forEach(weekday => {
            // Create header for the day
            const headerDiv = document.createElement("div");
            headerDiv.classList.add("weekdayHeader");
            headerDiv.textContent = weekday;
            daysContainer.appendChild(headerDiv);
        });

        for (let day = 0; day < 7; day++) 
        {
            // Create container for each day
            const dayBlock = document.createElement("div");
            dayBlock.classList.add("weekdayBlock");

            // Appending the block to each day(s)
            daysContainer.appendChild(dayBlock);
        }
    }

}