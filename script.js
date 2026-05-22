function selectCharacter(name, imageSrc) {
    const displayImg = document.getElementById('chosen-character');
    const nameText = document.getElementById('character-name');

    // Update image source and display it
    displayImg.src = imageSrc;
    displayImg.style.display = 'block';
    
    // Update label text
    nameText.innerText = name;

    // Remove active highlight from all boxes, add to clicked one
    const items = document.querySelectorAll('.grid-item');
    items.forEach(item => item.classList.remove('active'));
    
    // Find the clicked item to highlight it
    event.currentTarget.classList.add('active');
}
function goToPark() {
    if (!document.getElementById('chosen-character').src || 
        document.getElementById('chosen-character').style.display === 'none') {
        alert('Pick an animal first!');
        return;
    }
    window.location.href = 'park.html';
}