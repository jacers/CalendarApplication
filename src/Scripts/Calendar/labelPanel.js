

// General panel elements
export const labelPanel = document.querySelector(".labelPanel");

// Buttons
const allLabelBtn = document.querySelectorAll('.labelBtn');
const labelHideShow = document.querySelector(".labelHideShow");
 // Functionality for the dropdown of categories
export function showLabels(e) {
    const button = e.currentTarget;
    const labelDown = button.closest('.labelDown');
    const labelArrow = button.querySelector('.labelArrow');

    console.log("labelDown:", labelDown);
    console.log("labelArrow:", labelArrow);


    // Will come up with something better later, works for now
    if(labelDown === null || labelArrow === null){
        console.error("Failed to find labelDown or labelArrow elements.");
        return;
    }

    const labelContent = labelDown.querySelector('.labelContent');

    // Sets proper display and arrow type
    if (labelContent.style.display === 'block') {
        labelContent.style.display = 'none';
        labelArrow.textContent = '⌃';
    } 
    else {
        labelContent.style.display = 'block';
        labelArrow.textContent = '⌵';
    }
}
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
        button.src = '../../src/Images/whiteLeftPanelOpen.png'; // Show image when panel is hidden MAKE SURE CONNECTIONS ARE CORRECT
    } else {
        labelPanel.style.display = 'block';
        button.src = '../../src/Images/whiteLeftPanelClose.png'; // Hide image when panel is shown
    }
})
