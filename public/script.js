// Define your array of colors
const colors = ['#ECDBD1', '#EC5938', '#F2E3BC', '#96BBBB',]; // replace with your actual colors
let colorIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
  const shelfUrl = document.getElementById('url-input').value; // Get the value of the input box
  if (shelfUrl) {
    fetchRSSFeed();
  }

  const slider = document.getElementById('item-slider');
  const label = document.getElementById('slider-label');

  slider.addEventListener('input', function() {
    label.textContent = slider.value;
  });
});

window.onload = function() {
  const shelfUrl = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)shelfUrl\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
  document.getElementById('url-input').value = shelfUrl;

}

function fetchRSSFeed() {
  const baseUrl = window.location.origin; // Gets the base URL of the current location
  const shelfUrl = document.getElementById('url-input').value; // Get the value of the input box



  fetch(`${baseUrl}/fetch-rss?shelfUrl=${encodeURIComponent(shelfUrl)}`)
      .then(response => response.text())
      .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
      .then(data => processFeed(data))
      .catch(err => console.log(err));
}
function processFeed(data) {
  const items = Array.from(data.querySelectorAll("item"));
  const sliderValue = document.getElementById('item-slider').value;
  const randomItems = items.sort(() => 0.5 - Math.random()).slice(0, sliderValue);

  randomItems.forEach(item => {
    const title = item.querySelector("title").textContent;
    const link = item.querySelector("link").textContent;
    const author = item.querySelector("author_name")?.textContent || 'Author not available';
    let imageUrl = item.querySelector("book_large_image_url")?.textContent || 'default-placeholder-image.jpg';
    imageUrl = decodeHtmlEntities(imageUrl);
    console.log(author);
    
    // Extract the book description from the book_description node
    let bookDescription = item.querySelector("book_description")?.textContent || 'No description available.';
    bookDescription = decodeHtmlEntities(bookDescription);

    // Parse HTML-formatted description (if needed) and create a DOM element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = bookDescription;
    // Here you can manipulate tempDiv like a normal DOM element if needed

    // Create and append HTML elements to display the content
    
  // Inside your loop where you create the feed entries
const container = document.getElementById('feed-container');
const entryDiv = document.createElement('div');
entryDiv.className = 'feed-entry';

// Set the background color of the entryDiv
entryDiv.style.backgroundColor = colors[colorIndex];

// Increment colorIndex, and reset it to 0 if it's equal to the length of the colors array
colorIndex = (colorIndex + 1) % colors.length;

    const coverImg = document.createElement('img');
    coverImg.src = imageUrl;
    coverImg.alt = `Cover of ${title}`;
    coverImg.className = 'cover-image';

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    titleElement.className = 'my-title-class';
  

    const descriptionElement = document.createElement('div');
    descriptionElement.innerHTML = bookDescription; // If HTML tags are used in description
    // OR: descriptionElement.textContent = tempDiv.textContent || tempDiv.innerText; // For text-only description

    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.textContent = 'View on Goodreads';
    linkElement.target = '_blank';
    linkElement.className = 'my-link-class';

    const authorElement = document.createElement('p');
    authorElement.textContent = author;
    authorElement.className = 'my-author-class';

    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('width', '362');
    svgElement.setAttribute('height', '2');
    svgElement.setAttribute('viewBox', '0 0 362 2');
    svgElement.style.fill = 'none';
    svgElement.classList.add('my-svg-class');

    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('d', 'M0 1H361.5');
    pathElement.style.stroke = 'black';
    pathElement.style.strokeWidth = '1px';

    
    

const buttonImg = document.createElement('img');
buttonImg.src = '/images/forward.png'; // Replace with your button image URL
buttonImg.alt = 'View Change Button';
buttonImg.className = 'my-button-class';

buttonImg.addEventListener('click', function() {
  // Handle the view change here
  console.log('Button clicked!');
});

// Add the button image to the entry div
entryDiv.appendChild(buttonImg);
    //entryDiv.appendChild(descriptionElement);
    entryDiv.appendChild(titleElement);
    entryDiv.appendChild(authorElement);
    entryDiv.appendChild(svgElement);
    svgElement.appendChild(pathElement);
    entryDiv.appendChild(linkElement);
    container.appendChild(entryDiv);
  });
}

function decodeHtmlEntities(text) {
  var textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}


var shelfUrl = '';

document.getElementById('refresh-button').addEventListener('click', function() {
  // Get the value of the input box
  shelfUrl = document.getElementById('url-input').value;

  if (!shelfUrl) {
    console.error('No URL entered. Please enter a URL before refreshing the feed.');
    return;
  }

  // Save the URL to a cookie
  console.log(`Saved URL: ${shelfUrl}`);
  document.cookie = `shelfUrl=${encodeURIComponent(shelfUrl)}; path=/`;

  // Log the value of the 'shelfUrl' cookie
  console.log(`shelfUrl cookie: ${decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)shelfUrl\s*\=\s*([^;]*).*$)|^.*$/, "$1"))}`);

  // Clear the current feed entries
  const container = document.getElementById('feed-container');
  container.innerHTML = '';

  // Fetch and display the new feed entries
  fetchRSSFeed();
});