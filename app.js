const shape = document.querySelector("#shape");
const shapeToggle = document.querySelector(".shape-toggle");
const codeArea = document.querySelector("#code-holder");
const insetToggle = document.querySelector(".inset-toggle");
const thumbnailTemplate = document.querySelector("#new-thumbnail");
const sToggleTemplate = document.querySelector("#new-shadow-toggle");
const sTogglesContainer = document.querySelector("#toggle-shadows");
const thumbnailsContainer = document.querySelector("#multi-box-shadow");

let boxShadows = [
    {
      xOffset: 0,
      yOffset: 0,
      shadowColor: "#30e855",
      spread: 2,
      blur: 8,
      inset: false,
      active: true,
    },
  ],
  activeIndex = 0;

const updateSliderProgress = (slider) => {
  const min = slider.min || 0;
  const max = slider.max || 100;
  const percentage = ((slider.value - min) / (max - min)) * 100;
  slider.style.setProperty("--value", `${percentage}%`);
};

const setButtonsState = () => {

  document.querySelector("#multi-box-shadow").style.display =
    boxShadows.length < 2 ? "none" : "";
  // document.querySelector(".del-shadow").style.display =
  //   boxShadows.length < 2 ? "none" : "";

  document.querySelector(".add-box-shadow").style.display =
    boxShadows.length >= 4 ? "none" : "";
};

const getString = (it) => {
  const { xOffset, yOffset, shadowColor, spread, blur, inset } = it;
  const str = `${
    inset ? "inset " : ""
  }${xOffset}px ${yOffset}px ${blur}px ${spread}px ${shadowColor}`;
  return str;
};

const handleCopy = (btn) => {
  navigator.clipboard.writeText(codeArea.value);
  btn.textContent = "copied";
  btn.classList.toggle("copied");
  setTimeout(() => {
    btn.textContent = "copy";
    btn.classList.toggle("copied");
  }, 2000);
};
const updateUI = () => {
  codeArea.value = boxShadows
    .filter((el) => el.active)
    .map((boxShadow) => getString(boxShadow))
    .join(", ");
  shape.style.boxShadow = codeArea.value;
};

const activateThumbnail = (par) => {
  document.querySelectorAll(".shadow-thumbnail").forEach((el) => {
    el === par ? el.classList.add("active") : el.classList.remove("active");
  });
};

const addThumbnail = () => {
  const index = +thumbnailsContainer.lastElementChild.dataset.index + 1;
  const newOne = thumbnailTemplate.content.cloneNode(true);
  const newToggle = sToggleTemplate.content.cloneNode(true);
  newOne.querySelector(".shadow-thumbnail").setAttribute("data-index", index);
  newOne.querySelector(".thumbnail-label").textContent = `shad ${index + 1}`;
  newToggle.querySelector(".shadow-toggle").textContent = `shad ${index + 1}`;
  newToggle.querySelector(".shadow-toggle").setAttribute("data-index", index);

  // -- Deactivate all existing thumbnails & activate all existing shadow toggles
  document.querySelectorAll(".shadow-btn").forEach((el) => {
    el.matches(".shadow-thumbnail")
      ? el.classList.remove("active")
      : el.classList.add("active");
  });

  // -- Append the new thumbnail and shadow toggle to their respective containers
  thumbnailsContainer.appendChild(newOne);
  sTogglesContainer.appendChild(newToggle);

  activeIndex = index; // change the active index to that of the new thumbnail
};

const addBoxShadow = () => {
  if (boxShadows.length < 4) {
    const ind = boxShadows.length;
    boxShadows = [
      ...boxShadows,
      {
        xOffset: 0,
        yOffset: 0,
        shadowColor: "#3046e8",
        spread: 2,
        blur: 8,
        inset: false,
        active: true,
      },
    ];
    addThumbnail();
    updateUI();
    updateInputValues();
    setButtonsState();
  }
};

const resetShadowBtn = (selector) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.setAttribute("data-index", i);
    const label = el.querySelector(".thumbnail-label");
    label
      ? (label.textContent = `shad ${i + 1}`)
      : (el.textContent = `shad ${i + 1}`);
    if (el.matches(".shadow-thumbnail")) {
      i === 0 ? el.classList.add("active") : el.classList.remove("active");
    } else if (el.matches(".shadow-toggle")) {
      el.classList.add("active");
    }
  });
};

const removeBoxShadow = (ind) => {
  boxShadows = boxShadows.filter((item, i) => i !== +ind);

  //-- Delete the thumbnail and shadow toggle associated with this index from the DOM
  document
    .querySelectorAll(`.shadow-btn[data-index='${ind}']`)
    .forEach((el) => el.remove());

  resetShadowBtn(".shadow-thumbnail");
  resetShadowBtn(".shadow-toggle");

  activeIndex = 0;
  updateUI();
  updateInputValues();
  setButtonsState();
};

const toggleShadow = (index) => {
  boxShadows = boxShadows.map((item, i) => {
    if (i === +index) {
      item.active = !item.active;
    }
    return item;
  });
  updateUI();
};

const updateInputValues = () => {
  const allInputs = document.querySelectorAll(".input-control");
  allInputs.forEach((input) => {
    input.value = boxShadows[activeIndex][[input.id]];
    updateSliderProgress(input);
  });
  const outsetLabel = insetToggle.previousElementSibling;
  const insetLabel = insetToggle.nextElementSibling;
  if (boxShadows[activeIndex]["inset"]) {
    insetToggle.classList.add("toggle-on");
    insetLabel.classList.add(".toggle-on");
    outsetLabel.classList.remove(".toggle-on");
  } else {
    insetToggle.classList.remove("toggle-on");
    outsetLabel.classList.add(".toggle-on");
    insetLabel.classList.remove(".toggle-on");
  }
};

document.addEventListener("DOMContentLoaded", (e) => {
  updateInputValues();
  updateUI();
  setButtonsState();
});

document.addEventListener("click", (e) => {
  if (e.target.closest(".shape-toggle")) {
    shapeToggle.classList.toggle("toggle-on");
    shape.classList.toggle("circular");
  } else if (e.target.matches(".copy-btn")) {
    handleCopy(e.target);
  } else if (e.target.closest(".inset-toggle")) {
    insetToggle.classList.toggle("toggle-on");
    boxShadows[activeIndex]["inset"] = !boxShadows[activeIndex]["inset"];
    insetToggle.parentElement
      .querySelectorAll(".label")
      .forEach((el) => el.classList.toggle("toggle-on"));
    updateUI();
  } else if (e.target.matches(".add-box-shadow")) {
    addBoxShadow();
  } else if (e.target.matches(".thumbnail-label")) {
    const parent = e.target.parentElement;
    console.log(+parent.dataset.index);
    activeIndex = +parent.dataset.index;
    activateThumbnail(parent);
    updateInputValues();
  } else if (e.target.matches(".del-shadow")) {
    if (boxShadows.length > 1) {
      removeBoxShadow(e.target.parentElement.dataset.index);
    }
  } else if (e.target.matches(".shadow-toggle")) {
    e.target.classList.toggle("active");
    toggleShadow(e.target.dataset.index);
  }
});

document.addEventListener("change", (e) => {
  if (e.target.matches(".input-control")) {
    const { id, value } = e.target;
    boxShadows[activeIndex][[id]] = value;
    updateUI();
  }
});

document.addEventListener("input", (e) => {
  if (e.target.matches(".input-control")) {
    updateSliderProgress(e.target);
  }
});
