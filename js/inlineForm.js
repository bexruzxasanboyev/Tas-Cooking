document.addEventListener("DOMContentLoaded", function () {
    var telInput = document.getElementById("inlineTel");
    var nameInput = document.getElementById("inlineName");
    var dirInput = document.getElementById("fr");
    var nameError = document.getElementById("inlineNameError");
    var telError = document.getElementById("inlineTelError");
    var dirError = document.getElementById("inlineDirError");
    var incomeError = document.getElementById("inlineIncomeError");
    var inlineForm = document.getElementById("inlineForm");
    if (!telInput || !inlineForm) return;

    // ===== PHONE FORMATTER (modaldagi kabi) =====
    var prefix = "+998 ";
    var groups = [2, 3, 2, 2];
    var maxDigits = 9;

    function extractDigits(val) {
        var allDigits = val.replace(/\D/g, "");
        if (allDigits.startsWith("998")) {
            allDigits = allDigits.slice(3);
        }
        if (allDigits.length > maxDigits) {
            allDigits = allDigits.slice(0, maxDigits);
        }
        return allDigits;
    }

    function formatPhone(digits) {
        if (digits.length > maxDigits) digits = digits.slice(0, maxDigits);
        var parts = [];
        var pos = 0;
        for (var i = 0; i < groups.length; i++) {
            if (pos >= digits.length) break;
            parts.push(digits.slice(pos, pos + groups[i]));
            pos += groups[i];
        }
        return parts.length ? prefix + parts.join(" ") : prefix;
    }

    function digitCountBeforeCursor(val, cursorPos) {
        var count = 0;
        var sub = val.slice(prefix.length, cursorPos);
        for (var i = 0; i < sub.length; i++) {
            if (/\d/.test(sub[i])) count++;
        }
        return count;
    }

    function cursorPosAfterDigitCount(formatted, digitCount) {
        var count = 0;
        for (var i = prefix.length; i < formatted.length; i++) {
            if (/\d/.test(formatted[i])) {
                count++;
                if (count === digitCount) return i + 1;
            }
        }
        return formatted.length;
    }

    telInput.addEventListener("input", function () {
        var cursorPos = telInput.selectionStart;
        var oldVal = telInput.value;
        var digitsBeforeCursor = digitCountBeforeCursor(oldVal, cursorPos);

        var digits = extractDigits(oldVal);
        var formatted = formatPhone(digits);
        telInput.value = formatted;

        var newCursor = cursorPosAfterDigitCount(formatted, digitsBeforeCursor);
        if (newCursor < prefix.length) newCursor = prefix.length;
        telInput.setSelectionRange(newCursor, newCursor);

        if (telError) telError.style.display = "none";
    });

    telInput.addEventListener("focus", function () {
        if (!telInput.value || telInput.value.trim() === "") {
            telInput.value = prefix;
            setTimeout(function () {
                telInput.setSelectionRange(prefix.length, prefix.length);
            }, 0);
        }
    });

    telInput.addEventListener("blur", function () {
        if (telInput.value.replace(/\D/g, "").length <= 3) {
            telInput.value = "";
        }
    });

    telInput.addEventListener("keydown", function (e) {
        var cursorPos = telInput.selectionStart;
        if ((e.key === "Backspace" || e.key === "ArrowLeft") && cursorPos <= prefix.length) {
            if (e.key === "Backspace") e.preventDefault();
        }
    });

    telInput.addEventListener("click", function () {
        if (telInput.selectionStart < prefix.length) {
            telInput.setSelectionRange(prefix.length, prefix.length);
        }
    });

    // ===== YOZGANDA ERROR YASHIRISH =====
    if (nameInput && nameError) {
        nameInput.addEventListener("input", function () {
            nameError.style.display = "none";
        });
    }
    if (dirInput && dirError) {
        dirInput.addEventListener("input", function () {
            dirError.style.display = "none";
        });
    }
    var radios = inlineForm.querySelectorAll('input[name="income"]');
    for (var i = 0; i < radios.length; i++) {
        radios[i].addEventListener("change", function () {
            if (incomeError) incomeError.style.display = "none";
        });
    }

    // ===== FORM SUBMIT =====
    inlineForm.addEventListener("submit", function (e) {
        e.preventDefault();

        var name = nameInput.value.trim();
        var phone = telInput.value.trim();
        var direction = dirInput.value.trim();
        var incomeRadio = inlineForm.querySelector('input[name="income"]:checked');
        var income = incomeRadio ? incomeRadio.value : "";
        var hasError = false;

        // Ism
        if (!name) {
            nameError.style.display = "block";
            hasError = true;
        } else {
            nameError.style.display = "none";
        }

        // Telefon — 998 + 9 digit = 12
        var phoneDigits = phone.replace(/\D/g, "");
        if (phoneDigits.length < 12) {
            telError.style.display = "block";
            hasError = true;
        } else {
            telError.style.display = "none";
        }

        // Yo'nalish
        if (!direction) {
            dirError.style.display = "block";
            hasError = true;
        } else {
            dirError.style.display = "none";
        }

        // Daromad
        if (!income) {
            incomeError.style.display = "block";
            hasError = true;
        } else {
            incomeError.style.display = "none";
        }

        if (hasError) return;

        var now = new Date();
        var data = {
            Ism: name,
            TelefonRaqam: phone,
            Yonalish: direction,
            Daromad: income,
            SanaSoat: now.toLocaleDateString("uz-UZ") + " - " + now.toLocaleTimeString("uz-UZ")
        };

        localStorage.setItem("formData", JSON.stringify(data));
        window.location.href = "/thankYou.html";
    });
});
