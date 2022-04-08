import flatpickr from "flatpickr";
import confirmDatePlugin from "flatpickr/dist/esm/plugins/confirmDate/confirmDate";

let isMobile = navigator.userAgent.includes(" Mobile/");

function createDateEditor(placeholder: string, value: string, cb: () => void) {
  let editor = document.createElement("input");

  editor.value = value;
  editor.setAttribute("type", "date");
  editor.placeholder = placeholder;
  editor.style.display = "flex";

  if (isMobile) {
    editor.addEventListener('blur', () => cb());
    return editor;
  }
  else {
    let pickr = flatpickr(editor, {
      defaultHour: 0,
      enableTime: true,
      plugins: [new confirmDatePlugin({})],
      onClose: () => cb()
    });

    return pickr.input;
  }
}

export let dateRangeEditor = function (cell, onRendered, success, cancel, editorParams) {
  let editor = createDateEditor("From", cell.getValue()?.[0], successFunc);
  let editor2 = createDateEditor("To", cell.getValue()?.[1], successFunc);

  let container = document.createElement("div");
  container.appendChild(editor);
  container.appendChild(editor2);

  function successFunc() {
    if (!editor.value && !editor2.value) return;
    success([editor.value, editor2.value]);
  }

  return container;
};
