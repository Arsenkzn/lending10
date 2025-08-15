document.addEventListener("DOMContentLoaded", function () {
  // Получаем все элементы
  const sliders = document.querySelectorAll(".budget-slider");
  const budgetValue = document.getElementById("budget-value");
  const gdpValue = document.getElementById("gdp-value");
  const opinionValue = document.getElementById("opinion-value");
  const debtValue = document.getElementById("debt-value");
  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popup-title");
  const popupMessage = document.getElementById("popup-message");
  const eventCards = document.querySelectorAll(".event-card");

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

  // Закрытие по клику на крестик
  document.querySelector(".popup-close").addEventListener("click", hidePopup);

  // Закрытие по клику вне попапа
  popup.addEventListener("click", function (e) {
    if (e.target === popup) {
      hidePopup();
    }
  });

  // Инициализируем общий бюджет
  let totalBudget = 5000; // 5.00T в миллиардах
  let gdp = 25000; // 25.00T
  let publicOpinion = 30; // 30.00T
  let nationalDebt = 30000; // 30.00T

  // Функция для форматирования числа в формат с T (триллионы)
  function formatNumber(num) {
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}T`;
    }
    return `$${num.toFixed(2)}B`;
  }

  // Обновляем значения на панели
  function updateHUD() {
    budgetValue.textContent = formatNumber(totalBudget);
    gdpValue.textContent = formatNumber(gdp);
    opinionValue.textContent = publicOpinion.toFixed(2);
    debtValue.textContent = formatNumber(nationalDebt);
  }

  // Обработчики событий для слайдеров
  sliders.forEach((slider) => {
    const valueDisplay = slider.nextElementSibling;

    // Устанавливаем начальное значение
    valueDisplay.textContent = slider.value + "%";

    // Обработчик изменения слайдера
    slider.addEventListener("input", function () {
      valueDisplay.textContent = this.value + "%";

      // Пересчитываем бюджет (упрощенная логика)
      const totalPercentage = Array.from(sliders).reduce(
        (sum, s) => sum + parseInt(s.value),
        0
      );

      // Нормализуем значения, чтобы сумма была 100%
      if (totalPercentage !== 100) {
        const ratio = 100 / totalPercentage;
        sliders.forEach((s) => {
          s.value = Math.round(s.value * ratio);
          s.nextElementSibling.textContent = s.value + "%";
        });
      }

      // Обновляем показатели (упрощенная модель)
      totalBudget = 5000 + (Math.random() * 100 - 50);
      gdp = 25000 + parseInt(sliders[3].value) * 50; // Инфраструктура влияет на GDP
      publicOpinion =
        30 +
        (parseInt(sliders[1].value) / 10 - 2) +
        (parseInt(sliders[2].value) / 10 - 2);
      nationalDebt = 30000 + (5000 - totalBudget);

      updateHUD();
    });
  });

  // Обработчики событий для карточек событий
  eventCards.forEach((card) => {
    card.addEventListener("click", function () {
      const eventTitle = this.querySelector(".event-title").textContent;

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

      showPopup(eventTitle, message);

      // Пример влияния события на бюджет (оставьте вашу существующую логику)
      if (eventTitle === "Financial Crisis 2008") {
        totalBudget -= 1000;
        gdp -= 5000;
        publicOpinion -= 5;
        nationalDebt += 2000;
      } else if (eventTitle === "Pandemic COVID-19") {
        sliders[1].value = Math.min(100, parseInt(sliders[1].value) + 15);
        sliders[1].nextElementSibling.textContent = sliders[1].value + "%";
        totalBudget += 500;
        nationalDebt += 1000;
      } else if (eventTitle === "Oil Price Surge") {
        gdp += 2000;
        publicOpinion -= 2;
      }

      updateHUD();
    });
  });

  // Инициализация HUD
  updateHUD();
});
