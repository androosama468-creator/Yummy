const row = document.querySelector(".row");

function showLoader() {
  document.getElementById("loaderContainer").classList.remove("d-none");
}

function hideLoader() {
  document.getElementById("loaderContainer").classList.add("d-none");
}


async function fetchAPI(url) {
  showLoader();
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } finally {
    hideLoader();
  }
}


function displayMeals(meals) {
  let html = "";

  meals.forEach((meal) => {
    html += `
      <div class="col-md-3 pt-3">
        <div class="meal-card position-relative rounded-2 cursor-pointer overflow-hidden " data-id="${meal.idMeal}">
          <img src="${meal.strMealThumb}" class="d-block w-100 rounded" alt="">
          <div class="meal-contant position-absolute d-flex align-items-center justify-content-center text-black p-2">${meal.strMeal}</div>
        </div>
      </div>
    `
  });
  row.innerHTML = html;

  document.querySelectorAll(".meal-card").forEach((card) => {
    card.addEventListener("click", () => loadMealDetails(card.dataset.id));
  });
}

async function loadMealDetails(id) {
  const data = await fetchAPI(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const meal = data.meals[0];
  let ingredients = "";
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim() !== "") {
      ingredients += `<li>${ing}${meas ? " — " + meas : ""}</li>`;
    }
  }
  row.innerHTML = `
        <div class="col-12 text-white text-start">
            <h2>${meal.strMeal}</h2>
            <div class="d-flex gap-3 align-items-start flex-wrap">
                <img src="${meal.strMealThumb}" class="rounded mb-3" style="max-width:400px">
                <div style="flex:1">
                  <h4>Instructions</h4>
                  <p>${meal.strInstructions}</p>
                </div>
            </div>
            <h4>Ingredients</h4>
            <ul>${ingredients}</ul>
            <p><strong>Area:</strong> ${meal.strArea}</p>
            <p><strong>Category:</strong> ${meal.strCategory}</p>
            <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger">YouTube</a>
        </div>
    `;
}


async function loadRandomMeals() {
  let meals = [];
  for (let i = 0; i < 12; i++) {
    const data = await fetchAPI(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    meals.push(data.meals[0]);
  }
  displayMeals(meals);
}

document.getElementById("button1").addEventListener("click", () => {
  row.innerHTML = `
        <div class="col-12 d-flex align-items-center">
            <input id="searchName" class="form-control me-3 w-50" placeholder="Search by name...">
            <input id="searchLetter" maxlength="1" class="form-control w-50" placeholder="Search by first letter...">
        </div>
    `;
  document
    .getElementById("searchName")
    .addEventListener("change", async (e) => {
      const data = await fetchAPI(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${e.target.value}`
      );
      displayMeals(data.meals || []);
    });
  document
    .getElementById("searchLetter")
    .addEventListener("input", async (e) => {
      const value = e.target.value;
      if (value.length === 1) {
        const data = await fetchAPI(
          `https://www.themealdb.com/api/json/v1/1/search.php?f=${value}`
        );
        displayMeals(data.meals || []);
      }
    });
});

document.getElementById("button2").addEventListener("click", async () => {
  const data = await fetchAPI(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  let html = "";
  data.categories.forEach((cat) => {
    html +=
      `
      <div class="col-md-3 pt-3">
        <div class="category-card position-relative bg-dark rounded-2 cursor-pointer overflow-hidden" data-cat="${cat.strCategory}">
          <img src="${cat.strCategoryThumb}" class="d-block w-100 rounded" alt="">
          <div class="meal-contant position-absolute d-flex align-items-center justify-content-center text-black p-2">${cat.strCategory}</div>
        </div>
      </div>
      `;
  });
  row.innerHTML = html;
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", async () => {
      const cat = card.dataset.cat;
      const mealsData = await fetchAPI(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
      );
      displayMeals(mealsData.meals);
    });
  });
});

document.getElementById("button3").addEventListener("click", async () => {
  const data = await fetchAPI(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  let html = "";
  data.meals.forEach((area) => {
    html += `
        <div class="col-3">
            <div class="p-3 bg-dark text-white area-card cursor-pointer" data-area="${area.strArea}">
                <i class="fs-2 mb-2 fa-solid fa-location-dot"></i>    
                <h4>${area.strArea}</h4>
            </div>
        </div>`;
  });
  row.innerHTML = html;
  document.querySelectorAll(".area-card").forEach((card) => {
    card.addEventListener("click", async () => {
      const area = card.dataset.area;
      const mealsData = await fetchAPI(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
      );
      displayMeals(mealsData.meals);
    });
  });
});

document.getElementById("button4").addEventListener("click", async () => {
  const data = await fetchAPI(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  let html = "";
  data.meals.slice(0, 50).forEach((ing) => {
    html += `
        <div class="col-3">
            <div class="p-3 bg-dark text-white ing-card cursor-pointer" data-ing="${ing.strIngredient}">
                <img src="${ing.strThumb}" class="d-block w-100 rounded " alt="">
                <h5>${ing.strIngredient}</h5>
                <p>${ing.strDescription ? ing.strDescription.slice(0, 50) : ""}...</p>
            </div>
        </div>`;
  });
  row.innerHTML = html;
  document.querySelectorAll(".ing-card").forEach((card) => {
    card.addEventListener("click", async () => {
      const ing = card.dataset.ing;
      const mealsData = await fetchAPI(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`
      );
      displayMeals(mealsData.meals || []);
    });
  });
});

document.getElementById("button5").addEventListener("click", () => {
  row.innerHTML = `
    <div class="col-6 offset-3 text-white">
        <div class="mb-2">
            <input id="name" class="form-control" placeholder="Name">
            <small id="nameError" class="text-danger d-none">Name must be at least 3 letters.</small>
        </div>
        <div class="mb-2">
            <input id="email" class="form-control" placeholder="Email">
            <small id="emailError" class="text-danger d-none">Invalid email format.</small>
        </div>
        <div class="mb-2">
            <input id="phone" class="form-control" placeholder="Phone">
            <small id="phoneError" class="text-danger d-none">Phone must start with 010,011,012,015 and be 11 digits.</small>
        </div>
        <div class="mb-2">
            <input id="age" class="form-control" placeholder="Age">
            <small id="ageError" class="text-danger d-none">Age must be between 1 and 99.</small>
        </div>
        <div class="mb-2">
            <input id="password" class="form-control" placeholder="Password" type="password">
            <small id="passwordError" class="text-danger d-none">Password must be at least 6 characters.</small>
        </div>
        <div class="mb-2">
            <input id="repassword" class="form-control" placeholder="Re-enter password" type="password">
            <small id="repasswordError" class="text-danger d-none">Passwords do not match.</small>
        </div>
        <button id="submitBtn" class="btn btn-danger mt-3 px-md-5" disabled>Submit</button>
    </div>
  `;

  const inputs = {};
  const errors = {};
  ["name", "email", "phone", "age", "password", "repassword"].forEach(id => {
    inputs[id] = document.getElementById(id);
    errors[id] = document.getElementById(id + "Error");
  });

  const regex = {
    name: /^[A-Za-z ]{3,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^01[0125][0-9]{8}$/,
    age: /^[1-9][0-9]?$/,
    password: /^[A-Za-z0-9]{6,}$/
  };

  function toggle(input, isValid, error) {
    input.classList.toggle("is-valid", isValid);
    input.classList.toggle("is-invalid", !isValid);
    error.classList.toggle("d-none", isValid);
  }

  function validate() {
    let valid = true;
    toggle(inputs.name, regex.name.test(inputs.name.value), errors.name);
    toggle(inputs.email, regex.email.test(inputs.email.value), errors.email);
    toggle(inputs.phone, regex.phone.test(inputs.phone.value), errors.phone);
    toggle(inputs.age, regex.age.test(inputs.age.value), errors.age);
    toggle(inputs.password, regex.password.test(inputs.password.value), errors.password);

    const passwordsMatch =
      inputs.password.value.trim() !== "" &&
      inputs.password.value === inputs.repassword.value;

    toggle(inputs.repassword, passwordsMatch, errors.repassword);

    valid =
      regex.name.test(inputs.name.value) &&
      regex.email.test(inputs.email.value) &&
      regex.phone.test(inputs.phone.value) &&
      regex.age.test(inputs.age.value) &&
      regex.password.test(inputs.password.value) &&
      passwordsMatch;
    document.getElementById("submitBtn").disabled = !valid;
  }

  Object.values(inputs).forEach(input => {
    input.addEventListener("input", validate);
  });

  document.getElementById("submitBtn").addEventListener("click", (e) => {
    e.preventDefault();
    row.innerHTML = `
      <div class="col-12 text-center text-white">
          <h2>Data submitted successfully!</h2>
          <p>Name: ${inputs.name.value}</p>
          <p>Email: ${inputs.email.value}</p>
          <p>Phone: ${inputs.phone.value}</p>
          <p>Age: ${inputs.age.value}</p>
      </div>
    `;
  });
});


loadRandomMeals();
