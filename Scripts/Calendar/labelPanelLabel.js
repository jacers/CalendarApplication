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

// Handles input deemed acceptable and creates the actual label
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
    newDots.src = "../Images/verticleDots.png";
    newDots.alt = "verticle dots";

    // Appending of proper elements
    labelElement.appendChild(checkbox);
    labelElement.appendChild(document.createTextNode(labelTitle));
    labelElement.appendChild(newDots);
    labelContent.appendChild(labelElement);

    // Adding proper event listener for newDots
    newDots.addEventListener('click', openLabEditor);
}

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

labelDots.forEach(labelDot => {
    labelDot.addEventListener('click', openLabEditor);
})

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
    <img src="../Images/verticleDots.png" alt="verticle dots">`;

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


// KEEPING THESE FUNCTIONS FOR FUTURE USE
// function handleLabMenu(e)
// {
//     // Stopping parent button from triggering
//     e.stopPropagation();
//     e.preventDefault();
// }

// function editLabel(e)
// {
//     console.log('edit button hit');
// }

// function deleteLabel(e)
// {
//     console.log('delete button hit');
// }

// function cancelLabMenu(labelMenu)
// {
//     console.log('closed');
//     labelMenu.style.display = 'none';

//     if(eventHandlers[labelMenu])
//     {
//         document.removeEventListener('click', eventHandlers[labelMenu]);
//         delete eventHandlers[labelMenu];
//     }
// }

// // Keeping this for now will probably delete later
// function generateLabelMenu(label)
// {
//     const labelMenu = document.createElement('div');
//     labelMenu.classList.add('labelMenu');

//     const labClose = document.createElement('span');
//     labClose.classList.add('labClose');
//     labClose.textContent = 'x';

//     const editLabBtn = document.createElement('button');
//     editLabBtn.classList.add('editLabBtn');
//     editLabBtn.textContent = 'Edit'

//     const deleteLabBtn = document.createElement('button');
//     deleteLabBtn.classList.add('deleteLabBtn');
//     deleteLabBtn.textContent = 'Delete'

//     const colorContainer = document.createElement('div');
//     colorContainer.classList.add('colorContainer');

//     const colorPicker = document.createElement('input');
//     colorPicker.type = 'color';

//     const colorText = document.createElement('span');
//     colorText.classList.add('colorText');
//     colorText.textContent = 'Color';
    
//     colorContainer.appendChild(colorText);
//     colorContainer.appendChild(colorPicker);

//     labelMenu.appendChild(labClose);
//     labelMenu.appendChild(editLabBtn);
//     labelMenu.appendChild(deleteLabBtn);
//     labelMenu.appendChild(colorContainer);
//     label.appendChild(labelMenu);

//     editLabBtn.addEventListener('click', editLabel);
//     deleteLabBtn.addEventListener('click', deleteLabel);

//     labelMenu.addEventListener('click', function(e) {
//         e.preventDefault();
//     });

//     labClose.addEventListener('click', function(e) {
//         cancelLabMenu(labelMenu);
//     });
// }

