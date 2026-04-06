async function sendFormData() {
  const formDataRaw = localStorage.getItem("formData");
  if (!formDataRaw) {
    return;
  }

  const formDataObj = JSON.parse(formDataRaw);


  // Prepare FormData for API
  const formData = new FormData();
  formData.append("sheetName", "Lead");
  formData.append("Ism", formDataObj.Ism);
  formData.append("Telefon raqam", formDataObj.TelefonRaqam);
  formData.append("Yonalish", formDataObj.Yonalish || "");
  formData.append("Daromad", formDataObj.Daromad || "");
  formData.append("Royhatdan o'tgan vaqti", formDataObj.SanaSoat);

  // Sheets va amoCRM ga bir vaqtda yuborish
  const sheetsPromise = fetch(
    "https://script.google.com/macros/s/AKfycbzk7ZgTiY51W4YQPAIDMfvpF2mpspctCqxB6QjCZZTgJyupEdPoIdkRRp1D6Wqo-WiY/exec",
    { method: "POST", body: formData }
  )
    .then((res) => {
      if (res.ok) {
        localStorage.removeItem("formData");
        console.log("Sheets ga yuborildi");
      } else {
        throw new Error("Sheets xatolik: " + res.status);
      }
    })
    .catch((err) => {
      console.error("Sheets xatolik:", err);
      document.getElementById("errorMessage").style.display = "block";
    });

  const amoPromise = fetch("https://cookingcrm.asosit.uz/blogging", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: formDataObj.Ism,
      phone: formDataObj.TelefonRaqam,
      faoliyat: formDataObj.Yonalish || "",
      daromad: formDataObj.Daromad || "",
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log("amoCRM ga lead yaratildi:", data.lead_id))
    .catch((err) => console.error("amoCRM xatolik:", err));

  await Promise.all([sheetsPromise, amoPromise]);
}

// Send data when page loads
window.onload = sendFormData;