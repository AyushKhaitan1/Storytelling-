// Story choices and outcomes
const storyChoices = {
  journey: [
      { 
          text: "Follow the faint whispers", 
          outcome: "The whispers lead you to a hidden path through the dense forest" 
      },
      { 
          text: "Trust your instincts", 
          outcome: "Your intuition guides you towards a clearing with an ancient stone marker" 
      }
  ],
  entrance: [
      { 
          text: "Examine the cryptic symbols", 
          outcome: "The symbols reveal a warning about the cave's guardians" 
      },
      { 
          text: "Listen to the cave's breath", 
          outcome: "The chilling breath carries faint echoes of ancient chants" 
      }
  ],
  discovery: [
      { 
          text: "Study the ancient carvings", 
          outcome: "The carvings depict a map of the cave's inner chambers" 
      },
      { 
          text: "Follow the sound of dripping water", 
          outcome: "The water leads you to a hidden underground stream" 
      }
  ],
  encounter: [
      { 
          text: "Ask about the cave's history", 
          outcome: "The keeper reveals the cave's role in ancient rituals" 
      },
      { 
          text: "Inquire about the carvings", 
          outcome: "The keeper explains the carvings tell of a great prophecy" 
      }
  ]
};

// Array of possible destiny outcomes
const destinies = [
  "You will become a great leader, but lose those closest to you.",
  "You will find peace in solitude, but always wonder what could have been.",
  "Your path will be filled with challenges, but you will emerge stronger.",
  "You will discover a hidden talent that changes your life forever.",
  "Your choices will impact many, but the burden will be heavy."
];

// Get references to the button and destiny text elements
const revealButton = document.getElementById('reveal-button');
const destinyText = document.getElementById('destiny-text');

// Add click event listener to the reveal button
revealButton.addEventListener('click', () => {
  const randomDestiny = destinies[Math.floor(Math.random() * destinies.length)];
  destinyText.textContent = randomDestiny;
  destinyText.classList.remove('hidden');

  // Disable the button after revealing the destiny
  revealButton.disabled = true;
  revealButton.textContent = "Destiny Revealed";
  revealButton.style.backgroundColor = "#666";
});

// Add choice buttons and story progression
function createChoiceButtons(chapterId) {
  const choices = storyChoices[chapterId];
  if (!choices) return '';

  return choices.map(choice => `
      <button class="story-choice" 
              data-outcome="${choice.outcome}"
              aria-label="${choice.text}" 
              role="button" 
              aria-pressed="false">
          ${choice.text}
      </button>
  `).join('');
}

// Add enhanced scroll-based animations and choices
const chapters = document.querySelectorAll('.chapter');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          const content = entry.target.querySelector('.chapter-content');
          content.style.animation = 'fadeUp 1s ease-out';
      } else {
          entry.target.classList.remove('visible');
      }
  });
}, {
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px'
});

chapters.forEach((chapter, index) => {
  observer.observe(chapter);
  chapter.style.transitionDelay = `${index * 0.2}s`;

  // Add choice buttons to chapter content
  const chapterId = chapter.id;
  const choiceButtons = createChoiceButtons(chapterId);
  if (choiceButtons) {
      const choiceContainer = document.createElement('div');
      choiceContainer.className = 'choice-container';
      choiceContainer.innerHTML = choiceButtons;
      chapter.querySelector('.chapter-content').appendChild(choiceContainer);
  }
});

// Handle choice selection
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('story-choice')) {
      const outcome = e.target.dataset.outcome;
      const outcomeElement = document.createElement('p');
      outcomeElement.className = 'choice-outcome';
      outcomeElement.textContent = outcome;
      e.target.parentElement.appendChild(outcomeElement);

      // Disable all choices in this chapter
      e.target.parentElement.querySelectorAll('.story-choice').forEach(button => {
          button.disabled = true;
          button.setAttribute('aria-pressed', 'true');
      });
  }
});

// Add continuous scroll animation with requestAnimationFrame
let lastScrollY = window.scrollY;

function parallaxEffect() {
  const scrollPosition = window.scrollY;
  const hero = document.querySelector('.hero');

  if (Math.abs(scrollPosition - lastScrollY) > 10) {
      const heroContent = document.querySelector('.hero-content');
      const opacity = 1 - (scrollPosition / 500);
      heroContent.style.opacity = Math.max(opacity, 0);

      hero.style.backgroundPositionY = `calc(50% + ${scrollPosition * 0.3}px)`;
      lastScrollY = scrollPosition;
  }

  requestAnimationFrame(parallaxEffect);
}

requestAnimationFrame(parallaxEffect);

// Add smooth scrolling behavior for better navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
  });
});

// Add fade-in animation when page loads
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
      document.body.style.transition = 'opacity 1s ease';
      document.body.style.opacity = '1';
  }, 100);
});

// Scroll-triggered letter-by-letter text animation
function typeEffect(element, text, speed = 30) {
  let index = 0;
  element.textContent = ""; // Clear existing text
  
  function type() {
      if (index < text.length) {
          element.textContent += text[index];
          index++;
          setTimeout(type, speed);
      }
  }

  type();
}

// Use Intersection Observer to detect when a section becomes visible
const textObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          const paragraphs = entry.target.querySelectorAll('.chapter-content p');
          
          paragraphs.forEach((paragraph, i) => {
              const text = paragraph.dataset.text || paragraph.textContent;
              paragraph.dataset.text = text; // Store original text
              paragraph.textContent = ""; // Clear text before animation
              
              setTimeout(() => typeEffect(paragraph, text), i * 300); // Delay each paragraph slightly
          });

          textObserver.unobserve(entry.target); // Stop observing once animation starts
      }
  });
}, {
  threshold: 0.5, // Trigger when at least 50% of the section is visible
  rootMargin: '0px 0px -50px 0px'
});

// Observe all chapters for text animation
document.querySelectorAll('.chapter').forEach(chapter => textObserver.observe(chapter));