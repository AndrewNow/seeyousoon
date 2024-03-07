 import marquee from "vanilla-marquee";

  document.addEventListener("DOMContentLoaded", function () {
    const titleMarquees = document.querySelectorAll("#title-marquee");

    let windowWidth = window.innerWidth
    titleMarquees.forEach((el) => {
      new marquee(el, {
        duplicated: true,
        gap: 30,
        speed: 100,
        // pauseOnHover: true,
        startVisible: true,
        recalcResize: false,
      });
      window.addEventListener('resize', () => {
        if (window.innerWidth != windowWidth) {
          windowWidth = window.innerWidth
          marquee.refresh()
        }
      })
    });

    const pastEventsMarquees = document.querySelectorAll("#pastEvents-marquee");
    // Calculate marquee speed based on the number of images
    const calculateMarqueeSpeed = (imageCount) => {
      // Adjust these values as needed to control the speed based on the image count
      const minSpeed = 10; // Lower bound speed
      const maxSpeed = 100; // Upper bound speed

      // Calculate the speed based on the image count
      const calculatedSpeed =
        minSpeed + (maxSpeed - minSpeed) * (imageCount / 10);

      return calculatedSpeed;
    };

    // console.log("pastEventsMarquees", pastEventsMarquees);
  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

    if (window.innerWidth > 576 || !isTouchDevice) {
      pastEventsMarquees.forEach((el) => {
        const marqueeSpeed = calculateMarqueeSpeed(
          el.getAttribute("data-image-count")
        );
        const index = el.getAttribute('data-index')
        
        function isOddOrEven(index) {
          if (index % 2 === 0) {
            return true;
          } else {
            return false;
          }
        }
        
        const isOdd = isOddOrEven(index);

        const direction = isOdd ? "left" : "right"

        // const imageCount = el.getAttribute("data-image-count");
        const speed = marqueeSpeed ? marqueeSpeed : 50;
        new marquee(el, {
          duplicated: true,
          gap: 0,
          speed: speed,
          direction: direction,
          // pauseOnHover: true,
          startVisible: true,
          // recalcResize: true,
          recalcResize: false,
        });
      })
    };
  });