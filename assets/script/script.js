document.querySelectorAll("tr[data-ticket-id]").forEach((row) => {
  const ticketId = row.dataset.ticketId;

  row.querySelectorAll(".customer-review").forEach((reviewBox) => {
    const customerId = reviewBox.dataset.customer;

    const select = reviewBox.querySelector(".result-select");
    const commentBox = reviewBox.querySelector(".comment-box");
    const saveBtn = reviewBox.querySelector(".save-btn");
    const savedMessage = reviewBox.querySelector(".save-message");

    if (!select || !commentBox || !saveBtn) return;

    const resultKey = `ticket-result-${ticketId}-customer-${customerId}`;
    const commentKey = `ticket-comment-${ticketId}-customer-${customerId}`;

    const savedResult = localStorage.getItem(resultKey);
    const savedComment = localStorage.getItem(commentKey);

    if (savedResult) {
      select.value = savedResult;
      updateSelectStyle(select, savedResult);
      commentBox.classList.remove("d-none");
      saveBtn.classList.remove("d-none");
    }

    if (savedComment) {
      commentBox.value = savedComment;
    }

    select.addEventListener("change", function () {
      const value = this.value;

      this.classList.remove("bg-success", "bg-danger", "text-white");

      if (value === "pass" || value === "fail") {
        commentBox.classList.remove("d-none");
        saveBtn.classList.remove("d-none");
        updateSelectStyle(this, value);
        localStorage.setItem(resultKey, value);
      } else {
        commentBox.classList.add("d-none");
        saveBtn.classList.add("d-none");
        localStorage.removeItem(resultKey);
        localStorage.removeItem(commentKey);
        commentBox.value = "";
      }

      if (savedMessage) {
        savedMessage.classList.add("d-none");
      }
    });

    saveBtn.addEventListener("click", function () {
      localStorage.setItem(commentKey, commentBox.value.trim());

      if (savedMessage) {
        savedMessage.classList.remove("d-none");

        setTimeout(() => {
          savedMessage.classList.add("d-none");
        }, 1500);
      }
    });
  });
});

function updateSelectStyle(select, value) {
  select.classList.remove("bg-success", "bg-danger", "text-white");

  if (value === "pass") {
    select.classList.add("bg-success", "text-white");
  } else if (value === "fail") {
    select.classList.add("bg-danger", "text-white");
  }
}