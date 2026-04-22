const CUSTOMER_COUNT = 15;

// Step 1: Generate customer columns
document.querySelectorAll("tr[data-ticket-id]").forEach((row) => {
  for (let i = 1; i <= CUSTOMER_COUNT; i++) {
    const td = document.createElement("td");

    td.innerHTML = `
      <div class="customer-review" data-customer="${i}">
        <select class="form-select result-select">
          <option value="">Select</option>
          <option value="pass">Pass</option>
          <option value="fail">Fail</option>
        </select>

        <textarea class="form-control mt-2 d-none comment-box" placeholder="Enter comment..."></textarea>

        <button class="btn btn-outline-secondary btn-sm mt-2 d-none save-btn">
          Save
        </button>

        <div class="save-message text-success small mt-1 d-none">
          Comment Saved
        </div>
      </div>
    `;

    row.appendChild(td);
  }
});

// Step 2: Add logic to each customer review box
document.querySelectorAll("tr[data-ticket-id]").forEach((row) => {
  const ticketId = row.dataset.ticketId;

  row.querySelectorAll(".customer-review").forEach((reviewBox) => {
    const customerId = reviewBox.dataset.customer;

    const select = reviewBox.querySelector(".result-select");
    const commentBox = reviewBox.querySelector(".comment-box");
    const saveBtn = reviewBox.querySelector(".save-btn");
    const saveMessage = reviewBox.querySelector(".save-message");

    if (!select || !commentBox || !saveBtn) return;

    // set initial state based on existing value
    saveBtn.disabled = !commentBox.value.trim();

    // enable/disable on typing
    commentBox.addEventListener("input", () => {
      saveBtn.disabled = !commentBox.value.trim();
    });

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

      updateSelectStyle(this, value);

      if (value === "pass" || value === "fail") {
        commentBox.classList.remove("d-none");
        saveBtn.classList.remove("d-none");
        localStorage.setItem(resultKey, value);
      } else {
        commentBox.classList.add("d-none");
        saveBtn.classList.add("d-none");
        commentBox.value = "";
        localStorage.removeItem(resultKey);
        localStorage.removeItem(commentKey);
      }

      if (saveMessage) {
        saveMessage.classList.add("d-none");
      }
    });

    saveBtn.addEventListener("click", function () {
      const comment = commentBox.value.trim();

      if (!comment) {
        commentBox.classList.add("border-danger");
        return;
      }

      commentBox.classList.remove("border-danger");
      localStorage.setItem(commentKey, comment);

      if (saveMessage) {
        saveMessage.classList.remove("d-none");

        setTimeout(() => {
          saveMessage.classList.add("d-none");
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