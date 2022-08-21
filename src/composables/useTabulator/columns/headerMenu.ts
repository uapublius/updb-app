let svgChecked =
  '<svg class="icon-checked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zm0 400H48V80h352v352zm-35.864-241.724L191.547 361.48c-4.705 4.667-12.303 4.637-16.97-.068l-90.781-91.516c-4.667-4.705-4.637-12.303.069-16.971l22.719-22.536c4.705-4.667 12.303-4.637 16.97.069l59.792 60.277 141.352-140.216c4.705-4.667 12.303-4.637 16.97.068l22.536 22.718c4.667 4.706 4.637 12.304-.068 16.971z"/></svg>';
let svgUnchecked =
  '<svg class="icon-unchecked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"/></svg>';

export function headerMenu() {
  let isVisible = {};
  let saved = localStorage.getItem("visibleReportColumns");
  if (saved) isVisible = JSON.parse(saved);

  let menu = [];
  let columns = this.getColumns();

  for (let column of columns) {
    let icon = document.createElement("div");
    icon.insertAdjacentHTML("afterbegin", svgChecked);
    icon.insertAdjacentHTML("afterbegin", svgUnchecked);

    let title = document.createElement("span");
    title.textContent = " " + column.getDefinition().title;

    if (column._column.parent.definition?.title) {
      title.textContent = column._column.parent.definition.title + ": " + title.textContent;
    }

    let label = document.createElement("div");
    if (column.isVisible()) {
      label.classList.add("checked");
    }
 else {
      label.classList.remove("checked");
    }
    label.appendChild(icon);
    label.appendChild(title);

    menu.push({
      label: label,
      action(e) {
        e.stopPropagation();
        column.toggle();
        isVisible[column.name] = column.isVisible();
        localStorage.setItem("visibleReportColumns", JSON.stringify(isVisible));
        if (column.isVisible()) {
          label.classList.add("checked");
        }
 else {
          label.classList.remove("checked");
        }
      }
    });
  }

  return menu;
}
