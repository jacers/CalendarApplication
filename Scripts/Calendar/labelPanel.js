// General panel elements
const labelPanel = document.querySelector(".labelPanel");

// Buttons
const allLabelBtn = document.querySelectorAll('.labelBtn');
const labelHideShow = document.querySelector(".labelHideShow");
const addCatButton = document.querySelector("#addCat");
const allLabButtons = document.querySelectorAll('.addLabBtn');
const catMenus = document.querySelectorAll('.catMenu');

// Event listener for the dropdown of labels
allLabelBtn.forEach(button => {
    button.addEventListener('click', showLabels);
 });

// Do this to verticle dots dumbass
// catMenus.forEach(catMenu => {
//     const editBtn = catMenu.querySelector('.catEdit');
//     const deleteBtn = catMenu.querySelector('.catDelete');

//     catMenu.addEventListener('click', () => {

//     });
//     editBtn.addEventListener('click', handleCatMenuInput);
//     deleteBtn.addEventListener('click', deleteCat);
// });

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

 // Functionality for the dropdown of categories
function showLabels(e)
{
    const button = e.currentTarget;
    const labelDown = button.closest('.labelDown');
    const labelArrow = button.querySelector('.labelArrow');

    // Will come up with something better later, works for now
    if(labelDown === null || labelArrow === null)
    {
        return;
    }

    const labelContent = labelDown.querySelector('.labelContent');

    // Sets proper display and arrow type
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