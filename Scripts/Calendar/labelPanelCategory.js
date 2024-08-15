// THIS CODE WILL BE HEAVILY DE-BLOATED SOON

// General DOM Elements
const addCatButton = document.querySelector("#addCat");
const catMenus = document.querySelectorAll('.catMenu');
const verticleDots = document.querySelectorAll('.verticleDots');
const catClosers = document.querySelectorAll('.catClose');
const labelDowns = document.querySelectorAll('.labelDown');

// Object that handles problem event handlers
const eventHandlers = {};

class Category
{
    constructor(labelDown)
    {
        this.name = labelDown.querySelector('.catName').textContent;
        this.catLabels = this.getAllLabels(labelDown.querySelectorAll('.labelContent label'));
    }

    getAllLabels(labelNodes)
    {
        let returnLabels = [];
        labelNodes.forEach(label => {
            let newLabel = new Label(label.textContent, '', '#ffffff');
            labels.push(newLabel);
            returnLabels.push(newLabel);
            generateLabelMenu(label);
        });
        return returnLabels;
    }

    // Gonna need an option to add a label to the catLabels array

    // Adds this category as an option, using index as value for ease of access
    addCatOption()
    {
        const eventCatDropdown = document.querySelector('#eventCatDropdown');
        // Might be a problem with the quotes inside quotes idk yet
        const newCatOption = eventCatDropdown.querySelector('option[value="newCategory"]');
        const newOption = document.createElement('option');

        newOption.value = categories.length - 1;
        newOption.innerHTML = this.name;

        newCatOption.parentNode.insertBefore(newOption, newCatOption);
    }

    addLabel(label)
    {
        this.catLabels.push(label);
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

    removeLabels()
    {
        const labInputs = document.querySelector("#labInputs");

        this.catLabels.forEach(label => {
            label.removeLabelOption();
        });
    }
}

// Event listener to open category creater modal
addCatButton.addEventListener('click', openCatMaker);

// Event listener to close the category creator modal
closeNewCat.addEventListener('click', (e) => {
    catMakerModal.style.display = 'none';
});

// saveCat.addEventListener('click')

// Adding proper listeners for each button for each category menu
catMenus.forEach(catMenu => {
    const editBtn = catMenu.querySelector('.catEdit');
    const deleteBtn = catMenu.querySelector('.catDelete');

    editBtn.addEventListener('click', editCat);
    deleteBtn.addEventListener('click', deleteCat);
});

verticleDots.forEach(verticleDot => {
    verticleDot.addEventListener('click', handleCatMenu);
});

saveCat.addEventListener('click', (e) => {
    // Stops miss input
    if(categoryName.value.trim === '')
    {
        alert('Please provide a name for this category');
        return;
    }

    const catSetup = submitCatInput(categoryName.value);
    const newCat = new Category(catSetup); // This may cause a redeclaration problem
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

// Going through each labelDown and initalizing a Category class, adding to the category array
labelDowns.forEach(labelDown => {
    const newCat = new Category(labelDown);
    categories.push(newCat);
    newCat.addCatOption();
});

// Handles input deemed acceptable and creates the actual category
// I know this function is way too long I'll fix it later
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

    // Category menu div creation
    const catMenu = document.createElement('div');
    catMenu.classList.add('catMenu');
    
    // Category close span with x
    const catClose = document.createElement('span');
    catClose.classList.add('catClose');
    catClose.textContent = 'x';

    // Category edit button
    const catEdit = document.createElement('button');
    catEdit.classList.add('catEdit');
    catEdit.textContent = 'Edit';

    // Category delete button
    const catDelete = document.createElement('button');
    catDelete.classList.add('catDelete');
    catDelete.textContent = 'Delete';

    // Creating add label button, will always exist in a category by default
    const addLabBtn = document.createElement('button');
    addLabBtn.classList.add('labelBtn');

    // Text for actual button
    const labText = document.createElement('span');
    labText.textContent = 'Add Label';

    // Plus sign text
    const labPlusSign = document.createElement('span');
    labPlusSign.textContent = '+';
    addLabBtn.classList.add('addLabBtn');
    labText.classList.add('labText');
    labPlusSign.classList.add('labPlusSign');

    // Creation of HTML hierarchy
    addLabBtn.append(labText);
    addLabBtn.append(labPlusSign);
    labelContent.appendChild(addLabBtn);

    verticleDots.appendChild(dotImage);
    catOptions.appendChild(verticleDots);
    catOptions.appendChild(arrowSpan);

    newButton.append(textSpan);
    newButton.append(catOptions);

    catMenu.appendChild(catClose);
    catMenu.appendChild(catEdit);
    catMenu.appendChild(catDelete);

    labelDown.appendChild(newButton);
    labelDown.appendChild(catMenu);
    labelDown.appendChild(labelContent);
    // labelPanel.appendChild(labelDown);
    labelPanel.insertBefore(labelDown, addCatButton);

    // Allows the dropdown to actually function
    newButton.addEventListener('click', showLabels);

    // catMenu related event listeners
    verticleDots.addEventListener('click', handleCatMenu);
    catClose.addEventListener('click', (e) => {
        cancelCatMenu(e.target.parentElement);
     })
    catEdit.addEventListener('click', editCat);
    catDelete.addEventListener('click', deleteCat);
    addLabBtn.addEventListener('click', handleLabInput);

    return labelDown;
}

// Handles input deemed unnaceptable
// function cancelCatInput()
// {
//     // Getting and removing input box and submit button
//     const inputBoxCat = document.querySelector('.inputBoxCat');
//     const submitButtonCat = document.querySelector('.submitButtonCat');

//     labelPanel.removeChild(inputBoxCat);
//     labelPanel.removeChild(submitButtonCat);

//     document.removeEventListener('click', outCatClick);

//     addCatButton.style.display = 'flex';
// }

// Helper function for when user clicks outside of the input box and/or submit button
// function outCatClick(e)
// {
//     const inputBoxCat = document.querySelector('.inputBoxCat');
//     const submitButtonCat = document.querySelector('.submitButtonCat');

//     // Cancelling input assuming user didn't click the box or submit button
//     // Also checking to make sure both exist
//     if(inputBoxCat && submitButtonCat && 
//         !submitButtonCat.contains(e.target) && 
//         !inputBoxCat.contains(e.target))
//     {
//         cancelCatInput();
//     }
// }

function handleCatMenu(e)
{
    // Stopping parent button from triggering
    e.stopPropagation();

    const verticleDot = e.target;
    let labelBtnNear = verticleDot;

    // Selecting proper catMenu by finding labelBtn
    while(!labelBtnNear.classList.contains('labelDown'))
    {
        labelBtnNear = labelBtnNear.parentElement;
    }
    const catMenu = labelBtnNear.querySelector('.catMenu');

    // Creating a wrapper function so that the out click button
    // can both pass a parameter and be  deleted
    const eventHandler = (e) => {
        if(!catMenu.contains(e.target)) 
        {
            cancelCatMenu(catMenu);
        }
    }

    // Adding to global object
    eventHandlers[catMenu] = eventHandler;

    // Timeout so this doesn't immediately run
    setTimeout(() => {
        document.addEventListener('click', eventHandler);
    }, 10);

    catMenu.style.display = 'flex';

    // Deals with formatting issue
    handleLabelContent(labelBtnNear);
}

// Function similar to showLabels
function handleLabelContent(labelDownNew)
{
    const labelArrow = labelDownNew.querySelector('.labelArrow');
    const labelContent = labelDownNew.querySelector('.labelContent');

    // Sets proper display and arrow type
    if (labelContent.style.display === 'block') 
    {
        labelContent.style.display = 'none';
        labelArrow.textContent = '⌃';
    } 
}

// Edit button selected
function editCat(e)
{
    const catMenu = e.target.parentElement;
    let labelBtnNear = catMenu; 
    while(!labelBtnNear.classList.contains('labelDown'))
    {
        labelBtnNear = labelBtnNear.parentElement;
    }
    const labelBtn = labelBtnNear.querySelector('.labelBtn');
    const catName = labelBtn.querySelector('.catName');

    // Check to make sure no other edits or creations are currently happening
    if(document.querySelector('.inputBoxCat'))
    {
        catMenu.style.display = 'none';
        return;
    }
    if(document.querySelector('.inputBoxLab'))
    {
        catMenu.style.display = 'none';
        return;
    }

    const inputBoxCat = document.createElement('input');
    inputBoxCat.type = 'text';
    inputBoxCat.classList.add('inputBoxCat');
    inputBoxCat.placeholder = 'Category Name';
    inputBoxCat.value = catName.textContent;

    // This allows for the enter key to submit contents and the escape key
    // to cancel the action
    inputBoxCat.addEventListener('keydown', (e) => {
        if(e.key === 'Enter')
        {
            submitCatEdit(labelBtn, catName);
        }
        else if(e.key === 'Escape')
        {
            cancelCatEdit(labelBtn);
        }
    })

    // Creates category name character limit, set to 13 *CAN BE CHANGED*
    inputBoxCat.addEventListener('input', (e) => {
        if (e.target.value.length > 13) {
            e.target.value = e.target.value.slice(0, 13);
        }
    });

    // Submit button created to have a visual way to submit input
    const submitButtonCat = document.createElement('button');
    submitButtonCat.classList.add('submitButtonCat');
    submitButtonCat.textContent = 'Submit';
    submitButtonCat.addEventListener('click', () => {
        submitCatEdit(labelBtn, catName)
    });

    labelBtn.append(inputBoxCat);
    labelBtn.append(submitButtonCat);

    labelBtn.parentNode.insertBefore(inputBoxCat, labelBtn);
    labelBtn.parentNode.insertBefore(submitButtonCat, labelBtn);
    catMenu.style.display = 'none';


    labelBtn.style.display = 'none';

    inputBoxCat.focus();


    // Solution to not being able to pass variables to an event listener you want to delete
    const eventHandler = (e) => {
        if(!inputBoxCat.contains(e.target) && !submitButtonCat.contains(e.target)) 
        {
            cancelCatEdit(labelBtn);
        }
    }

    eventHandlers[labelBtn] = eventHandler;

    // Timeout stops issue where this listener would load too fast and
    // stop the addCatButton from working at all
    setTimeout(() => {
        document.addEventListener('click', eventHandler);
    }, 10);
}

function deleteCat(e)
{
    const catMenu = e.target.parentElement;
    let labelBtnNear = catMenu; 
    while(!labelBtnNear.classList.contains('labelDown'))
    {
        labelBtnNear = labelBtnNear.parentElement;
    }
    const labelBtn = labelBtnNear.querySelector('.labelBtn');
    const catName = labelBtn.querySelector('.catName');

    if(confirm(`Are you sure you want to delete the \"${catName.textContent}\" category? This action can't be undone.`))
    {
        labelBtn.remove();
    }

    cancelCatMenu(catMenu);
}

function cancelCatMenu(catMenu)
{
    catMenu.style.display = 'none';

    if(eventHandlers[catMenu])
    {
        document.removeEventListener('click', eventHandlers[catMenu]);
        delete eventHandlers[catMenu];
    }
}

function submitCatEdit(labelBtn, catName)
{
    const inputBoxCat = document.querySelector('.inputBoxCat');
    catName.textContent = inputBoxCat.value;

    // Prevents an accidental enter or submit
    if(catName.textContent.trim() === '')
    {
        return;
    } 

    const submitButtonCat = document.querySelector('.submitButtonCat');

    // Removing unnecessary elements and re-displaying label button
    
    inputBoxCat.remove();
    submitButtonCat.remove();

    if(eventHandlers[labelBtn])
    {
        document.removeEventListener('click', eventHandlers[labelBtn]);
        delete eventHandlers[labelBtn];
    }

    labelBtn.style.display = 'flex';
}

function cancelCatEdit(labelBtn)
{
    const inputBoxCat = document.querySelector('.inputBoxCat');
    const submitButtonCat = document.querySelector('.submitButtonCat');

    inputBoxCat.remove();
    submitButtonCat.remove();

    if(eventHandlers[labelBtn])
    {
        document.removeEventListener('click', eventHandlers[labelBtn]);
        delete eventHandlers[labelBtn];
    }

    labelBtn.style.display = 'flex';
}