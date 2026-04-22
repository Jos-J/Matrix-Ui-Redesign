const CUSTOMER_COUNT = 15;

// ---------- Generate customer dropdown columns ----------
document.querySelectorAll("tr[data-ticket-id]").forEach((row) => {
  const commentsCell = row.querySelector(".comments-cell");

  if (!commentsCell) return;

  for (let i = 1; i <= CUSTOMER_COUNT; i++) {
    const td = document.createElement("td");

    td.innerHTML = `
      <div class="customer-review" data-customer="${i}">
        <select class="form-select form-select-sm result-select">
          <option value="">Sel</option>
          <option value="pass">Pass</option>
          <option value="fail">Fail</option>
        </select>
      </div>
    `;

    row.insertBefore(td, commentsCell);
  }
});

// ---------- Modal setup ----------
const commentModalEl = document.getElementById("commentModal");
const modalCommentInput = document.getElementById("modalCommentInput");
const modalCustomerLabel = document.getElementById("modalCustomerLabel");
const saveCommentModalBtn = document.getElementById("saveCommentModalBtn");

const commentModal = commentModalEl
  ? new bootstrap.Modal(commentModalEl)
  : null;

let activeCommentContext = null;

if (commentModalEl) {
  commentModalEl.addEventListener("hidden.bs.modal", function () {
    if (activeCommentContext) {
      const { select, ticketId, customerId } = activeCommentContext;

      const resultKey = `ticket-result-${ticketId}-customer-${customerId}`;
      const saved = localStorage.getItem(resultKey) || "";

      select.value = saved;
      updateSelectStyle(select, saved);
    }

    modalCommentInput.value = "";
    activeCommentContext = null;
  });

  // Focus textarea when modal opens
  commentModalEl.addEventListener("shown.bs.modal", function () {
    if (modalCommentInput) {
      modalCommentInput.focus();
    }
  });
}

// ---------- Main setup ----------
document.querySelectorAll("tr[data-ticket-id]").forEach((row) => {
  const ticketId = row.dataset.ticketId;

  row.querySelectorAll(".customer-review").forEach((reviewBox) => {
    const customerId = reviewBox.dataset.customer;
    const select = reviewBox.querySelector(".result-select");

    if (!select) return;

    const resultKey = `ticket-result-${ticketId}-customer-${customerId}`;

    const savedResult = localStorage.getItem(resultKey);

    if (savedResult) {
      select.value = savedResult;
      updateSelectStyle(select, savedResult);
    }

    select.addEventListener("change", function () {
      const value = this.value;
      const commentKey = `ticket-comment-${ticketId}-customer-${customerId}`;

      updateSelectStyle(this, value);

      if (value === "pass" || value === "fail") {
        localStorage.setItem(resultKey, value);

        const existingComment = localStorage.getItem(commentKey) || "";

        activeCommentContext = {
          row,
          ticketId,
          customerId,
          commentKey,
          select
        };

        if (modalCustomerLabel) {
          modalCustomerLabel.textContent = `Ticket #${ticketId} - Customer ${customerId}`;
        }

        if (modalCommentInput) {
          modalCommentInput.value = existingComment;
        }

        if (commentModal) {
          commentModal.show();
        }
      } else {
        localStorage.removeItem(resultKey);
        localStorage.removeItem(commentKey);
        renderCommentsForRow(row);
        updateSummaryCards();
      }
    });
  });

  renderCommentsForRow(row);
});

updateSummaryCards();

// ---------- Save modal comment ----------
if (saveCommentModalBtn) {
  saveCommentModalBtn.addEventListener("click", function () {
    if (!activeCommentContext || !modalCommentInput) return;

    const { row, commentKey } = activeCommentContext;
    const comment = modalCommentInput.value.trim();

    if (comment) {
      localStorage.setItem(commentKey, comment);
    } else {
      localStorage.removeItem(commentKey);
    }

    renderCommentsForRow(row);
    updateSummaryCards();

    if (commentModal) {
      commentModal.hide();
    }

    activeCommentContext = null;
  });
}

// Optional: if modal closes without saving, just clear context
if (commentModalEl) {
  commentModalEl.addEventListener("hidden.bs.modal", function () {
    if (modalCommentInput) {
      modalCommentInput.value = "";
    }
    activeCommentContext = null;
  });
}

// ---------- Helpers ----------
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
  const commentsCell = row.querySelector(".comments-cell");

  if (!commentsCell) return;

  let html = "";

  for (let i = 1; i <= CUSTOMER_COUNT; i++) {
    const result = localStorage.getItem(`ticket-result-${ticketId}-customer-${i}`);
    const comment = localStorage.getItem(`ticket-comment-${ticketId}-customer-${i}`);

    if (result || comment) {
      html += `
        <div class="comment-entry">
          <strong>C${i}:</strong> ${comment ? escapeHtml(comment) : "-"}
        </div>
      `;
    }
  }

  commentsCell.innerHTML = html || `<span class="text-muted">No comments</span>`;
}

function updateSummaryCards() {
  let pass = 0;
  let fail = 0;

  document.querySelectorAll(".result-select").forEach((select) => {
    if (select.value === "pass") pass++;
    if (select.value === "fail") fail++;
  });

  const totalReviewed = pass + fail;
  const percent = totalReviewed ? Math.round((pass / totalReviewed) * 100) : 0;

  const passEl = document.getElementById("passCount");
  const failEl = document.getElementById("failCount");
  const percentEl = document.getElementById("completePercent");

  if (passEl) passEl.textContent = pass;
  if (failEl) failEl.textContent = fail;
  if (percentEl) percentEl.textContent = `${percent}%`;
}

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
