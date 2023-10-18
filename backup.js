const inboxList = document.getElementById("inbox-list");
const emailContentElement = document.getElementById("email-content");
const notificationSound = document.getElementById("email-notification");

const emails = []; //Array to store all company emails
const spam = []; //Array to store all spam emails

retrieveSpamMails();
retrieveCompanyMails();

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
                <strong>Subject: </strong> ${email.subject}
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

function retrieveCompanyMails() {
  //Retrieve emails
  fetch("emails.json")
    .then((response) => response.json())
    .then((emailsData) => {
      setInterval(addNewEmailToInbox, 1000); // SET TO 30 SECS
      emailsData.forEach((email) => {
        emails.push(email);
      });
    });
}


function addNewEmailToInbox() {
  if (emails.length === 0) {
    return; // No more emails to add
  } else {
    // Preload and play the notification sound with muted volume
    addNotificationSound();

    const email = emails.shift(); // Get the next email and remove it from the array
    const timeOfDelivery = getCurrentTimestamp();
    const dayOfDelivery = "Today";

    const emailDiv = document.createElement("div");
    emailDiv.className = "email new-email"; // Apply the 'new-email' class to highlight the new email
    emailDiv.id = email.subject.trim().toLowerCase().replace(/ /g, "-");

    emailDiv.innerHTML = `
            <strong>Subject:</strong> ${email.subject}
            <span class="timestamp">${dayOfDelivery} ${timeOfDelivery}</span>
            `;

    emailDiv.addEventListener("click", () =>
      displayEmailContent(email, dayOfDelivery, timeOfDelivery)
    );
    inboxList.insertBefore(emailDiv, inboxList.firstChild); // Always add the new email to the top of the inbox
    inboxList.scroll({ top: 0, behavior: "smooth" }); // Smoothly scroll to the top of the inbox
  }
}

function displayEmailContent(email, dateOfRetrieval, timestamp) {
  const emailContentElement = document.getElementById("email-content");
  emailContentElement.innerHTML = `
        <h2 class="content-title"><strong>Subject: </strong>${email.subject}</h2>
        <hr>
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
