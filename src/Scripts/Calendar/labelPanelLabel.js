// General DOM elements
const allLabels = document.querySelectorAll('.labelContent label');
const labelDots = document.querySelectorAll('label img');
const allLabelCont = document.querySelectorAll('.labelContent');

// Lab editor elements
const closeLabelEditor = document.querySelector('.closeLabelEditor');
const labelEditName = document.querySelector('#labelEditName');
const labelColorEdit = document.querySelector('#labelColorEdit');
const saveLabelEdit = document.querySelector('.saveLabelEdit');
const deleteLab = document.querySelector('.deleteLab');

// Stored variables
let prevLab = '';
let prevLabName = '';
let prevLabEmoji = '';
let prevLabInstance = '';

class Label {
    constructor(name, emoji, color) {
        // TODO: Consistent formatting
        this.name  = name ; // Name of the label
        this.emoji = emoji; // Emoji associated with the label
        this.color = color; // Color associated with the label
        this.id = labels.length; // Doing this so Labels can be removed
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
        if(optionToRemove)
        {
            optionToRemove.remove();
        }
    }

    // Updates name and emoji after change, changes html if label is present as an option
    changeNameAndEmoji(name, emoji) {
        this.name = name;
        this.emoji = emoji;

        const targetLabOption = eventLabelDropdown.querySelector(`option[value="${this.id}"]`);
        if(targetLabOption)
        {
            targetLabOption.innerHTML = this.getEmojiAndName();
        }
    }

}

// Implementation of the label save button, creates new label instance and saves to the array
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
    
    labels.push(newLabel);
    submitLabInput(newLabel); // Adding newLabel to label panel

    // Adding to proper category
    const associatedCat = categories[eventCatDropdown.value];
    associatedCat.addLabel(newLabel);

    // Reset the label maker modal
    document.getElementById("labelName").value = "";
    document.getElementById("labelColor").value = "#ffffff";
    emojiPreview.innerText = "";
    labelEmoji = "";

    // Close the label maker modal
    labelMakerModal.style.display = "none";
});

// Handles the creation of the new label entry on the label panel
function submitLabInput(label)
{
    const labelTitle = label.getEmojiAndName(); 

    // working backwards to get proper labelContent
    const currentCat = categories[eventCatDropdown.value];
    const closeLabelDown = currentCat.labelDown;
    const labelContent = closeLabelDown.querySelector('.labelContent');


    // Creation of all elements needed for label to run correctly
    const labelElement = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;

    // Creation of label dots
    const newDots = document.createElement('img');
    newDots.src = "../../src/Images/verticleDots.png"; // MAKE SURE CONNECTIONS IS CORRECT
    newDots.alt = "verticle dots";

    // Appending of proper elements
    labelElement.appendChild(checkbox);
    labelElement.appendChild(document.createTextNode(labelTitle));
    labelElement.appendChild(newDots);
    labelContent.appendChild(labelElement);

    // Adding proper event listener for newDots
    newDots.addEventListener('click', openLabEditor);
}

// Opens the label editor modal
function openLabEditor(e)
{
    e.preventDefault(); // Stopping checkbox from being toggled
    labEditorModal.style.display = 'block';

    // Getting necessary elements for the save
    prevLab = e.target.parentElement;
    prevLabName = prevLab.textContent.trim().slice(2);
    
    // Finding the label instance by name
    prevLabInstance = getLabByName(prevLabName); // A space is being added in behind name and is giving us issues
    prevLabEmoji = prevLabInstance.emoji;

    labelEditName.value = prevLabName;
    emojiPreviewEdit.innerText = prevLabEmoji;
    labelEmoji = prevLabEmoji;
}

// Event listener that allows verticle dots associated with each label to open editor modal
labelDots.forEach(labelDot => {
    labelDot.addEventListener('click', openLabEditor);
})

// Add listener to the dropdown menu
eventLabelDropdown.addEventListener("change", function() {
    if (eventLabelDropdown.value === "newEvent") {
        openlabelMakerModal();               // Function to open the label maker modal
        eventLabelDropdown.value = "select"; // Reset the dropdown to the default option
    }
});

// Event listener to open the label maker modal
function openlabelMakerModal() {
    labelMakerModal.style.display = "block";
}

saveLabelEdit.addEventListener('click', (e) => {
    if(labelEditName.value.trim() === '')
    {
        alert('Please provide a name for this label');
        return;
    }

    // Getting name
    const newName = labelEditName.value.trim();

    // Setting the HTML, necessary with custom checkbox
    const newLabelHTML = `
    <input type="checkbox" checked>${labelEmoji} ${newName}
    <img src="../../src/Images/verticleDots.png" alt="verticle dots">`; // MAKE SURE CONNECTION IS CORRECT

    // Getting the color
    const newColor = labelColorEdit.value; // This implies a lot be careful

    // Update the innerHTML of the label element
    prevLab.innerHTML = newLabelHTML;

    // Need to re-add the event listener since we're making new HTML
    const newLabelDot = prevLab.querySelector('img');
    newLabelDot.addEventListener('click', openLabEditor);

    prevLabInstance.changeNameAndEmoji(newName, labelEmoji);

    labEditorModal.style.display = 'none';
})

deleteLab.addEventListener('click', (e) => {
    const labConfirmation = confirm(`Are you sure you want to delete \"${prevLabName}\"?`);
    if(labConfirmation)
    {
        deleteLabHelper();
    }
    else
    {
        return;
    }
    labEditorModal.style.display = 'none';
})

function deleteLabHelper()
{
    // Getting associated category
    const associatedCat = findAssociatedCat(prevLabInstance);
    associatedCat.removeLabels();

    // Removing from label panel
    prevLab.remove(); 

    // Removing from labels array
    const targetIndex = labels.findIndex(label => label === prevLabInstance);
    labels.splice(targetIndex, 1);

    // Removing label from associated category
    associatedCat.removeLabel(prevLabInstance);

    // Adding labels back
    associatedCat.addLabels();
}


// Helper function that returns the label instance when given the name
function getLabByName(name)
{
    return labels.find(label => label.name.trim() === name.trim());
}

// Helper function that returns the associated category
function findAssociatedCat(label)
{
    return categories.find(category => category.catLabels.includes(label));
}