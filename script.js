document.addEventListener("DOMContentLoaded", function () {
  // Получаем все элементы
  const budgetBlocks = document.querySelectorAll(".budget-block");
  const budgetValue = document.getElementById("budget-value");
  const gdpValue = document.getElementById("gdp-value");
  const opinionValue = document.getElementById("opinion-value");
  const debtValue = document.getElementById("debt-value");
  const moodIcon = document.getElementById("mood-icon");
  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popup-title");
  const popupMessage = document.getElementById("popup-message");
  const eventCards = document.querySelectorAll(".event-card");

  // Инициализируем значения бюджета
  let budgetValues = {
    defense: 20,
    healthcare: 20,
    education: 20,
    infrastructure: 20,
    tax: 20,
  };

  // Инициализируем общие показатели
  let totalBudget = 5000; // 5.00T в миллиардах
  let gdp = 25000; // 25.00T
  let publicOpinion = 30; // 30.00%
  let nationalDebt = 30000; // 30.00T

  // Функция для форматирования числа в формат с T (триллионы)
  function formatNumber(num) {
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}T`;
    }
    return `$${num.toFixed(2)}B`;
  }

  // Функция обновления смайлика настроения
  function updateMoodIcon() {
    if (publicOpinion >= 33) {
      moodIcon.textContent = "😊";
      moodIcon.style.color = "green";
    } else if (publicOpinion >= 30) {
      moodIcon.textContent = "😐";
      moodIcon.style.color = "yellow";
    } else {
      moodIcon.textContent = "😠";
      moodIcon.style.color = "red";

      // Показываем попап с жалобой, если настроение слишком низкое
      if (publicOpinion < 26 && !popup.classList.contains("active")) {
        showPopup(
          "Public Opinion",
          "What are you doing? Life has become unbearable!"
        );
      }
    }
  }

  // Функция показа попапа
  function showPopup(title, message) {
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    popup.classList.add("active");
  }

  // Функция скрытия попапа
  function hidePopup() {
    popup.classList.remove("active");
  }

  // Функция тряски экрана
  function shakeScreen() {
    document.body.classList.add("shake");
    setTimeout(() => {
      document.body.classList.remove("shake");
    }, 500);
  }

  // Закрытие по клику на крестик
  document.querySelector(".popup-close").addEventListener("click", hidePopup);

  // Закрытие по клику вне попапа
  popup.addEventListener("click", function (e) {
    if (e.target === popup) {
      hidePopup();
    }
  });

  // Обновляем значения на панели
  function updateHUD() {
    budgetValue.textContent = formatNumber(totalBudget);
    gdpValue.textContent = formatNumber(gdp);
    opinionValue.textContent = publicOpinion.toFixed(2) + "%";
    debtValue.textContent = formatNumber(nationalDebt);
    updateMoodIcon();
  }

  // Пересчитываем бюджет и показатели
  function recalculateBudget() {
    // Проверяем, что сумма равна 100%
    const total = Object.values(budgetValues).reduce(
      (sum, val) => sum + val,
      0
    );
    if (total !== 100) {
      const ratio = 100 / total;
      for (const key in budgetValues) {
        budgetValues[key] = Math.round(budgetValues[key] * ratio);
      }
      updateSliderValues();
    }

    // Обновляем показатели (упрощенная модель)
    totalBudget = 5000 + (Math.random() * 100 - 50);
    gdp = 25000 + budgetValues.infrastructure * 50;
    publicOpinion =
      30 +
      (budgetValues.healthcare / 10 - 2) +
      (budgetValues.education / 10 - 2);
    nationalDebt = 30000 + (5000 - totalBudget);

    updateHUD();
  }

  // Обновляем значения на слайдерах
  function updateSliderValues() {
    budgetBlocks.forEach((block) => {
      const category = block.classList[1];
      const valueDisplay = block.querySelector(".slider-value");
      valueDisplay.textContent = budgetValues[category] + "%";
    });
  }

  // Обработчики событий для кнопок +/-
  budgetBlocks.forEach((block) => {
    const category = block.classList[1];
    const minusBtn = block.querySelector(".minus");
    const plusBtn = block.querySelector(".plus");

    minusBtn.addEventListener("click", () => {
      if (budgetValues[category] > 0) {
        budgetValues[category] -= 5;
        recalculateBudget();
      }
    });

    plusBtn.addEventListener("click", () => {
      if (budgetValues[category] < 100) {
        budgetValues[category] += 5;
        recalculateBudget();
      }
    });
  });

  // Обработчики событий для карточек событий
  eventCards.forEach((card) => {
    card.addEventListener("click", function () {
      const eventTitle = this.querySelector(".event-title").textContent;

      // Трясем экран
      shakeScreen();

      // Создаем разные сообщения для разных событий
      let message = "";
      switch (eventTitle) {
        case "Financial Crisis 2008":
          message =
            "Global financial crisis! Budget reduced by $1 trillion, GDP fell by $5 trillion.";
          break;
        case "Pandemic COVID-19":
          message = "Global pandemic! Healthcare costs have increased.";
          break;
        case "Oil Price Surge":
          message = "Sharp rise in oil prices! GDP increased by $2 trillion.";
          break;
        default:
          message = "Event activated!";
      }

      // Показываем попап через небольшой таймаут для синхронизации с анимацией
      setTimeout(() => {
        showPopup(eventTitle, message);
      }, 300);

      // Влияние события на бюджет
      if (eventTitle === "Financial Crisis 2008") {
        totalBudget -= 1000;
        gdp -= 5000;
        publicOpinion -= 5;
        nationalDebt += 2000;
      } else if (eventTitle === "Pandemic COVID-19") {
        budgetValues.healthcare = Math.min(100, budgetValues.healthcare + 15);
        totalBudget += 500;
        nationalDebt += 1000;
      } else if (eventTitle === "Oil Price Surge") {
        gdp += 2000;
        publicOpinion -= 2;
      }

      updateHUD();
      updateSliderValues();
    });
  });

  // Инициализация HUD
  updateHUD();
});
