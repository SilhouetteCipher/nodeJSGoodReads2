document.addEventListener('DOMContentLoaded', function() {
  fetchRSSFeed();

  const slider = document.getElementById('item-slider');
  const label = document.getElementById('slider-label');

  slider.addEventListener('input', function() {
    label.textContent = slider.value;
  });
});

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
    let imageUrl = item.querySelector("book_large_image_url")?.textContent || 'default-placeholder-image.jpg';
    imageUrl = decodeHtmlEntities(imageUrl);
    
    // Extract the book description from the book_description node
    let bookDescription = item.querySelector("book_description")?.textContent || 'No description available.';
    bookDescription = decodeHtmlEntities(bookDescription);

    // Parse HTML-formatted description (if needed) and create a DOM element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = bookDescription;
    // Here you can manipulate tempDiv like a normal DOM element if needed

    // Create and append HTML elements to display the content
    const container = document.getElementById('feed-container');
    const entryDiv = document.createElement('div');
    entryDiv.className = 'feed-entry';

    const coverImg = document.createElement('img');
    coverImg.src = imageUrl;
    coverImg.alt = `Cover of ${title}`;
    coverImg.className = 'cover-image';

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    const descriptionElement = document.createElement('div');
    descriptionElement.innerHTML = bookDescription; // If HTML tags are used in description
    // OR: descriptionElement.textContent = tempDiv.textContent || tempDiv.innerText; // For text-only description

    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.textContent = 'View on Goodreads';
    linkElement.target = '_blank';

    entryDiv.appendChild(coverImg);
    entryDiv.appendChild(titleElement);
    entryDiv.appendChild(descriptionElement);
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

document.getElementById('save-url-button').addEventListener('click', function() {
  shelfUrl = document.getElementById('url-input').value;
  console.log(`Saved URL: ${shelfUrl}`);
});

document.getElementById('refresh-button').addEventListener('click', function() {
  if (!shelfUrl) {
    console.error('No URL saved. Please enter a URL and click "Save URL" before refreshing the feed.');
    return;
  }
  console.log(`Fetching RSS feed from ${shelfUrl}`);
  fetch(`/fetch-rss?shelfUrl=${encodeURIComponent(shelfUrl)}`)
    .then(response => response.text())
    .then(data => {
      // Handle the fetched RSS data here
    });
});

document.getElementById('refresh-button').addEventListener('click', function() {
  // Clear the current feed entries
  const container = document.getElementById('feed-container');
  container.innerHTML = '';

  // Fetch and display the new feed entries
  fetchRSSFeed();
});


