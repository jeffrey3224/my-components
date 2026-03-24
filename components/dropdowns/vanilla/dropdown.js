const dropdownButtons = document.querySelectorAll(".dropdown-button");

dropdownButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const container = button.closest(".container");
    const content = container.querySelector(".dropdown-content");
    const arrow = container.querySelector(".dropdown-button-arrow");

    const isAlreadyOpen = content.classList.contains("open");

    document.querySelectorAll(".dropdown-content.open").forEach((item) => {
      item.classList.remove("open");
    });

    document.querySelectorAll(".dropdown-button-arrow.open").forEach((item) => {
      item.classList.remove("open");
    });

    if (!isAlreadyOpen) {
      content.classList.add("open");
      arrow.classList.add("open");
    }
  });
});