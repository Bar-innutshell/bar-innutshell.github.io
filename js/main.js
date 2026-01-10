// Toggle & Responsive Navigation
const navSlide = () => {
  const burger = document.querySelector(".burger");
  const navLists = document.querySelector("nav");

  burger.addEventListener("click", () => {
    // Toggle nav list and burger class
    navLists.classList.toggle("nav-active");
    burger.classList.toggle("toggle-burger");
  });
};

navSlide();

window.onbeforeunload = () => {
  for (const form of document.getElementsByTagName("form")) {
    form.reset();
  }
};


// Check if portfolio tags overflow and need scrolling
const checkTagsOverflow = () => {
  const tagsContainers = document.querySelectorAll('.portfolio-tags');

  tagsContainers.forEach(container => {
    const inner = container.querySelector('.portfolio-tags-inner');
    if (inner && inner.scrollWidth > container.clientWidth) {
      container.classList.add('scrollable');

      // Duplicate content for seamless infinite scroll if not already duplicated
      if (!inner.dataset.duplicated) {
        const originalContent = inner.innerHTML;
        inner.innerHTML = originalContent + originalContent;
        inner.dataset.duplicated = 'true';
      }
    } else {
      container.classList.remove('scrollable');
    }
  });
};

// Run on load and resize
window.addEventListener('load', checkTagsOverflow);
window.addEventListener('resize', checkTagsOverflow);