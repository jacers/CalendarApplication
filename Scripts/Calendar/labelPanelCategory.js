// THIS CODE WILL BE HEAVILY DE-BLOATED SOON

// General DOM Elements
const addCatButton = document.querySelector("#addCat");
const verticleDots = document.querySelectorAll('.verticleDots');
const catClosers = document.querySelectorAll('.catClose');
const labelDowns = document.querySelectorAll('.labelDown');

// Modal for category editor
const catNameEdited = document.querySelector('#categoryNameEdited');
const closeEditCat = document.querySelector('.closeEditCat');
const saveEditCat = document.querySelector('.saveEditCat');
const deleteCat = document.querySelector('.deleteCat');

// Stored variables
let prevCat = ''; // Previous Category instance
let prevCatName = ''; // Previous Category's catName span

// Object that handles problem event handlers
const eventHandlers = {};

class Category
{
    constructor(labelDown)
    {
        this.name = labelDown.querySelector('.catName').textContent;
        this.catLabels = this.getAllLabels(labelDown.querySelectorAll('.labelContent label'));
        this.labelDown = labelDown;
        this.id = categories.length;
    }

    getAllLabels(labelNodes)
    {
        // All labels under category are initalized and added to labels array here
        let returnLabels = [];
        labelNodes.forEach(label => {
            const emoji = Array.from(label.textContent.trim())[0]; // Get's first character from string
            const name = label.textContent.trim().slice(2); // avoids present emoji

            let newLabel = new Label(name, emoji, '#ffffff');
            labels.push(newLabel);

            returnLabels.push(newLabel);
        });
        return returnLabels;
    }

    // Adds this category as an option, using index as value for ease of access
    addCatOption()
    {
        const eventCatDropdown = document.querySelector('#eventCatDropdown');
        const newCatOption = eventCatDropdown.querySelector('option[value="newCategory"]');
        const newOption = document.createElement('option');

        newOption.value = categories.length - 1;
        newOption.innerHTML = this.name;

        newCatOption.parentNode.insertBefore(newOption, newCatOption);
    }

    addLabel(label)
    {
        this.catLabels.push(label);

        // Refreshing labels
        this.removeLabels();
        this.addLabels();
    }

    // This is called when a category is selected within the event adder
    addLabels()
    {
        // First check if labelInputs is hidden or not, change if it is
        const labInputs = document.querySelector("#labInputs");
        if(labInputs.style.display === 'none')
        {
            labInputs.style.display === 'inline-block';
        }

        // Adding each label associated with the category
        this.catLabels.forEach(label => {
            label.addLabelOption();
        });
    }

    removeCatOption()
    {
        // Getting and removing target option
        const eventCatDropdown = document.querySelector('#eventCatDropdown');
        const targetCatOption = eventCatDropdown.querySelector(`option[value="${this.id}"]`);
        targetCatOption.remove();
    }

    removeLabel(label)
    {
        // Removing given label from catLabels
        const targetIndex = this.catLabels.findIndex(catLabel => catLabel === label);
        this.catLabels.splice(targetIndex, 1);

        //this.removeLabels();
        //this.addLabels();
    }

    removeLabels()
    {
        const labInputs = document.querySelector("#labInputs");
        this.catLabels.forEach(label => {
            label.removeLabelOption();
        });
    }

    changeName(name)
    {
        // Changing class name
        this.name = name;

        // Getting and renaming target option
        const targetCatOption = eventCatDropdown.querySelector(`option[value="${this.id}"]`);
        targetCatOption.textContent = name;
    }
}

// Going through each labelDown and initalizing a Category class, adding to the category array
labelDowns.forEach(labelDown => {
    const newCat = new Category(labelDown);
    categories.push(newCat);
    newCat.addCatOption();
});

// Event listener to open category creater modal
addCatButton.addEventListener('click', openCatMaker);

// Event listener to close the category creator modal
closeNewCat.addEventListener('click', (e) => {
    catMakerModal.style.display = 'none';
});

function openCatEditor(e)
{
    // Stopping labels from showing
    e.stopPropagation();

    // Populating name with current category name
    const catName = e.target.closest('.labelDown').querySelector('.catName');
    catNameEdited.value = catName.textContent;

    // Populating stored variables
    prevCatName = catName;
    console.log(catName.textContent)
    prevCat = getCatByName(catName.textContent);

    // Changing display, focusing on the text box
    catEditorModal.style.display = 'block';
    catNameEdited.focus();
}

verticleDots.forEach(verticleDot => {
    verticleDot.addEventListener('click', openCatEditor);
});

saveCat.addEventListener('click', (e) => {
    // Stops miss input
    if(categoryName.value.trim() === '')
    {
        alert('Please provide a name for this category');
        return;
    }

    const catSetup = submitCatInput(categoryName.value);
    const newCat = new Category(catSetup); 
    categories.push(newCat);
    newCat.addCatOption();
    categoryName.value = '';
    catMakerModal.style.display = 'none';
});

catClosers.forEach(catClose => {
    catClose.addEventListener('click', (e) => {
       cancelCatMenu(e.target.parentElement);
    })
});

saveEditCat.addEventListener('click', () => {
    // Stopping accidental submit
    if(catNameEdited.value.trim() === '')
    {
        alert('Please provide a name for this category');
        return;
    }

    const newName = catNameEdited.value;

    // Updating label panel and category instance
    prevCatName.textContent = newName;
    prevCat.changeName(newName);

    catEditorModal.style.display = 'none';
});

closeEditCat.addEventListener('click', () => {
    catEditorModal.style.display = 'none';
});

deleteCat.addEventListener('click', () => {
    const catConfirmation = confirm(`Are you sure you want to delete \"${prevCatName.textContent}\"?`);
    if(catConfirmation)
    {
        deleteCatHelper();
    }
    else
    {
        return;
    }
    catEditorModal.style.display = 'none';
});

function deleteCatHelper()
{
    // Hiding labels if we're deleted the associated category
    if(eventCatDropdown.value == prevCat.id)
    {
        console.log(`got in`)
        labelInput.style.display = 'none';
    }

    // Removing category from categories array
    const targetIndex = categories.findIndex(category => category === prevCat);
    categories.splice(targetIndex, 1);

    // Updating options
    prevCat.removeLabels();
    prevCat.removeCatOption();

    // removing form label panel
    const toDelete = prevCatName.closest('.labelDown');
    toDelete.remove();

    // Clearing variables
    prevCat = '';
    prevCatName = '';
    console.log('deleted');

}

// Used for the adding of labels to the label panel
function getCatByName(name)
{
    return categories.find(category => category.name === name);
}

// Handles input deemed acceptable and creates the actual category
function submitCatInput(name)
{

    // Prevents an accidental enter or submit
    if(name.trim() === '')
    {
        return;
    } 

    // Overall container
    const labelDown = document.createElement('div');
    labelDown.classList.add('labelDown');

    // Label button creation
    const newButton = document.createElement('button');
    newButton.classList.add('labelBtn');

    const textSpan = document.createElement('span');
    textSpan.classList.add('catName');
    textSpan.textContent = name;

    // Cat option div creation
    const catOptions = document.createElement('div');
    catOptions.classList.add('catOptions');

    // Span that contains verticle dots
    const verticleDots = document.createElement('span');
    verticleDots.classList.add('verticleDots');

    // Actual verticle dots image creation
    const dotImage = document.createElement('img');
    dotImage.src = "../Images/verticleDots.png";
    dotImage.alt = "verticle dots";

    // Arrow up creation
    const arrowSpan = document.createElement('span');
    arrowSpan.classList.add('labelArrow');
    arrowSpan.textContent = '⌃';

    // Creating wrapper for labels
    const labelContent = document.createElement('div');
    labelContent.classList.add('labelContent');

    verticleDots.appendChild(dotImage);
    catOptions.appendChild(verticleDots);
    catOptions.appendChild(arrowSpan);

    newButton.append(textSpan);
    newButton.append(catOptions);

    labelDown.appendChild(newButton);
    labelDown.appendChild(labelContent);
    // labelPanel.appendChild(labelDown);
    labelPanel.insertBefore(labelDown, addCatButton);

    // Allows the dropdown to actually function
    newButton.addEventListener('click', showLabels);

    return labelDown;
}

// function handleCatMenu(e)
// {
//     // Stopping parent button from triggering
//     e.stopPropagation();

//     const verticleDot = e.target;
//     let labelBtnNear = verticleDot;

//     // Selecting proper catMenu by finding labelBtn
//     while(!labelBtnNear.classList.contains('labelDown'))
//     {
//         labelBtnNear = labelBtnNear.parentElement;
//     }
//     const catMenu = labelBtnNear.querySelector('.catMenu');

//     // Creating a wrapper function so that the out click button
//     // can both pass a parameter and be  deleted
//     const eventHandler = (e) => {
//         if(!catMenu.contains(e.target)) 
//         {
//             cancelCatMenu(catMenu);
//         }
//     }

//     // Adding to global object
//     eventHandlers[catMenu] = eventHandler;

//     // Timeout so this doesn't immediately run
//     setTimeout(() => {
//         document.addEventListener('click', eventHandler);
//     }, 10);

//     catMenu.style.display = 'flex';

//     // Deals with formatting issue
//     handleLabelContent(labelBtnNear);
// }

// // Function similar to showLabels - NOT NECESSARY ANYMORE
// function handleLabelContent(labelDownNew)
// {
//     const labelArrow = labelDownNew.querySelector('.labelArrow');
//     const labelContent = labelDownNew.querySelector('.labelContent');

//     // Sets proper display and arrow type
//     if (labelContent.style.display === 'block') 
//     {
//         labelContent.style.display = 'none';
//         labelArrow.textContent = '⌃';
//     } 
// }

// // Edit button selected
// function editCat(e)
// {
//     const catMenu = e.target.parentElement;
//     let labelBtnNear = catMenu; 
//     while(!labelBtnNear.classList.contains('labelDown'))
//     {
//         labelBtnNear = labelBtnNear.parentElement;
//     }
//     const labelBtn = labelBtnNear.querySelector('.labelBtn');
//     const catName = labelBtn.querySelector('.catName');

//     // Check to make sure no other edits or creations are currently happening
//     if(document.querySelector('.inputBoxCat'))
//     {
//         catMenu.style.display = 'none';
//         return;
//     }
//     if(document.querySelector('.inputBoxLab'))
//     {
//         catMenu.style.display = 'none';
//         return;
//     }

//     const inputBoxCat = document.createElement('input');
//     inputBoxCat.type = 'text';
//     inputBoxCat.classList.add('inputBoxCat');
//     inputBoxCat.placeholder = 'Category Name';
//     inputBoxCat.value = catName.textContent;

//     // This allows for the enter key to submit contents and the escape key
//     // to cancel the action
//     inputBoxCat.addEventListener('keydown', (e) => {
//         if(e.key === 'Enter')
//         {
//             submitCatEdit(labelBtn, catName);
//         }
//         else if(e.key === 'Escape')
//         {
//             cancelCatEdit(labelBtn);
//         }
//     })

//     // Creates category name character limit, set to 13 *CAN BE CHANGED*
//     inputBoxCat.addEventListener('input', (e) => {
//         if (e.target.value.length > 13) {
//             e.target.value = e.target.value.slice(0, 13);
//         }
//     });

//     // Submit button created to have a visual way to submit input
//     const submitButtonCat = document.createElement('button');
//     submitButtonCat.classList.add('submitButtonCat');
//     submitButtonCat.textContent = 'Submit';
//     submitButtonCat.addEventListener('click', () => {
//         submitCatEdit(labelBtn, catName)
//     });

//     labelBtn.append(inputBoxCat);
//     labelBtn.append(submitButtonCat);

//     labelBtn.parentNode.insertBefore(inputBoxCat, labelBtn);
//     labelBtn.parentNode.insertBefore(submitButtonCat, labelBtn);
//     catMenu.style.display = 'none';


//     labelBtn.style.display = 'none';

//     inputBoxCat.focus();


//     // Solution to not being able to pass variables to an event listener you want to delete
//     const eventHandler = (e) => {
//         if(!inputBoxCat.contains(e.target) && !submitButtonCat.contains(e.target)) 
//         {
//             cancelCatEdit(labelBtn);
//         }
//     }

//     eventHandlers[labelBtn] = eventHandler;

//     // Timeout stops issue where this listener would load too fast and
//     // stop the addCatButton from working at all
//     setTimeout(() => {
//         document.addEventListener('click', eventHandler);
//     }, 10);
// }

// function deleteCat(e)
// {
//     const catMenu = e.target.parentElement;
//     let labelBtnNear = catMenu; 
//     while(!labelBtnNear.classList.contains('labelDown'))
//     {
//         labelBtnNear = labelBtnNear.parentElement;
//     }
//     const labelBtn = labelBtnNear.querySelector('.labelBtn');
//     const catName = labelBtn.querySelector('.catName');

//     if(confirm(`Are you sure you want to delete the \"${catName.textContent}\" category? This action can't be undone.`))
//     {
//         labelBtn.remove();
//     }

//     cancelCatMenu(catMenu);
// }

// function cancelCatMenu(catMenu)
// {
//     catMenu.style.display = 'none';

//     if(eventHandlers[catMenu])
//     {
//         document.removeEventListener('click', eventHandlers[catMenu]);
//         delete eventHandlers[catMenu];
//     }
// }

// function submitCatEdit(labelBtn, catName)
// {
//     const inputBoxCat = document.querySelector('.inputBoxCat');
//     catName.textContent = inputBoxCat.value;

//     // Prevents an accidental enter or submit
//     if(catName.textContent.trim() === '')
//     {
//         return;
//     } 

//     const submitButtonCat = document.querySelector('.submitButtonCat');

//     // Removing unnecessary elements and re-displaying label button
    
//     inputBoxCat.remove();
//     submitButtonCat.remove();

//     if(eventHandlers[labelBtn])
//     {
//         document.removeEventListener('click', eventHandlers[labelBtn]);
//         delete eventHandlers[labelBtn];
//     }

//     labelBtn.style.display = 'flex';
// }

// function cancelCatEdit(labelBtn)
// {
//     const inputBoxCat = document.querySelector('.inputBoxCat');
//     const submitButtonCat = document.querySelector('.submitButtonCat');

//     inputBoxCat.remove();
//     submitButtonCat.remove();

//     if(eventHandlers[labelBtn])
//     {
//         document.removeEventListener('click', eventHandlers[labelBtn]);
//         delete eventHandlers[labelBtn];
//     }

//     labelBtn.style.display = 'flex';
// }