const allLabels = document.querySelectorAll('.labelContent label');
const labelDots = document.querySelectorAll('label img');

allLabels.forEach(label => {
    generateLabelMenu(label);
})

// Event listener to add a label on label panel
allLabButtons.forEach(button => {
    button.addEventListener('click', handleLabInput);
});

labelDots.forEach(labelDot => {
    // Send this to main editor later
    labelDot.addEventListener('click', handleLabMenu);
})

// Function that handles user functionality for creating a label
function handleLabInput(e)
{
    // Getting proper container for specific button, hidding button
    const addLabelBtn = e.target.closest('.addLabBtn');
    const labelContent = addLabelBtn.parentElement;
    addLabelBtn.style.display = 'none';

    // Creating a text input box for the label name
    const inputBoxLab = document.createElement('input');
    inputBoxLab.type = 'text';
    inputBoxLab.classList.add('inputBoxLab');
    inputBoxLab.placeholder = 'Label Name';

    // This allows for the enter key to submit contents and the escape key
    // to cancel the action
    inputBoxLab.addEventListener('keydown', (e) => {
        if(e.key === 'Enter')
        {
            submitLabInput(addLabelBtn);
        }
        else if(e.key === 'Escape')
        {
            cancelLabInput(addLabelBtn);
        }
    })

    // Creates label name character limit, set to 13 *CAN BE CHANGED*
    inputBoxLab.addEventListener('input', (e) => {
        if (e.target.value.length > 13) {
            e.target.value = e.target.value.slice(0, 13);
        }
    });

    // Submit button created to have a graphical way to submit input
    const submitButtonLab = document.createElement('button');
    submitButtonLab.classList.add('submitButtonLab');
    submitButtonLab.textContent = 'Submit';
    submitButtonLab.addEventListener('click', () => {
        submitLabInput(addLabelBtn);
    });

    labelContent.appendChild(inputBoxLab);
    labelContent.appendChild(submitButtonLab);
    inputBoxLab.focus();

    // Timeout stops issue where this listener would load too fast and
    // stop the addLabButton from working at all
    setTimeout(() => {
        document.addEventListener('click', outLabClick);
    }, 10);
}

// Handles input deemed acceptable and creates the actual label
function submitLabInput(addLabelBtn)
{
    // Grabbing necessary elements
    const inputBoxLab = document.querySelector('.inputBoxLab');
    const submitButtonLab = document.querySelector('.submitButtonLab');
    const labelTitle = inputBoxLab.value;
    const labelContent = addLabelBtn.parentElement;

    // Prevents an accidental enter or submit
    if(labelTitle.trim() === '')
    {
        return;
    } 

    // Removing things necessary for the input process
    labelContent.removeChild(inputBoxLab);
    labelContent.removeChild(submitButtonLab);
    document.removeEventListener('click', outLabClick);

    // Creation of all elements needed for label to run correctly
    const labelElement = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;

    labelElement.appendChild(checkbox);
    labelElement.appendChild(document.createTextNode(labelTitle));
    labelContent.appendChild(labelElement);

    // This limits number of labels to 5
    if(labelContent.querySelectorAll('label').length < 5) 
    {
        labelContent.appendChild(addLabelBtn);
        addLabelBtn.style.display = 'flex';
    }
}

// Handles input deemed unnaceptable
function cancelLabInput(addLabelBtn)
{
    const labelContent = addLabelBtn.parentElement;
    const inputBoxLab = document.querySelector('.inputBoxLab');
    const submitButtonLab = document.querySelector('.submitButtonLab');

    labelContent.removeChild(inputBoxLab);
    labelContent.removeChild(submitButtonLab);

    document.removeEventListener('click', outLabClick);

    addLabelBtn.style.display = 'flex';
}

// Helper function for when user clicks outside of the input box and/or submit button
function outLabClick(e)
{
    const inputBoxLab = document.querySelector('.inputBoxLab');
    const submitButtonLab = document.querySelector('.submitButtonLab');

    if(inputBoxLab && submitButtonLab && 
        !submitButtonLab.contains(e.target) && 
        !inputBoxLab.contains(e.target))
    {
        cancelLabInput(inputBoxLab.previousElementSibling);
    }
}


// KEEPING THESE FUNCTIONS FOR FUTURE USE
function handleLabMenu(e)
{
    // Stopping parent button from triggering
    e.stopPropagation();
    e.preventDefault();
}

function editLabel(e)
{
    console.log('edit button hit');
}

function deleteLabel(e)
{
    console.log('delete button hit');
}

function cancelLabMenu(labelMenu)
{
    console.log('closed');
    labelMenu.style.display = 'none';

    if(eventHandlers[labelMenu])
    {
        document.removeEventListener('click', eventHandlers[labelMenu]);
        delete eventHandlers[labelMenu];
    }
}

// Keeping this for now will probably delete later
function generateLabelMenu(label)
{
    const labelMenu = document.createElement('div');
    labelMenu.classList.add('labelMenu');

    const labClose = document.createElement('span');
    labClose.classList.add('labClose');
    labClose.textContent = 'x';

    const editLabBtn = document.createElement('button');
    editLabBtn.classList.add('editLabBtn');
    editLabBtn.textContent = 'Edit'

    const deleteLabBtn = document.createElement('button');
    deleteLabBtn.classList.add('deleteLabBtn');
    deleteLabBtn.textContent = 'Delete'

    const colorContainer = document.createElement('div');
    colorContainer.classList.add('colorContainer');

    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';

    const colorText = document.createElement('span');
    colorText.classList.add('colorText');
    colorText.textContent = 'Color';
    
    colorContainer.appendChild(colorText);
    colorContainer.appendChild(colorPicker);

    labelMenu.appendChild(labClose);
    labelMenu.appendChild(editLabBtn);
    labelMenu.appendChild(deleteLabBtn);
    labelMenu.appendChild(colorContainer);
    label.appendChild(labelMenu);

    editLabBtn.addEventListener('click', editLabel);
    deleteLabBtn.addEventListener('click', deleteLabel);

    labelMenu.addEventListener('click', function(e) {
        e.preventDefault();
    });

    labClose.addEventListener('click', function(e) {
        cancelLabMenu(labelMenu);
    });
}

