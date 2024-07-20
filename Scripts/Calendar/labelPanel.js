// General panel elements
const labelPanel = document.querySelector(".labelPanel");

// Buttons
const allLabelBtn = document.querySelectorAll('.labelBtn');
const labelHideShow = document.querySelector(".labelHideShow");
const addCatButton = document.querySelector("#addCat");
const allLabButtons = document.querySelectorAll('.addLabBtn');

// Show hide label functionality

labelHideShow.addEventListener('click', (e) => {
    const button = e.target;
    const currentDisplay = getComputedStyle(labelPanel).display;

    if (currentDisplay === 'block') 
    {
        labelPanel.style.display = 'none';
        button.textContent = 'Show';
    } 
    else 
    {
        labelPanel.style.display = 'block';
        button.textContent = 'Hide'
    }
});

// Event listener for the dropdown of labels
allLabelBtn.forEach(button => {
    button.addEventListener('click', showLabels)
 });

// Event listener to add a category on label panel
addCatButton.addEventListener('click', handleCatInput);

// Event listener to add a label on label panel
allLabButtons.forEach(button => {
    button.addEventListener('click', handleLabInput);
});

 // Functionality for the dropdown of categories
function showLabels(e)
{
    const button = e.currentTarget;
    const labelContent = button.nextElementSibling;
    if(labelContent == null)
    {
        return;
    }

    const labelArrow = button.querySelector('.labelArrow');

        if (labelContent.style.display === 'block') 
        {
            labelContent.style.display = 'none';
            labelArrow.textContent = '⌃';
        } 
        else 
        {
            labelContent.style.display = 'block';
            labelArrow.textContent = '⌵';
        }
}

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

    const arrowSpan = document.createElement('span');
    arrowSpan.classList.add('labelArrow');
    arrowSpan.textContent = '⌃';

    const labelContent = document.createElement('div');
    labelContent.classList.add('labelContent');

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

    newButton.append(textSpan);
    newButton.append(arrowSpan);

    labelDown.appendChild(newButton);
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