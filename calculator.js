(function () {
  var form = document.getElementById('calcForm');
  var fastingSelect = document.getElementById('fasting');
  var customFastField = document.getElementById('customFastField');
  var customFastInput = document.getElementById('customFast');
  var errMsg = document.getElementById('errMsg');
  var results = document.getElementById('results');

  fastingSelect.addEventListener('change', function () {
    customFastField.hidden = fastingSelect.value !== 'custom';
  });

  function getFastingHours() {
    if (fastingSelect.value === 'custom') {
      var v = parseInt(customFastInput.value, 10);
      if (isNaN(v) || v < 0) v = 0;
      if (v > 23) v = 23;
      return v;
    }
    return parseInt(fastingSelect.value, 10);
  }

  function formatTime(totalMinutes) {
    var h = Math.floor(totalMinutes / 60) % 24;
    var m = Math.round(totalMinutes % 60);
    var period = h >= 12 ? 'PM' : 'AM';
    var h12 = h % 12;
    if (h12 === 0) h12 = 12;
    var mStr = m < 10 ? '0' + m : '' + m;
    return h12 + ':' + mStr + ' ' + period;
  }

  function splitProtein(total, meals) {
    var base = Math.floor(total / meals / 5) * 5;
    var amounts = [];
    var running = 0;
    for (var i = 0; i < meals; i++) {
      if (i === meals - 1) {
        amounts.push(Math.round(total - running));
      } else {
        amounts.push(base);
        running += base;
      }
    }
    return amounts;
  }

  function calculate(e) {
    e.preventDefault();

    var weightInput = document.getElementById('weight');
    var weight = parseFloat(weightInput.value);

    if (!weight || weight <= 0) {
      errMsg.classList.add('show');
      results.hidden = true;
      return;
    }
    errMsg.classList.remove('show');

    var multiplier = parseFloat(document.getElementById('goal').value);
    var meals = parseInt(document.getElementById('meals').value, 10);
    var fastingHours = getFastingHours();
    var windowHours = 24 - fastingHours;
    var startTimeStr = document.getElementById('startTime').value || '12:00';
    var startParts = startTimeStr.split(':');
    var startMinutes = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);

    var dailyProtein = Math.round(weight * multiplier);
    document.getElementById('dailyTotal').textContent = dailyProtein + 'g';
    document.getElementById('windowSummary').textContent =
      windowHours + ' hour' + (windowHours === 1 ? '' : 's') + ', starting ' + formatTime(startMinutes);

    var warningBox = document.getElementById('warningBox');
    var spacingHours = meals > 1 ? windowHours / (meals - 1) : 0;
    if (meals > 1 && spacingHours < 1) {
      warningBox.hidden = false;
      warningBox.textContent = meals + ' meals in a ' + windowHours + ' hour window puts meals less than an hour apart. Consider fewer meals or a longer eating window.';
    } else if (meals === 1 && windowHours > 2) {
      warningBox.hidden = false;
      warningBox.textContent = 'One meal is selected with a ' + windowHours + ' hour window. That window will mostly go unused unless more meals or snacks are added.';
    } else {
      warningBox.hidden = true;
    }

    var amounts = splitProtein(dailyProtein, meals);
    var mealList = document.getElementById('mealList');
    mealList.innerHTML = '';

    for (var i = 0; i < meals; i++) {
      var timeOffset = meals > 1 ? i * spacingHours * 60 : 0;
      var mealTime = startMinutes + timeOffset;
      var row = document.createElement('div');
      row.className = 'calc-meal-row';
      row.innerHTML =
        '<span class="meal-name">Meal ' + (i + 1) + ' <span class="meal-time">&mdash; ' + formatTime(mealTime) + '</span></span>' +
        '<span class="meal-grams">' + amounts[i] + 'g</span>';
      mealList.appendChild(row);
    }

    results.hidden = false;
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  form.addEventListener('submit', calculate);
})();
