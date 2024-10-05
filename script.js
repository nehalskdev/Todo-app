"strict mode";

const addBtn = document.querySelector("button");
const input = document.querySelector("input");

// adding element

addBtn.addEventListener("click", (e) => {
  const markup = `
        <div class="new-element">
            <h3 class="dlt-el">☑️${input.value.toUpperCase()}</h3>
            
        </div>`;
  if (!input.value == "") {
    addBtn.insertAdjacentHTML("afterend", markup);
    input.value = "";
  } else alert("Enter a task to add!!");
});

// deleting element

document.body.addEventListener("click", (e) => {
  if (e.target.classList.contains("dlt-el")) {
    alert((e.target.textContent = "Delete this?"));
    e.target.remove();
  }
});
