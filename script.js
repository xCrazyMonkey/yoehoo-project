const inboxList = document.getElementById("inbox-list");
const emailContentElement = document.getElementById("email-content");
const notificationSound = document.getElementById("email-notification");

const emails = []; //Array to store all company emails
const spam = []; //Array to store all spam emails

retrieveSpamMails();
retrieveCompanyMails();

console.log("simversion: "+simVersion);


// Function to show the custom notification pop-up
function showNotification(message) {
  const notificationPopup = document.getElementById("notification-popup");
  const notificationMessage = document.getElementById("notification-message");

  notificationMessage.textContent = message;
  notificationPopup.style.display = "block";

  // Show the pop-up with full opacity
  setTimeout(() => {
      notificationPopup.style.opacity = "1";
  }, 100); // A small delay before setting opacity to 1

  // Automatically hide the pop-up after a few seconds (e.g., 3 seconds)
  setTimeout(() => {
      // Fade out the pop-up
      notificationPopup.style.opacity = "0";

      // After the fade-out animation, hide the pop-up
      setTimeout(() => {
          notificationPopup.style.display = "none";
      }, 500); // Adjust the time according to your transition duration (0.5 seconds in this example)
  }, 3000); // Adjust the time as needed
}


//===================================Spam functions ========================================  
function retrieveSpamMails() {
  //Retrieve spam mails
  fetch("spam.json")
    .then((response) => response.json())
    .then((emailsData) => {
      emailsData.forEach((email) => {
        spam.push(email);
        addSpamToInbox();
      });
    });
}

function addSpamToInbox() {
    if (spam.length === 0) {
      return; // No more emails to add
    } else {
      const email = spam.shift(); // Get the next email and remove it from the array
      const timeOfDelivery = generateTimestamp();
      const dayOfDelivery = email.dayOfDelivery;
  
      const emailDiv = document.createElement("div");
      emailDiv.className = "email new-email"; // Apply the 'new-email' class to highlight the new email
      emailDiv.id = email.subject.trim().toLowerCase().replace(/ /g, "-");
  
      emailDiv.innerHTML = `
                ${email.subject}
                <span class="timestamp">${dayOfDelivery} ${timeOfDelivery}</span>
                `;
  
      emailDiv.addEventListener("click", () =>
        displayEmailContent(email, dayOfDelivery, timeOfDelivery)
      );
      inboxList.insertBefore(emailDiv, inboxList.firstChild); // Always add the new email to the top of the inbox
      inboxList.scroll({ top: 0, behavior: "smooth" }); // Smoothly scroll to the top of the inbox
    }
  }
  
//==========================================================================================  
let emailsToShow = []; // Store emails to be shown | VERSION 2 VAR
function retrieveCompanyMails() {
  // Retrieve emails
  fetch("emails.json")
    .then((response) => response.json())
    .then((emailsData) => {
      if (simVersion == 1) {
        // Set an initial timeout of 10 seconds for the first email
        setTimeout(addNewEmailToInbox, 10000);
        // Set an interval to show emails every 30 seconds starting after the initial 10 seconds
        setInterval(addNewEmailToInbox, 30000);
        emailsData.forEach((email) => {
          emails.push(email);
        });
      } else if (simVersion == 2) {
        emailsToShow = emailsData; // Load all emails initially
        setTimeout(showNextEmailGroup, 10000);
        setInterval(showNextEmailGroup, 30000); // Set an interval to show emails every 30 seconds
      }
    });
}


function addNewEmailToInbox() {
  if (emails.length === 0) {
    return; // No more emails to add
  } else {
    // Preload and play the notification sound with muted volume
    addNotificationSound();
    showNotification("You have got mail!");

    const timeOfDelivery = getCurrentTimestamp();
    const dayOfDelivery = "Today";

    const email = emails.shift(); // Get the next email and remove it from the array

    const emailDiv = document.createElement("div");
    emailDiv.className = "email new-email"; // Apply the 'new-email' class to highlight the new email
    emailDiv.id = email.subject.trim().toLowerCase().replace(/ /g, "-");

    emailDiv.innerHTML += `
            <strong class="unread-icon">!</strong>
            <strong>${email.subject}</strong>
            <span class="timestamp">${dayOfDelivery} ${timeOfDelivery}</span>
            `;

    emailDiv.addEventListener("click", () => {
      emailDiv.innerHTML = `
            <strong class="unread-icon"></strong>
            ${email.subject}
            <span class="timestamp">${dayOfDelivery} ${timeOfDelivery}</span>
            `;
            
      displayEmailContent(email, dayOfDelivery, timeOfDelivery);

    });

    inboxList.insertBefore(emailDiv, inboxList.firstChild); // Always add the new email to the top of the inbox
    inboxList.scroll({ top: 0, behavior: "smooth" }); // Smoothly scroll to the top of the inbox
  }
}



//=============================== VERSION 2 FUNC =====================================================

function addNewEmailToInboxForBulk(email) {
  // Preload and play the notification sound with muted volume
  addNotificationSound();
  showNotification("You have got mail!");

  const timeOfDelivery = getCurrentTimestamp();
  const dayOfDelivery = "Today";

  const emailDiv = document.createElement("div");
  emailDiv.className = "email new-email"; // Apply the 'new-email' class to highlight the new email

  emailDiv.id = email.subject.trim().toLowerCase().replace(/ /g, "-");

  emailDiv.innerHTML = `
          <strong class="unread-icon">!</strong>
          <strong> Subject: ${email.subject}
          <span class="timestamp">${dayOfDelivery} ${timeOfDelivery}</span><strong>
          `;

          emailDiv.addEventListener("click", () => {
            emailDiv.innerHTML = `
                  <strong class="unread-icon"></strong>
                  <strong>Subject: </strong> ${email.subject}
                  <span class="timestamp">${dayOfDelivery} ${timeOfDelivery}</span>
                  `;
                  
            displayEmailContent(email, dayOfDelivery, timeOfDelivery);
      
          });
  inboxList.insertBefore(emailDiv, inboxList.firstChild); // Always add the new email to the top of the inbox
  inboxList.scroll({ top: 0, behavior: "smooth" }); // Smoothly scroll to the top of the inbox
}

function showNextEmailGroup() {
  // Check if there are more emails to show
  if (emailsToShow.length === 0) {
    return;
  }

  // Get the next group of 3 emails
  const emailsGroup = emailsToShow.splice(0, 3);

  // Show each email in the group with a 1-second interval
  emailsGroup.forEach((email, index) => {
    setTimeout(() => {
      addNewEmailToInboxForBulk(email);
    }, index * 1000); // Delay each email by 1 second
  });
}

//==========================================================================================

function displayEmailContent(email, dateOfRetrieval, timestamp) {
  const emailContentElement = document.getElementById("email-content");
  emailContentElement.innerHTML = `
        <h2 class="content-title"><strong>Subject: </strong>${email.subject}</h2>
        
        <p class="content-timestamp"><strong>${dateOfRetrieval} ${timestamp}</strong></p>
        <p><strong>From:</strong> ${email.sender}</p>
        <p><strong>To: </strong>manager@company.com</p>
  
        <p>${email.content}</p>
    `;
  emailContentElement.scrollIntoView({ behavior: "smooth" });
}

//Function that handles the notification sound whenever a new mail comes in
function addNotificationSound() {
  notificationSound.volume = 0; // Mute the audio
  notificationSound.currentTime = 0;
  notificationSound
    .play()
    .then(() => {
      // Unmute the audio when playback starts
      notificationSound.volume = 1; // Full volume
    })
    .catch((error) => {
      console.error("Failed to play notification sound:", error);
    });
}

//Get the current timeStamp
function getCurrentTimestamp() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Function to generate a random timestamp in "hh:mm" format
function generateTimestamp() {
  const hours = String(Math.floor(Math.random() * 24)).padStart(2, "0");
  const minutes = String(Math.floor(Math.random() * 60)).padStart(2, "0");
  return `${hours}:${minutes}`;
}
