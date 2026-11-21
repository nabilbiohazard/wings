(() => {
  const root = document.getElementById("wings-layout-editor");
  if (!root) return;
  const $ = (selector) => root.querySelector(selector);
  const initial = JSON.parse(root.dataset.initial || "null");
  let layout = initial || {
    version: 1,
    image: root.dataset.image || "",
    maxCharms: 1,
    slots: [],
  };
  let selected = layout.slots.length ? 0 : -1;
  let preview = "",
    drag = null,
    history = [],
    dirty = false;
  const canvas = $(".wings-layout-canvas");
  const markers = $(".wings-layout-markers");
  const enabled = $("#wings-layout-enabled");
  const max = $("#wings-layout-max");
  const clamp = (n) => Math.max(0, Math.min(600, Math.round(n)));
  const remember = () => {
    history.push(JSON.stringify(layout));
    if (history.length > 50) history.shift();
    dirty = true;
  };
  const rotation = (slot) =>
    slot.rotation ??
    (Math.atan2(slot.y - 300, slot.x - 300) * 180) / Math.PI - 90;
  const valid = () =>
    !enabled.checked ||
    (layout.image &&
      layout.slots.length &&
      layout.maxCharms >= 1 &&
      layout.maxCharms <= layout.slots.length &&
      new Set(layout.slots.map((s) => `${s.x},${s.y}`)).size ===
        layout.slots.length);

  function sync() {
    $("#wings-layout-value").value = JSON.stringify(
      enabled.checked ? layout : null,
    );
    const status = $("#wings-layout-status");
    status.textContent = !valid()
      ? "Choose a product image, add distinct slots, and set the maximum within the slot count."
      : dirty
        ? "Unsaved layout — click Update / Publish to save."
        : "Save with the product’s Update / Publish button.";
    status.classList.toggle("wings-layout-error", !valid());
  }

  function render() {
    $(".wings-layout-image").src = layout.image;
    $(".wings-layout-workspace").classList.toggle(
      "wings-layout-disabled",
      !enabled.checked,
    );
    max.value = layout.maxCharms;
    max.max = Math.max(1, layout.slots.length);
    markers.replaceChildren();
    const list = $("#wings-slot-list");
    list.replaceChildren();
    layout.slots.forEach((slot, index) => {
      const label = String(index + 1).padStart(2, "0");
      const button = document.createElement("button");
      button.type = "button";
      button.className =
        "wings-slot" + (selected === index ? " is-selected" : "");
      button.textContent = label;
      button.dataset.index = index;
      button.style.left = `${slot.x / 6}%`;
      button.style.top = `${slot.y / 6}%`;
      button.setAttribute(
        "aria-label",
        `Slot ${label}, X ${slot.x}, Y ${slot.y}`,
      );
      button.setAttribute("aria-pressed", String(selected === index));
      markers.append(button);
      if (preview && $("#wings-show-preview").checked) {
        const charm = document.createElement("img");
        charm.src = preview;
        charm.alt = "";
        charm.className = "wings-preview-charm";
        charm.style.left = `${slot.x / 6}%`;
        charm.style.top = `${slot.y / 6}%`;
        charm.style.transform = `translateX(-50%) rotate(${rotation(slot)}deg)`;
        markers.append(charm);
      }
      const row = document.createElement("button");
      row.type = "button";
      row.className = "button" + (selected === index ? " button-primary" : "");
      row.textContent = label;
      row.addEventListener("click", () => {
        selected = index;
        render();
        canvas.focus();
      });
      list.append(row);
    });
    $("#wings-layout-count").textContent =
      `${layout.slots.length} slots · ${layout.maxCharms} charms maximum`;
    $("#wings-slot-fields").hidden = selected < 0;
    if (selected >= 0) {
      $("#wings-slot-title").textContent =
        `Slot ${String(selected + 1).padStart(2, "0")}`;
      for (const axis of ["x", "y", "rotation"])
        $(`[data-axis="${axis}"]`).value = layout.slots[selected][axis] ?? "";
    }
    $('[data-action="undo"]').disabled = !history.length;
    $('[data-action="add"]').disabled = layout.slots.length >= 30;
    sync();
  }

  function pickImage(callback) {
    const frame = wp.media({
      title: "Choose image",
      button: { text: "Use this image" },
      library: { type: "image" },
      multiple: false,
    });
    frame.on("select", () =>
      callback(frame.state().get("selection").first().toJSON().url),
    );
    frame.open();
  }
  root.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "image")
      pickImage((url) => {
        remember();
        layout.image = url;
        render();
      });
    if (action === "preview")
      pickImage((url) => {
        preview = url;
        $("#wings-show-preview").checked = true;
        render();
      });
    if (action === "add" && layout.slots.length < 30) {
      remember();
      layout.slots.push({ x: 300, y: 300 });
      selected = layout.slots.length - 1;
      enabled.checked = true;
      render();
      canvas.focus();
    }
    if (action === "remove" && selected >= 0) {
      remember();
      layout.slots.splice(selected, 1);
      selected = layout.slots.length
        ? Math.min(selected, layout.slots.length - 1)
        : -1;
      layout.maxCharms = Math.max(
        1,
        Math.min(layout.maxCharms, layout.slots.length),
      );
      render();
    }
    if (action === "undo" && history.length) {
      layout = JSON.parse(history.pop());
      selected = layout.slots.length
        ? Math.max(0, Math.min(selected, layout.slots.length - 1))
        : -1;
      render();
    }
  });
  root.addEventListener("change", (event) => {
    const axis = event.target.dataset.axis;
    if (axis && selected >= 0) {
      remember();
      if (axis === "rotation" && event.target.value === "")
        delete layout.slots[selected].rotation;
      else
        layout.slots[selected][axis] =
          axis === "rotation"
            ? Math.max(-360, Math.min(360, Number(event.target.value)))
            : clamp(Number(event.target.value));
    }
    if (event.target === max) {
      remember();
      layout.maxCharms = Math.max(
        1,
        Math.min(layout.slots.length || 1, Math.round(Number(max.value) || 1)),
      );
    }
    if (event.target === enabled) dirty = true;
    render();
  });
  canvas.addEventListener("pointerdown", (event) => {
    const marker = event.target.closest("[data-index]");
    if (!marker || !enabled.checked) return;
    event.preventDefault();
    selected = Number(marker.dataset.index);
    remember();
    drag = event.pointerId;
    canvas.setPointerCapture(drag);
    canvas.focus();
    render();
  });
  canvas.addEventListener("pointermove", (event) => {
    if (drag !== event.pointerId) return;
    const rect = canvas.getBoundingClientRect();
    layout.slots[selected].x = clamp(
      ((event.clientX - rect.left) / rect.width) * 600,
    );
    layout.slots[selected].y = clamp(
      ((event.clientY - rect.top) / rect.height) * 600,
    );
    render();
  });
  const release = () => {
    drag = null;
  };
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);
  canvas.addEventListener("lostpointercapture", release);
  canvas.addEventListener("keydown", (event) => {
    if (
      selected < 0 ||
      !enabled.checked ||
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    )
      return;
    event.preventDefault();
    remember();
    const slot = layout.slots[selected],
      step = event.shiftKey ? 10 : 1;
    if (event.key === "ArrowLeft") slot.x = clamp(slot.x - step);
    if (event.key === "ArrowRight") slot.x = clamp(slot.x + step);
    if (event.key === "ArrowUp") slot.y = clamp(slot.y - step);
    if (event.key === "ArrowDown") slot.y = clamp(slot.y + step);
    render();
  });
  root.closest("form").addEventListener(
    "submit",
    (event) => {
      sync();
      if (!valid()) {
        event.preventDefault();
        event.stopImmediatePropagation();
        $("#wings-layout-status").scrollIntoView({ block: "center" });
      }
    },
    true,
  );
  render();
})();
