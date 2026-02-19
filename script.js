// script.js

// Global variable to toggle shuffle function
let shuffleEnabled = false;


// ===============================
// CLEAR INPUT ON CLICK
// ===============================

function clearInputOnClick() {
  var inputElement = document.getElementById("inputText");
  inputElement.value = "";
  inputElement.style.height = "auto";
}

// Attach click listener once DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  var inputElement = document.getElementById("inputText");
  if (inputElement) {
    inputElement.addEventListener("click", clearInputOnClick);
  }
});


// ===============================
// INPUT HANDLING
// ===============================

function handleInput(event) {
  var inputElement = document.getElementById("inputText");
  var submitButton = document.getElementById("submitButton");

  inputElement.style.height = "auto";
  inputElement.style.height = (inputElement.scrollHeight) + "px";

  var hasContent = inputElement.value.trim() !== "";
  submitButton.style.opacity = hasContent ? 1 : 0.5;

  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    document.getElementById("submitButton").click();
  }
}


// ===============================
// FORM SUBMIT
// ===============================

function submitForm() {
  var inputElement = document.getElementById("inputText");
  var inputText = inputElement.value;

  if (inputText.trim() === "") {
    return false;
  }

  var shuffledText = shuffleEnabled ? shuffleStringWithPreservation(inputText) : inputText;

  var posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts.push({
    text: shuffledText,
    timestamp: new Date().toISOString()
  });

  localStorage.setItem('posts', JSON.stringify(posts));

  displayTimeline();
  updatePostCounter(posts.length);

  inputElement.value = "";
  inputElement.style.height = "auto";

  return false;
}


// ===============================
// SHUFFLE
// ===============================

function shuffleStringWithPreservation(str) {
  const characters = str.split('');

  const lowercaseLetters = characters.filter(char => /[a-z]/.test(char));
  const uppercaseLetters = characters.filter(char => /[A-Z]/.test(char));
  const numbers = characters.filter(char => /\d/.test(char));
  const specialCharacters = characters.filter(char => /[^\w\s]/.test(char));

  shuffleArray(lowercaseLetters);
  shuffleArray(uppercaseLetters);
  shuffleArray(numbers);
  shuffleArray(specialCharacters);

  const shuffledArray = characters.map(char => {
    if (/[a-z]/.test(char)) return lowercaseLetters.shift();
    if (/[A-Z]/.test(char)) return uppercaseLetters.shift();
    if (/\d/.test(char)) return numbers.shift();
    if (/[^\w\s]/.test(char)) return specialCharacters.shift();
    return char;
  });

  return shuffledArray.join('');
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


// ===============================
// DISPLAY POSTS
// ===============================

function displayTimeline() {
  var posts = JSON.parse(localStorage.getItem('posts')) || [];
  var postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = '';

  posts.reverse();

  posts.forEach(function(post) {
    var postElement = document.createElement('div');
    postElement.classList.add('post');

    var timestampElement = document.createElement('span');
    var timestampBefore = document.createElement('span');
    timestampBefore.innerText = "You posted this ";
    timestampElement.classList.add('timestamp');
    timestampElement.innerText = calculateTimeAgo(post.timestamp);
    timestampElement.insertBefore(timestampBefore, timestampElement.firstChild);

    postElement.appendChild(timestampElement);

    var textElement = document.createElement('div');
    textElement.innerText = post.text;
    postElement.appendChild(textElement);

    postsContainer.appendChild(postElement);
  });
}


// ===============================
// TWITTER SHARE
// ===============================

function openTwitterPopup() {
  var tweetText = encodeURIComponent("I wrote something down but didn't send it anywhere. via @Shhhhh_net");
  var twitterURL = "https://twitter.com/intent/tweet?text=" + tweetText;
  window.open(twitterURL, "Twitter Popup", "width=600,height=400");
}


// ===============================
// TIME CALCULATION
// ===============================

function calculateTimeAgo(timestamp) {
  var now = new Date();
  var postTime = new Date(timestamp);
  var timeDifference = now - postTime;
  var seconds = Math.floor(timeDifference / 1000);

  if (seconds < 60) return seconds + " seconds ago";

  var minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + " minutes ago";

  var hours = Math.
