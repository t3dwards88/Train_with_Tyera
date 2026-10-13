(function () {
  var STORAGE_KEY = 'reset-toolkit-unlocked';

  function unlock() {
    document.body.style.visibility = 'visible';
  }

  function alreadyUnlocked() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'yes';
    } catch (e) {
      return false;
    }
  }

  function buildOverlay() {
    var overlay = document.createElement('div');
    overlay.className = 'gate-overlay';
    overlay.innerHTML =
      '<div class="gate-card">' +
        '<h2>Enter access code</h2>' +
        '<p class="sub">This beta is invite-only. Enter the code you were given to continue.</p>' +
        '<div class="field gate-input-wrap">' +
          '<input type="password" id="gateInput" placeholder="Access code" autocomplete="off">' +
          '<button type="button" id="gateToggle" class="gate-toggle">Show</button>' +
        '</div>' +
        '<p class="error-msg" id="gateError">That code didn\'t match. Try again.</p>' +
        '<button type="button" id="gateSubmit" class="btn-primary">Unlock</button>' +
      '</div>';
    document.body.appendChild(overlay);

    var input = document.getElementById('gateInput');
    var error = document.getElementById('gateError');
    var submitBtn = document.getElementById('gateSubmit');

    function attempt() {
      var entered = input.value.trim();
      if (entered && typeof RESET_TOOLKIT_CONFIG !== 'undefined' && entered === RESET_TOOLKIT_CONFIG.PASSCODE) {
        try { localStorage.setItem(STORAGE_KEY, 'yes'); } catch (e) {}
        overlay.remove();
      } else {
        error.classList.add('show');
      }
    }

    var toggleBtn = document.getElementById('gateToggle');
    toggleBtn.addEventListener('click', function () {
      var showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      toggleBtn.textContent = showing ? 'Show' : 'Hide';
      input.focus();
    });

    submitBtn.addEventListener('click', attempt);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') attempt();
      error.classList.remove('show');
    });
    input.focus();
  }

  function init() {
    if (alreadyUnlocked()) {
      unlock();
      return;
    }
    buildOverlay();
    unlock();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
