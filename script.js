function selectCharacter(name, imageSrc) {
    const displayImg = document.getElementById('chosen-character');
    const nameText = document.getElementById('character-name');

    displayImg.src = imageSrc;
    displayImg.style.display = 'block';
    nameText.innerText = name;

    // Save to localStorage
    localStorage.setItem('selectedAnimal', imageSrc);
    localStorage.setItem('selectedAnimalName', name);

    // Update active highlight
    document.querySelectorAll('.grid-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function goToPark() {
    if (!localStorage.getItem('selectedAnimal')) {
        alert('Pick an animal first!');
        return;
    }
    window.location.href = 'park.html';
}