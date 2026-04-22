const CUSTOMER_COUNT = 15;

// Step 1: Generate customer columns
document.querySelectorAll("tr[data-ticket-id]").forEach((row) => {
  for (let i = 1; i <= CUSTOMER_COUNT; i++) {
    const td = document.createElement("td");

    td.innerHTML = `
      <div class="customer-review" data-customer="${i}">
        <select class="form-select result-select">
          <option value="">Sel</option>
          <option value="pass">Pass</option>
          <option value="fail">Fail</option>
        </select>
      </div>
    `;
    const commentscell = row.querySelector(".comments-cell");
    row.insertBefore(td, commentscell);

  }
});

// Step 2: Add logic to each customer review box
document.querySelectorAll("tr[data-ticket-id]").forEach((row) => {
  const ticketId = row.dataset.ticketId;
  const commentsCell = row.querySelector(".comments-cell");

  row.querySelectorAll(".customer-review").forEach((reviewBox) => {
    const customerId = reviewBox.dataset.customer;
    const select = reviewBox.querySelector(".result-select");

    if (!select) return;

    const resultKey = `ticket-result-${ticketId}-customer-${customerId}`;
    const commentKey = `ticket-comment-${ticketId}-customer-${customerId}`;

    const savedResult = localStorage.getItem(resultKey);
    const savedComment = localStorage.getItem(commentKey);

    if (savedResult) {
      select.value = savedResult;
      updateSelectStyle(select, savedResult);

    }
    if (savedComment) {
      renderCommentsForRow(row);
    }

    select.addEventListener("change", function () {
      const value = this.value;

      updateSelectStyle(this, value);

      if (value === "pass" || value === "fail") {
        localStorage.setItem(resultKey, value);


        const existingComment = localStorage.getItem(commentKey) || "";
        const newComment = prompt(`Enter comment for customer ${customerId}:`, existingComment);

        if (newComment !== null) {
          localStorage.setItem(commentKey, newComment.trim());
        }
      } else {
        localStorage.removeItem(resultKey);
        localStorage.removeItem(commentKey);
      }

      renderCommentsForRow(row);
    });
  });

  renderCommentsForRow(row);
});

function updateSelectStyle(select, value) {
  select.classList.remove("bg-success", "bg-danger", "text-white");

  if (value === "pass") {
    select.classList.add("bg-success", "text-white");
  } else if (value === "fail") {
    select.classList.add("bg-danger", "text-white");
  }
}

function renderCommentsForRow(row) {
  const ticketId = row.dataset.ticketId;
  const commentCell = row.querySelector(".comments-cell");

  if (!commentsCell) return;

  let html = "";

  for (let i = 1; i <= CUSTOMER_COUNT; i++) {
    const result = localStorage.getItem(`ticket-result-${ticketId}-customer-${i}`);
    const comment = localStorage.getItem(`ticket-comment-${ticketId}-customer-${i}`);

    if (result || comment) {
      html += `
        <div class="comment-entry mb-1">
          <strong>C${i}:</strong> ${comment ? comment : "-"}
        </div>
      `;
    }
  }

  commentsCell.innerHTML = html || `<span class="text-muted">No comments</span>`;
}
