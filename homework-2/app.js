const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selected = services.filter(function (service) {
    return (service.id === 'guide' && guideChecked) ||
      (service.id === 'audio' && audioChecked) ||
      (service.id === 'catalog' && catalogChecked);
  });

  const items = selected.map(function (service) {
    const { title, price } = service;
    return { title: title.trim(), price: price };
  });

  const total = items.reduce(function (sum, item) {
    return sum + item.price;
  }, 0);

  return { count: items.length, total: total, items: items };
}

let data;
try {
  data = JSON.parse(sourceJson);
} catch (error) {
  const dataError = document.querySelector('#data-error');
  dataError.textContent = 'Ошибка данных.';
  dataError.hidden = false;
}

if (data) {
  document.querySelector('#event-title').textContent = data.event.title;
  document.querySelector('#event-date').textContent = data.event.date;
  document.querySelector('#event-place').textContent = data.event.place;
  document.querySelector('#event-description').textContent = data.event.description;

  const program = document.querySelector('#program');
  const showProgram = document.querySelector('#show-program');
  showProgram.addEventListener('click', function () {
    program.innerHTML = data.event.meeting;
    program.hidden = false;
  });

  const form = document.querySelector('#service-form');
  const choiceError = document.querySelector('#choice-error');
  const result = document.querySelector('#result');
  const reportJson = document.querySelector('#report-json');
  form.hidden = false;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const guideChecked = document.querySelector('#guide').checked;
    const audioChecked = document.querySelector('#audio').checked;
    const catalogChecked = document.querySelector('#catalog').checked;
    const report = buildReport(data.services, guideChecked, audioChecked, catalogChecked);

    if (report.count === 0) {
      choiceError.textContent = 'Выберите хотя бы одну услугу.';
      choiceError.hidden = false;
      result.hidden = true;
      reportJson.hidden = true;
      return;
    }

    choiceError.hidden = true;
    let resultText = `Выбрано услуг: ${report.count}<br>Итого: ${report.total} руб.`;
    for (const item of report.items) {
      resultText = resultText + '<br>' + item.title;
    }
    result.innerHTML = resultText;
    result.hidden = false;

    const json = JSON.stringify(report);
    JSON.parse(json);
    reportJson.textContent = json;
    reportJson.hidden = false;
  });
}
