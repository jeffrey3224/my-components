
const degreesContainer = document.getElementById("degrees_container");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter_btn");
const items = document.querySelectorAll(".talbot_degree");
const degreeTypes = document.querySelectorAll(".degree-type");
const removeFilterButton = document.getElementById("clear-filters_btn");
const showFiltersButton = document.getElementById("show-filters_btn");
const filtersModule = document.getElementById("filters-module");
const formatModal = document.getElementById("program-format-modal");
const showFormatModalButton = document.getElementById("show-format-modal-button");
const closeFormatModalButton = document.getElementById("close-format-modal-button");
const formatFilterButtons = document.querySelectorAll(".formats_btn");
const programsContent = document.querySelector(".programs-content");
const programsWrapper = document.querySelector(".explore-programs");
const filterSubmitBtn = document.getElementById("filter_submit");
const programsFilterAside = document.querySelector(".programs-filter-aside");
const filterOverflowContainer = document.querySelector(".filter-overflow-container");
const yourLanguageHeading = document.querySelector(".your-language_card")?.querySelector("h2");

const iconsList = [
 {
 name: "Hybrid",
 src: "https://assets.biola.edu/4396738754672012438/attachment/5b292f4b55d7f855ebdfaa200ed4d1bf/hybrid-1.svg"
 },
 { name: "On-Site", 
 src: "https://assets.biola.edu/4396738754672012438/attachment/e193708c33e523930464636742deddc3/on-site-1.svg" 
 },
 { name: "Remote", 
 src: "https://assets.biola.edu/4396738754672012438/attachment/c01ed2390644029a43d9b88cf1d94388/remote-1.svg" 
 },
 { name: "Residency", 
 src: "https://assets.biola.edu/4396738754672012438/attachment/4117f4b18f10f51f93008e9da1f25253/residency-1.svg" 
 }
];

const degrees = Array.from(items).map((item) => {
 const link = item.querySelector("a");
 const iconRow = item.querySelector(".icon-row")?.textContent.trim();
 const location = item.querySelector(".location");
 const trackHeader = item.querySelector(".track-header")?.textContent;

 return {
 name: link.textContent.trim(),
 href: link.href,
 category: item.dataset.category || null,
 type: item.dataset.type,
 track: trackHeader || null,
 format: iconRow ? iconRow.split(",").map((i) => i.trim().toLowerCase()) : [],
 location: location?.textContent?.trim() || null,
 };
});

// filter button event listeners 

let activeButton = null;

filterButtons.forEach((button) => {

 button.setAttribute("aria-pressed", "false");

 button.addEventListener("click", () => {
 const degreeType = button.dataset.type;

 
 filterDegreesByType(degreeType);

 if (activeButton) {
 activeButton.setAttribute("aria-pressed", "false");
 activeButton.classList.remove("button_pressed");
 }

 button.setAttribute("aria-pressed", "true");
 button.classList.add("button_pressed");
 activeButton = button;
 removeFilterButton.style.display = "block";
 
 searchInput.value = "";

 requestAnimationFrame(() => {
 degreesContainer.focus({ preventScroll: true });

 if (window.innerWidth >= 992) {
 programsWrapper.scrollIntoView({
 behavior: "instant",
 block: "start"
 })
 }
 });
 
 setFilterDisplay(false);
 })
})

let filtersModuleOpen = false;

const setFilterDisplay = (state) => {

 window.innerWidth > 576 ? filtersModuleOpen = true : filtersModuleOpen = state;

 if (filtersModuleOpen) {
 filtersModule.classList.add("open");
 showFiltersButton.textContent = "Hide filters";
 }

 else {
 filtersModule.classList.remove("open");
 showFiltersButton.textContent = "Show filters";
 }

 filtersModule.inert = !filtersModuleOpen;
}

showFiltersButton.addEventListener("click", () => {
 setFilterDisplay(!filtersModuleOpen);
})

const groupByType = (degrees) => {
 const groups = {};

 degrees.forEach((degree) => {
 if (!groups[degree.type]) {
 groups[degree.type] = [];
 }

 groups[degree.type].push(degree);
 });

 return groups;
};

const renderIcons2 = (formatList, iconRow, location) => {

 if (!formatList || !iconRow) return;

 const iconContainer = document.createElement("div");
 iconContainer.classList.add("icon-container");

 formatList.forEach((item) => {
 
 const matchedIcon = iconsList.find((icon) => icon.name.toLowerCase() === item);
 

 if (!matchedIcon) return;

 const img = document.createElement("img");
 img.src = matchedIcon.src;
 img.alt = item;
 img.className = "program-icon-2";

 iconContainer.appendChild(img);
 });

 iconRow.appendChild(iconContainer);

 if (location) {
 const locationContainer = document.createElement("span");
 
 locationContainer.classList.add("location-container");
 locationContainer.innerHTML = location;
 iconRow.appendChild(locationContainer);
 }
};

const renderBrowseMode = (degrees) => {

 degreesContainer.innerHTML = "";

 const groups = groupByType(degrees);

 removeFilterButton.style.display = "none";

 // render degree type headings 

 Object.entries(groups).forEach(([type, degreeList]) => {
 const degreesSegment = document.createElement("section");
 const heading = document.createElement("h3");
 const ul = document.createElement("ul");
 degreesSegment.classList.add("degrees_segment");
 ul.classList.add("degree-list");

 const headingElement = Array.from(degreeTypes).find(
 (el) => el.dataset.type === type
 );

 heading.textContent = headingElement
 ? headingElement.textContent.trim()
 : type;

 degreesSegment.appendChild(heading);
 degreesSegment.appendChild(ul);
 degreesContainer.appendChild(degreesSegment);

 const renderedCategory = new Set();

 degreeList.forEach((degree) => {

 // render degree items

 const degreeEl = document.createElement("li");
 const content = document.createElement("p");

 content.innerHTML = `${degree.track ? degree.track : ""} <a href="${degree.href}">${degree.name}</a>`;

 degreeEl.append(content);
 degreeEl.classList.add("degree_item");

 const iconRow = document.createElement("div");
 iconRow.classList.add("icon-row");

 renderIcons2(degree.format, iconRow, degree.location);

 if (iconRow.children.length > 0) {
 degreeEl.appendChild(iconRow);
 }

 if (renderedCategory.has(degree.category) && degree.category) {
 degreeEl.classList.add("indent")
 }

 if (degree.name === degree.category) {
 renderedCategory.add(degree.category);
 }

 ul.appendChild(degreeEl);
 
 });
 });
};

const filterDegrees = (query) => {

 degreesContainer.innerHTML = "";

 if (query.length < 1) {
 const noResultsMessage = document.createElement("h3");
 noResultsMessage.classList.add("no-results_header");
 noResultsMessage.textContent = "No programs matched your search. Try another keyword or clear filters.";
 degreesContainer.append(noResultsMessage);

 removeFilterButton.style.display = "block";

 return;
 }

 const degreesSegment = document.createElement("section");
 degreesSegment.classList.add("degrees_segment");
 const resultsHeader = document.createElement("h3");
 const inputValue = searchInput.value.trim();
 resultsHeader.innerHTML = `Results for <span class="search-result">${inputValue}</span>`;

 const degreesFilterResults = document.createElement("ul");

 degreesSegment.appendChild(resultsHeader);
 degreesSegment.appendChild(degreesFilterResults);

 degreesContainer.appendChild(degreesSegment);

 degreesFilterResults.classList.add("degree-list");

 removeFilterButton.style.display = "block";

 const resultCategory = new Set ();

 query.forEach((degree) => {

 // if the result has a parent category, render the parent category first

 if (degree.category && !resultCategory.has(degree.category)) {
 const resultParent = degrees.find((d) => d.category === degree.category)
 resultCategory.add(resultParent.category);

 const headerEl = document.createElement("li");
 const headerContent = document.createElement("p");

 headerContent.innerHTML = `<a href="${resultParent.href}">${resultParent.name}</a>`;

 headerEl.append(headerContent);
 headerEl.classList.add("degree_item");

 degreesFilterResults.appendChild(headerEl);
 }

 // render degree items

 if (degree.category === degree.name) return;
 
 const degreeEl = document.createElement("li");
 const content = document.createElement("p");

 content.innerHTML = `${degree.track ? degree.track : ""} <a href="${degree.href}">${degree.name}</a>`;

 degreeEl.append(content);
 degreeEl.classList.add("degree_item");

 const iconRow = document.createElement("div");
 iconRow.classList.add("icon-row");


 // if the item has a parent category, the item gets indented

 if (resultCategory.has(degree.category) && degree.category) {
 degreeEl.classList.add("indent");
 }

 renderIcons2(degree.format, iconRow, degree.location);

 if (iconRow.children.length > 0) {
 degreeEl.appendChild(iconRow);
 }

 degreesFilterResults.appendChild(degreeEl);
 });
};

const filterDegreesByName = (query) => {
 const nameResults = degrees.filter(degree =>
 degree.name.toLowerCase().includes(query.toLowerCase()));
 filterDegrees(nameResults);

 requestAnimationFrame(() => {
 degreesContainer.focus({ preventScroll: true });

 if (window.innerWidth >= 992) {
 programsWrapper.scrollIntoView({
 behavior: "instant",
 block: "start"
 })
 }
 });
};

const filterDegreesByType = (query) => {
 const typeResults = degrees.filter(degree => degree.type.toLowerCase().includes(query.toLowerCase()));

 renderBrowseMode(typeResults);
}

const filterFormatType = (query) => {
 const formatResults = degrees.filter(degree => degree.format && degree.format.some((format) => format.toLowerCase().includes(query.toLowerCase())));

 renderBrowseMode(formatResults);
}

const resetFilterButtons = () => {
 filterButtons.forEach((b) => {
 b.classList.remove("button_pressed");
 b.setAttribute("aria-pressed", "false");
 });

 formatFilterButtons.forEach((b) => {
 b.classList.remove("button_pressed");
 b.setAttribute("aria-pressed", "false");
 })
}

removeFilterButton.addEventListener("click", () => {
 renderBrowseMode(degrees);
 searchInput.value = "";
 searchInput.focus();
 resetFilterButtons();
});

formatFilterButtons.forEach((button) => {

 button.setAttribute("aria-pressed", "false");

 button.addEventListener("click", () => {

 const format = button.dataset.type;
 filterFormatType(format);

 if (activeButton) {
 activeButton.setAttribute("aria-pressed", "false");
 activeButton.classList.remove("button_pressed");
 }

 button.setAttribute("aria-pressed", "true");
 button.classList.add("button_pressed");
 activeButton = button;
 removeFilterButton.style.display = "block";

 requestAnimationFrame(() => {
 degreesContainer.focus({ preventScroll: true });

 if (window.innerWidth >= 992) {
 programsWrapper.scrollIntoView({
 behavior: "instant",
 block: "start"
 })
 }
 });
 setFilterDisplay(false);
 })
 searchInput.value = ""
})

// input search functionality 

searchInput.addEventListener("keydown", function(event) {
 if (event.key === "Enter") {
 event.preventDefault();
 const inputValue = searchInput.value.trim();

 if (inputValue) {
 filterDegreesByName(inputValue);
 resetFilterButtons();
 }
 else {
 renderBrowseMode(degrees);
 resetFilterButtons();
 }

 if (filtersModuleOpen) {
 setFilterDisplay(false);
 }
 }
});

filterSubmitBtn.addEventListener("click", () => {
 const inputValue = searchInput.value.trim();

 if (inputValue) {
 filterDegreesByName(inputValue);
 }

 else {
 renderBrowseMode(degrees);
 }

 if (filtersModuleOpen) {
 setFilterDisplay(false);
 }
})

// toggle format descriptions modal

let modalOpen = false;
let handleKeydown = null;

function preventScroll(e) {
 e.preventDefault();
}

const showFormatModal = () => {
 formatModal.style.display = "flex";
 modalOpen = true;

 window.addEventListener("wheel", preventScroll, { passive: false });
 window.addEventListener("touchmove", preventScroll, { passive: false });

 closeFormatModalButton.setAttribute("aria-hidden", "false");
 closeFormatModalButton.addEventListener("click", () => {
 formatModal.close();
 })

// built-in method for making document inert
 formatModal.showModal();
}

const hideFormatModal = () => {
 formatModal.style.display = "none";
 formatModal.setAttribute("aria-hidden", "true");
 
 modalOpen = false;

 window.removeEventListener("wheel", preventScroll);
 window.removeEventListener("touchmove", preventScroll);

 closeFormatModalButton.setAttribute("aria-hidden", "true"); 
 
 document.removeEventListener("keydown", handleKeydown);
 
 showFormatModalButton.focus();

};

showFormatModalButton.addEventListener("click", showFormatModal);
closeFormatModalButton.addEventListener("click", hideFormatModal);

document.addEventListener("keydown", function (e) {
 if (modalOpen && e.key === "Escape") {
 hideFormatModal();
 }
});

const checkFiltersModuleDisplay = () => {
 if (window.innerWidth > 576) {
 setFilterDisplay(true);
}

else {
 setFilterDisplay(false);
}
}

window.addEventListener("resize", () => {
 checkFiltersModuleDisplay();
})

// runtime functions
renderBrowseMode(degrees);
checkFiltersModuleDisplay();

if (yourLanguageHeading) {
 yourLanguageHeading.innerHTML = `
 Your Language.<br>
 Your Culture.<br>
 One Gospel.
`;
};