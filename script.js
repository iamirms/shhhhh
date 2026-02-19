// script.js

// Global variable to toggle shuffle function
let shuffleEnabled = false;


// Add clear input on first focus functionality
document.addEventListener("DOMContentLoaded", function () {
  var inputElement = document.getElementById("inputText");
  if (inputElement) {
    inputElement.addEventListener("focus", function () {
      if (inputElement.value.trim() === "") {
        inputElement.value = "";
        inputElement.style.height = "auto"; // reset auto-grow height
      }
    }, { once: true }); // Only trigger once, on first focus
  }
});


// Add a function to handle input events
function handleInput(event) {
  var inputElement = document.getElementById("inputText");
  var submitButton = document.getElementById("submitButton");

  inputElement.style.height = "auto";
  inputElement.style.height = (inputElement.scrollHeight) + "px";

  // Check if there is content in the textarea
  var hasContent = inputElement.value.trim() !== "";

  // Set opacity based on content presence
  submitButton.style.opacity = hasContent ? 1 : 0.5;

  // Allow pressing Enter to submit the form
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault(); // Prevent adding a new line
    document.getElementById("submitButton").click(); // Trigger the submit button
  }
}

function submitForm() {
  var inputElement = document.getElementById("inputText");
  var inputText = inputElement.value;

  if (inputText.trim() === "") {
    // Do not proceed if the input is empty or contains only whitespace
    return false;
  }

// Apply shuffle function only if enabled
  var shuffledText = shuffleEnabled ? shuffleStringWithPreservation(inputText) : inputText;

  // Save post to local storage with text, and timestamp
  var posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts.push({
    text: shuffledText,
    timestamp: new Date().toISOString()
  });


  localStorage.setItem('posts', JSON.stringify(posts));

  // Display posts on the timeline
  displayTimeline();

  // Update the post counter
  updatePostCounter(posts.length);

  // Clear the text field and reset its height
  inputElement.value = "";
  inputElement.style.height = "auto";

  return false; // Prevent form submission and query parameter addition
}


function shuffleStringWithPreservation(str) {
  const characters = str.split('');

  // Separate into groups: lowercase letters, uppercase letters, numbers, and special characters
  const lowercaseLetters = characters.filter(char => /[a-z]/.test(char));
  const uppercaseLetters = characters.filter(char => /[A-Z]/.test(char));
  const numbers = characters.filter(char => /\d/.test(char));
  const specialCharacters = characters.filter(char => /[^\w\s]/.test(char));

  // Shuffle each group separately
  shuffleArray(lowercaseLetters);
  shuffleArray(uppercaseLetters);
  shuffleArray(numbers);
  shuffleArray(specialCharacters);

  // Combine the shuffled groups back into a single array
  const shuffledArray = characters.map(char => {
    if (/[a-z]/.test(char)) return lowercaseLetters.shift();
    if (/[A-Z]/.test(char)) return uppercaseLetters.shift();
    if (/\d/.test(char)) return numbers.shift();
    if (/[^\w\s]/.test(char)) return specialCharacters.shift();
    return char; // for spaces and other characters
  });

  // Convert the array back to a string
  return shuffledArray.join('');
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function displayTimeline() {
    var posts = JSON.parse(localStorage.getItem('posts')) || [];
    var postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';

  // Reverse the order of posts to display the newest ones at the top
    posts.reverse();

    posts.forEach(function(post) {
        var postElement = document.createElement('div');
        postElement.classList.add('post');

        // Add timestamp
        var timestampElement = document.createElement('span');
        var timestampBefore = document.createElement('span');
        timestampBefore.innerText = "You posted this "
        timestampElement.classList.add('timestamp');
        timestampElement.innerText = calculateTimeAgo(post.timestamp);
        timestampElement.insertBefore(timestampBefore, timestampElement.firstChild);

        postElement.appendChild(timestampElement);

        // add share button
        //var XshareElement = document.createElement('span');
        //XshareElement.classList.add('xshare');
        //XshareElement.innerHTML = "<a href='#' onclick='openTwitterPopup()' ><i class='fa-brands fa-x-twitter'></i>Share</a>";
        //postElement.appendChild(XshareElement);

        // Add post text
        var textElement = document.createElement('div');
        textElement.innerText = post.text;
        postElement.appendChild(textElement);

        postsContainer.appendChild(postElement);
    });
}

function openTwitterPopup() {
            // Define the Twitter share URL with your tweet text
            var tweetText = encodeURIComponent("I wrote something down but didn't send it anywhere. via @Shhhhh_net");
            var twitterURL = "https://twitter.com/intent/tweet?text=" + tweetText;

            // Open the Twitter popup window
            window.open(twitterURL, "Twitter Popup", "width=600,height=400");
        }

// class='twitter-share-button' href='https://twitter.com/intent/tweet' data-text='I wrote something down but didn't send it anywhere. @Shhhhh'

function calculateTimeAgo(timestamp) {
    var now = new Date();
    var postTime = new Date(timestamp);
    var timeDifference = now - postTime;
    var seconds = Math.floor(timeDifference / 1000);

    if (seconds < 60) {
        return seconds + " seconds ago";
    }

    var minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return minutes + " minutes ago";
    }

    var hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return hours + " hours ago";
    }

    var days = Math.floor(hours / 24);
    return days + " days ago";
}

function updatePostCounter(count) {
            var postCountElement = document.getElementById('postCount');
            postCountElement.innerText = count;
        }



// Initial display of timeline on page load
displayTimeline();
updatePostCounter(0);

// twitter.js
window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));

// clear local storage
function clearLocalStorage() {
            // Clear the local storage
            localStorage.clear();
            alert('Local storage cleared!');
        }
