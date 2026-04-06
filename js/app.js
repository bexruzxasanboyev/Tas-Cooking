document.addEventListener("DOMContentLoaded", function () {
    var ctaButtons = document.querySelectorAll(".webinar-cta");
    var modal = document.getElementById("registrationModal");
    var closeBtn = document.getElementById("closeModalBtn");
    var overlay = document.querySelector(".homeModalOverlay");
    var form = document.getElementById("registrationForm");
    var nameInput = document.getElementById("name");
    var nameError = document.getElementById("nameError");
    var phoneInput = document.getElementById("phone");
    var phoneError = document.getElementById("phoneError");
    var directionInput = document.getElementById("modalDirection");
    var directionError = document.getElementById("directionError");
    var incomeError = document.getElementById("incomeError");
    var submitBtn = document.getElementById("submitBtn");
    var selectedCountryBtn = document.getElementById("selectedCountry");
    var selectedCountryCode = document.getElementById("selectedCountryCode");
    var countryDropdown = document.getElementById("countryDropdown");
    var dropdownIcon = document.getElementById("dropdownIcon");

    var phoneFormatter = setupPhoneFormatter({
        inputEl: phoneInput,
        codeLabelEl: selectedCountryCode,
        dropdownEl: countryDropdown,
        triggerEl: selectedCountryBtn,
        iconEl: dropdownIcon,
        errorEl: phoneError,
        defaultCode: "+998"
    });

    var isOpen = false;
    var scrollPos = 0;

    function openModal() {
        if (!modal) return;
        isOpen = true;
        scrollPos = window.scrollY;
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
        nameError.style.display = "none";
        phoneError.style.display = "none";
        if (directionError) directionError.style.display = "none";
        if (incomeError) incomeError.style.display = "none";
    }

    function closeModal() {
        if (!modal || !isOpen) return;
        isOpen = false;
        modal.style.display = "none";
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        window.scrollTo(0, scrollPos);
    }

    ctaButtons.forEach(function (btn) {
        btn.addEventListener("click", openModal);
    });
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (overlay) overlay.addEventListener("click", closeModal);

    setTimeout(function () {
        if (!isOpen) openModal();
    }, 10000);

    document.querySelectorAll(".title, .event__list__title, .text span, .expert__img").forEach(function (el) {
        el.style.cursor = "pointer";
        el.addEventListener("click", openModal);
    });

    // Hide errors on input
    if (nameInput) nameInput.addEventListener("input", function () { nameError.style.display = "none"; });
    if (directionInput && directionError) {
        directionInput.addEventListener("input", function () { directionError.style.display = "none"; });
    }
    var modalRadios = form.querySelectorAll('input[name="modalIncome"]');
    for (var i = 0; i < modalRadios.length; i++) {
        modalRadios[i].addEventListener("change", function () {
            if (incomeError) incomeError.style.display = "none";
        });
    }

    // Form submit
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        var name = nameInput.value.trim();
        var phone = phoneInput.value.trim();
        var direction = directionInput ? directionInput.value.trim() : "";
        var incomeRadio = form.querySelector('input[name="modalIncome"]:checked');
        var income = incomeRadio ? incomeRadio.value : "";
        var hasError = false;

        // Ism
        if (!name) {
            nameError.style.display = "block";
            hasError = true;
        } else {
            nameError.style.display = "none";
        }

        // Telefon
        if (!phoneFormatter.validate(phone)) {
            phoneError.style.display = "block";
            hasError = true;
        } else {
            phoneError.style.display = "none";
        }

        // Yo'nalish
        if (!direction) {
            if (directionError) directionError.style.display = "block";
            hasError = true;
        } else {
            if (directionError) directionError.style.display = "none";
        }

        // Daromad
        if (!income) {
            if (incomeError) incomeError.style.display = "block";
            hasError = true;
        } else {
            if (incomeError) incomeError.style.display = "none";
        }

        if (hasError) return;

        submitBtn.textContent = "YUBORILMOQDA...";
        submitBtn.disabled = true;

        var now = new Date();
        var data = {
            Ism: name,
            TelefonRaqam: phoneFormatter.getCurrentCode() + " " + phone,
            Yonalish: direction,
            Daromad: income,
            SanaSoat: now.toLocaleDateString("uz-UZ") + " - " + now.toLocaleTimeString("uz-UZ")
        };

        localStorage.setItem("formData", JSON.stringify(data));
        window.location.href = "/thankYou.html";

        submitBtn.textContent = "DAVOM ETISH";
        submitBtn.disabled = false;
        nameInput.value = "";
        phoneInput.value = "";
        if (directionInput) directionInput.value = "";
        closeModal();
    });
});

// FAQ dropdowns
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".webinar-faq__dropdown").forEach(function (el) {
        var head = el.querySelector(".webinar-faq__dropdown__head");
        if (head) {
            head.addEventListener("click", function () {
                if (el.classList.contains("is-open")) {
                    el.classList.remove("is-open");
                    el.style.maxHeight = "80px";
                } else {
                    el.classList.add("is-open");
                    el.style.maxHeight = "200px";
                    var h = el.scrollHeight;
                    el.style.maxHeight = h + "px";
                }
            });
        }
    });
});

// Timer
document.addEventListener("DOMContentLoaded", function () {
    var timerEl = document.getElementById("timer");
    if (!timerEl) return;
    var seconds = 120;
    var interval = setInterval(function () {
        var m = Math.floor(seconds / 60);
        var s = seconds % 60;
        timerEl.textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
        if (seconds <= 0) clearInterval(interval);
        seconds--;
    }, 1000);
});
