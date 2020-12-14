/*SEARCH BY USING A CITY NAME (e.g. Dhaka) OR A COMMA-SEPARATED CITY NAME ALONG WITH THE COUNTRY CODE (e.g. Dhaka, BD)*/
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
/**PUT YOUR OWN KEY HERE - THIS MIGHT NOT WORK IF WE USE INVALID API KEY
*SUBSCRIBE HERE: https://home.openweathermap.org/users/sign_up
* WHEN WE SIGNED UP THEN WE'LL GET AN API KEY THAT WE CAN USE TO GET WEATHER UPDATE
*/
const apiKey = "35e374f14e1fb5678b850b8ccf0d17c9"; // Personal API keys
/**
 * USE ADDEVENTLISTENER AND MAKE A FUNCTION WITH EVENT WHEREAS WE CAN PUT OUR EXPECTED CITY
 * CITY NAME MUST BE VALID AND RIGHT FORMAT
 */
form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  /**
   * CHECK OUT IF THERE'S ALREADY A CITY INTO OUR LIST
   * WE USED ARRAYLIST 
   */
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
     
      /*DHAKA, BD*/
      if (inputVal.includes(",")) {
      
      /**
       * INVALID COUNTRY CODE IF WE DON'T USE PROPER COUNTRY CODE, 
       * FOR INSTANCE: DHAKA, DHHH-> SO WE KEEP ONLY THE FIRST PART OF INPUTVALUE*/
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        //DHAKA
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });
    /**
     * IF WE PUT THE SAME INPUTVAL WHERE WE ALREADY GOT THE RESULT
     * THEN OUTPUT WILL SHOW "YOU ALREADY KNOW THE WEATHER FOR THAT SPECIFIC CITY THAT ALREADY SHOWN"
     */
    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...otherwise be more specific by providing the country code as well 😉`;
      form.reset();
      input.focus();
      return;
    }
  }

  //AJAX HERE
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
  /**
   * HERE WE WILL FETCH JSON DATA WHEREAS WE WILL GET THE ICON THAT COLLECTED FROM AMAZONAWS.COM
   * WE'LL GET THE CITY'S TEMPARATURE WITH FLOOR, WE'LL NOT SHOW THE FRACTION OF THE WEATHER LIKE 23.5 C
   * WITH COUNTRY AND CITY'S WEATHER DESCRIPTION LIKE IS IT GLOMY OR SUNNY OR HAZY OR PARTLY COULDY ETC ETC
   */
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
      }.svg`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
      }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
      li.innerHTML = markup;
      list.appendChild(li);
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});