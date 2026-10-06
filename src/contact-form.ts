// Formulario de contacto: valida los campos y, si son válidos, abre el cliente
// de mail del visitante con un mailto: prearmado dirigido a mi casilla.
// El sitio es estático (sin backend), así que esto reemplaza a un envío por servidor.

const DEST_EMAIL = "alvarogastonxar@gmail.com";

interface FieldConfig {
  input: HTMLInputElement | HTMLTextAreaElement;
  errorEl: HTMLElement;
  validate: (value: string) => string; // devuelve el mensaje de error, o "" si es válido
}

function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`No se encontró el elemento #${id}`);
  }
  return el as T;
}

function isValidEmail(value: string): boolean {
  // Regex simple, suficiente para validación de formulario en el cliente.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function initContactForm(): void {
  const form = document.getElementById("contactForm") as HTMLFormElement | null;
  if (!form) return; // la sección de contacto no está en esta página

  const nameInput = byId<HTMLInputElement>("cf-name");
  const emailInput = byId<HTMLInputElement>("cf-email");
  const messageInput = byId<HTMLTextAreaElement>("cf-message");
  const statusEl = byId<HTMLElement>("cf-status");
  const fallbackEl = byId<HTMLElement>("cf-fallback");
  const mailtoLink = byId<HTMLAnchorElement>("cf-mailto-link");
  const copyBtn = byId<HTMLButtonElement>("cf-copy");

  let lastPlainMessage = "";

  async function copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  copyBtn.addEventListener("click", async () => {
    const original = copyBtn.textContent;
    const ok = await copyToClipboard(lastPlainMessage);
    copyBtn.textContent = ok ? "¡Copiado!" : "No se pudo copiar";
    setTimeout(() => {
      copyBtn.textContent = original;
    }, 2000);
  });

  const fields: FieldConfig[] = [
    {
      input: nameInput,
      errorEl: byId("cf-name-error"),
      validate: (value) => {
        if (value.trim().length === 0) return "Ingresá tu nombre.";
        if (value.trim().length < 2) return "El nombre es demasiado corto.";
        return "";
      },
    },
    {
      input: emailInput,
      errorEl: byId("cf-email-error"),
      validate: (value) => {
        if (value.trim().length === 0) return "Ingresá tu email.";
        if (!isValidEmail(value.trim())) return "Ingresá un email válido.";
        return "";
      },
    },
    {
      input: messageInput,
      errorEl: byId("cf-message-error"),
      validate: (value) => {
        if (value.trim().length === 0) return "Escribí tu mensaje.";
        if (value.trim().length < 10) return "Contame un poco más (mínimo 10 caracteres).";
        return "";
      },
    },
  ];

  function validateField(field: FieldConfig): boolean {
    const message = field.validate(field.input.value);
    field.errorEl.textContent = message;
    if (message) {
      field.input.setAttribute("aria-invalid", "true");
    } else {
      field.input.removeAttribute("aria-invalid");
    }
    return message === "";
  }

  // Validación en vivo al salir de cada campo.
  fields.forEach((field) => {
    field.input.addEventListener("blur", () => validateField(field));
    field.input.addEventListener("input", () => {
      if (field.input.getAttribute("aria-invalid") === "true") {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const results = fields.map((field) => validateField(field));
    const allValid = results.every(Boolean);

    if (!allValid) {
      statusEl.textContent = "Revisá los campos marcados en rojo.";
      statusEl.classList.add("error");
      return;
    }

    const subject = `Contacto desde el portfolio — ${nameInput.value.trim()}`;
    const body =
      `Nombre: ${nameInput.value.trim()}\n` +
      `Email: ${emailInput.value.trim()}\n\n` +
      `${messageInput.value.trim()}`;

    const mailtoUrl =
      `mailto:${DEST_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    lastPlainMessage = `Para: ${DEST_EMAIL}\nAsunto: ${subject}\n\n${body}`;
    mailtoLink.setAttribute("href", mailtoUrl);

    statusEl.classList.remove("error");
    statusEl.textContent =
      "Intentando abrir tu programa de correo con el mensaje cargado…";

    // Un <a> "clickeado" de verdad es más confiable para disparar mailto:
    // que reasignar window.location.href (algunos navegadores lo bloquean
    // o no hacen nada si no hay un cliente de mail predeterminado).
    const trigger = document.createElement("a");
    trigger.href = mailtoUrl;
    trigger.style.display = "none";
    document.body.appendChild(trigger);
    trigger.click();
    trigger.remove();

    // No hay forma de detectar desde JS si realmente se abrió un cliente de
    // mail (el navegador no avisa), así que siempre mostramos el respaldo:
    // copiar el mensaje o reintentar el link manualmente.
    fallbackEl.hidden = false;
  });
}

document.addEventListener("DOMContentLoaded", initContactForm);
