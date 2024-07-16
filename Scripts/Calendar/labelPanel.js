// General panel elements
const labelPanel = document.querySelector(".labelPanel");

// Buttons
const allLabelBtn = document.querySelectorAll('.labelBtn');
const labelHideShow = document.querySelector(".labelHideShow");
const addCatButton = document.querySelector("#addCat");
const addLabButton = document.querySelector(".addLabBtn")

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
//addLabButton.addEventListener('click', handleLabInput);

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
    const inputBox = document.createElement('input');
    inputBox.type = 'text';
    inputBox.classList.add('inputBox');
    inputBox.placeholder = 'Category Name';

    // This allows for the enter key to submit contents and the escape key
    // to cancel the action
    inputBox.addEventListener('keydown', (e) => {
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
    inputBox.addEventListener('input', (e) => {
        if (e.target.value.length > 13) {
            e.target.value = e.target.value.slice(0, 13);
        }
    });

    // Submit button created to have a visual way to submit input
    const submitButton = document.createElement('button');
    submitButton.classList.add('submitButton');
    submitButton.textContent = 'Submit';
    submitButton.addEventListener('click', submitCatInput);

    labelPanel.appendChild(inputBox);
    labelPanel.appendChild(submitButton);
    inputBox.focus();

    // Timeout stops issue where this listener would load too fast and
    // stop the addCatButton from working at all
    setTimeout(() => {
        document.addEventListener('click', outCatClick);
    }, 10);
}

// Handles input deemed acceptable and creates the actual category
function submitCatInput()
{
    const inputBox = document.querySelector('.inputBox');
    const labelTitle = inputBox.value;

    // Prevents an accidental enter or submit
    if(labelTitle.trim() === '')
    {
        return;
    } 

    const submitButton = document.querySelector('.submitButton');

    // Removing things necessary for the input process
    labelPanel.removeChild(inputBox);
    labelPanel.removeChild(submitButton);
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

    const addLabBtn = document.createElement('button');
    addLabBtn.classList.add('labelBtn');
    const labText = document.createElement('span');
    labText.textContent = 'Add Label';
    const labPlusSign = document.createElement('span');
    labPlusSign.textContent = '+';
    addLabBtn.classList.add('addLabBtn');
    labText.classList.add('labText');
    labPlusSign.classList.add('labPlusSign');

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
    const inputBox = document.querySelector('.inputBox');
    const submitButton = document.querySelector('.submitButton');

    labelPanel.removeChild(inputBox);
    labelPanel.removeChild(submitButton);

    document.removeEventListener('click', outCatClick);

    addCatButton.style.display = 'flex';
}

// Helper function for when user clicks outside of the input box and/or submit button
function outCatClick(e)
{
    const inputBox = document.querySelector('.inputBox');
    const submitButton = document.querySelector('.submitButton');

    if(inputBox && submitButton && !submitButton.contains(e.target) && !inputBox.contains(e.target))
    {
        cancelCatInput();
    }
}

// Function that handles user functionality for creating a label
// function handleLabInput()
// {
//     addLabButton.style.display = 'none';
    
//     // Creating a text input box for the category name
//     const inputBox = document.createElement('input');
//     inputBox.type = 'text';
//     inputBox.classList.add('inputBox');
//     inputBox.placeholder = 'Category Name';

//     // This allows for the enter key to submit contents and the escape key
//     // to cancel the action
//     inputBox.addEventListener('keydown', (e) => {
//         if(e.key === 'Enter')
//         {
//             submitCatInput();
//         }
//         else if(e.key === 'Escape')
//         {
//             cancelCatInput();
//         }
//     })

//     // Creates category name character limit, set to 13 *CAN BE CHANGED*
//     inputBox.addEventListener('input', (e) => {
//         if (e.target.value.length > 13) {
//             e.target.value = e.target.value.slice(0, 13);
//         }
//     });

//     // Submit button created to have a visual way to submit input
//     const submitButton = document.createElement('button');
//     submitButton.classList.add('submitButton');
//     submitButton.textContent = 'Submit';
//     submitButton.addEventListener('click', submitCatInput);

//     labelPanel.appendChild(inputBox);
//     labelPanel.appendChild(submitButton);
//     inputBox.focus();

//     // Timeout stops issue where this listener would load too fast and
//     // stop the addCatButton from working at all
//     setTimeout(() => {
//         document.addEventListener('click', outCatClick);
//     }, 10);
// }

