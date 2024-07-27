const addCatButton = document.querySelector("#addCat");
const catMenus = document.querySelectorAll('.catMenu');
const verticleDots = document.querySelectorAll('.verticleDots');
const catClosers = document.querySelectorAll('.catClose');

const eventHandlers = {};

// Event listener to add a category on label panel
addCatButton.addEventListener('click', handleCatInput);

// Adding proper listeners for each button for each category menu
catMenus.forEach(catMenu => {
    const editBtn = catMenu.querySelector('.catEdit');
    const deleteBtn = catMenu.querySelector('.catDelete');

    editBtn.addEventListener('click', editCat);
    deleteBtn.addEventListener('click', deleteCat);
});

verticleDots.forEach(verticleDot => {
    verticleDot.addEventListener('click', handleCatMenu);
})

catClosers.forEach(catClose => {
    catClose.addEventListener('click', (e) => {
       cancelCatMenu(e.target.parentElement);
    })
})



// Function that handles user functionality for creating a category
function handleCatInput()
{
    addCatButton.style.display = 'none';
    
    // Creating a text input box for the category name
    const inputBoxCat = document.createElement('input');
    inputBoxCat.type = 'text';
    inputBoxCat.classList.add('inputBoxCat');
    inputBoxCat.placeholder = 'Category Name';

    // This allows for the enter key to submit contents and the escape key
    // to cancel the action
    inputBoxCat.addEventListener('keydown', (e) => {
        if(e.key === 'Enter')
        {
            submitCatInput();
        }
        else if(e.key === 'Escape')
        {
            cancelCatInput();
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
    submitButtonCat.addEventListener('click', submitCatInput);

    labelPanel.appendChild(inputBoxCat);
    labelPanel.appendChild(submitButtonCat);
    inputBoxCat.focus();

    // Timeout stops issue where this listener would load too fast and
    // stop the addCatButton from working at all
    // I dont think this needs a timeout actually
    setTimeout(() => {
        document.addEventListener('click', outCatClick);
    }, 10);
}

// Handles input deemed acceptable and creates the actual category
function submitCatInput()
{
    const inputBoxCat = document.querySelector('.inputBoxCat');
    const labelTitle = inputBoxCat.value;

    // Prevents an accidental enter or submit
    if(labelTitle.trim() === '')
    {
        return;
    } 

    const submitButtonCat = document.querySelector('.submitButtonCat');

    // Removing things necessary for the input process
    labelPanel.removeChild(inputBoxCat);
    labelPanel.removeChild(submitButtonCat);
    document.removeEventListener('click', outCatClick);

    // Creation of all elements needed for category to run correctly
    const labelDown = document.createElement('div');
    labelDown.classList.add('labelDown');

    const newButton = document.createElement('button');
    newButton.classList.add('labelBtn');

    const textSpan = document.createElement('span');
    textSpan.classList.add('labelName');
    textSpan.textContent = labelTitle;

    // div cat options
    const catOptions = document.createElement('div');
    catOptions.classList.add('catOptions');

    // vert dots span
    const verticleDots = document.createElement('span');
    verticleDots.classList.add('verticleDots');

    // img
    const dotImage = document.createElement('img');
    dotImage.src = "../Images/verticleDots.png";
    dotImage.alt = "verticle dots";

    // this insine cat options
    const arrowSpan = document.createElement('span');
    arrowSpan.classList.add('labelArrow');
    arrowSpan.textContent = '⌃';

    const labelContent = document.createElement('div');
    labelContent.classList.add('labelContent');

    // cat menu div
    const catMenu = document.createElement('div');
    catMenu.classList.add('catMenu');
    
    // cat close span with x
    const catClose = document.createElement('span');
    catClose.classList.add('catClose');
    catClose.textContent = 'x';

    // cat edit button
    const catEdit = document.createElement('button');
    catEdit.classList.add('catEdit');
    catEdit.textContent = 'Edit';

    // cat delete button
    const catDelete = document.createElement('button');
    catDelete.classList.add('catDelete');
    catDelete.textContent = 'Delete';

    // Creating add label button, will always exist in a category by default
    const addLabBtn = document.createElement('button');
    addLabBtn.classList.add('labelBtn');
    const labText = document.createElement('span');
    labText.textContent = 'Add Label';
    const labPlusSign = document.createElement('span');
    labPlusSign.textContent = '+';
    addLabBtn.classList.add('addLabBtn');
    labText.classList.add('labText');
    labPlusSign.classList.add('labPlusSign');
    addLabBtn.addEventListener('click', handleLabInput);

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
    labelPanel.appendChild(labelDown);

    // This limits number of categories to 11
    if(document.querySelectorAll('.labelName').length < 11) 
    {
        labelPanel.appendChild(addCatButton);
        addCatButton.style.display = 'flex';
    }

    // Allows the dropdown to actually function
    newButton.addEventListener('click', showLabels);
    verticleDots.addEventListener('click', handleCatMenu);
    catClose.addEventListener('click', (e) => {
        cancelCatMenu(e.target.parentElement);
     })
    catEdit.addEventListener('click', editCat);
    catDelete.addEventListener('click', deleteCat);

}

// Handles input deemed unnaceptable
function cancelCatInput()
{
    const inputBoxCat = document.querySelector('.inputBoxCat');
    const submitButtonCat = document.querySelector('.submitButtonCat');

    labelPanel.removeChild(inputBoxCat);
    labelPanel.removeChild(submitButtonCat);

    document.removeEventListener('click', outCatClick);

    addCatButton.style.display = 'flex';
}

// Helper function for when user clicks outside of the input box and/or submit button
function outCatClick(e)
{
    const inputBoxCat = document.querySelector('.inputBoxCat');
    const submitButtonCat = document.querySelector('.submitButtonCat');

    if(inputBoxCat && submitButtonCat && 
        !submitButtonCat.contains(e.target) && 
        !inputBoxCat.contains(e.target))
    {
        cancelCatInput();
    }
}

function handleCatMenu(e)
{
    e.stopPropagation();
    const verticleDot = e.target;
    let labelBtnNear = verticleDot;

    // Selecting proper catMenu
    while(!labelBtnNear.classList.contains('labelDown'))
    {
        labelBtnNear = labelBtnNear.parentElement;
    }
    const catMenu = labelBtnNear.querySelector('.catMenu');
    const catClose = catMenu.querySelector('.catClose');

    const eventHandler = (e) => {
        if(!catMenu.contains(e.target)) 
        {
            cancelCatMenu(catMenu);
        }
    }

    eventHandlers[catMenu] = eventHandler;

    setTimeout(() => {
        document.addEventListener('click', eventHandler);
    }, 10);

    // Add eventHandler to eventHandlers and deal with it in cancelCat

    catMenu.style.display = 'flex';
    handleLabelContent(labelBtnNear);
}

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

function editCat(e)
{
    const catMenu = e.target.parentElement;
    let labelBtnNear = catMenu; 
    while(!labelBtnNear.classList.contains('labelDown'))
    {
        labelBtnNear = labelBtnNear.parentElement;
    }
    const labelBtn = labelBtnNear.querySelector('.labelBtn');
    const labelName = labelBtn.querySelector('.labelName');

    // Check to make sure no other edits or creations are currently happening
    if(document.querySelector('.inputBoxCat'))
    {
        cancelCatEdit();
    }
    if(document.querySelector('.inputBoxLab'))
    {
        // Fill in when finished
        console.log('lab input cancelled');
    }

    const inputBoxCat = document.createElement('input');
    inputBoxCat.type = 'text';
    inputBoxCat.classList.add('inputBoxCat');
    inputBoxCat.placeholder = 'Category Name';
    inputBoxCat.value = labelName.textContent;

    // This allows for the enter key to submit contents and the escape key
    // to cancel the action
    inputBoxCat.addEventListener('keydown', (e) => {
        if(e.key === 'Enter')
        {
            submitCatEdit(labelBtn, labelName);
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
        submitCatEdit(labelBtn, labelName)
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
            console.log('clicked out');
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
    const labelName = labelBtn.querySelector('.labelName');

    if(confirm(`Are you sure you want to delete the \"${labelName.textContent}\" category? This action can't be undone.`))
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

function submitCatEdit(labelBtn, labelName)
{
    const inputBoxCat = document.querySelector('.inputBoxCat');
    labelName.textContent = inputBoxCat.value;

    // Prevents an accidental enter or submit
    if(labelName.textContent.trim() === '')
    {
        return;
    } 

    const submitButtonCat = document.querySelector('.submitButtonCat');

    // Removing unnecessary elements and re-displaying label button
    
    inputBoxCat.remove();
    submitButtonCat.remove();
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