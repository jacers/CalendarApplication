// General panel elements
const labelPanel = document.querySelector(".labelPanel");

// Buttons
const allLabelBtn = document.querySelectorAll('.labelBtn');
const labelHideShow = document.querySelector(".labelHideShow");
const allLabButtons = document.querySelectorAll('.addLabBtn');

// Event listener for the dropdown of labels
allLabelBtn.forEach(button => {
    button.addEventListener('click', showLabels);
 });

// Show hide label functionality
labelHideShow.addEventListener('click', (e) => {
    const button = e.target;
    const currentDisplay = getComputedStyle(labelPanel).display;

    if (currentDisplay === 'block') {
        labelPanel.style.display = 'none';
        button.src = '../Images/whiteLeftPanelOpen.png'; // Show image when panel is hidden
    } else {
        labelPanel.style.display = 'block';
        button.src = '../Images/whiteLeftPanelClose.png'; // Hide image when panel is shown
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