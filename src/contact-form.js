"use strict";
// Formulario de contacto: valida los campos y envía el mensaje con Web3Forms
// (https://web3forms.com), que lo entrega directo a alvarogastonxar@gmail.com.
// El sitio es estático (sin backend propio), por eso se usa este servicio:
// la "access key" de Web3Forms está pensada para ir expuesta en el cliente.
const DEST_EMAIL = "alvarogastonxar@gmail.com";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
function byId(id) {
    const el = document.getElementById(id);
    if (!el) {
        throw new Error(`No se encontró el elemento #${id}`);
    }
    return el;
}
function isValidEmail(value) {
    // Regex simple, suficiente para validación de formulario en el cliente.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form)
        return; // la sección de contacto no está en esta página
    const nameInput = byId("cf-name");
    const emailInput = byId("cf-email");
    const messageInput = byId("cf-message");
    const statusEl = byId("cf-status");
    const submitBtn = byId("cf-submit");
    const fallbackEl = byId("cf-fallback");
    const mailtoLink = byId("cf-mailto-link");
    const copyBtn = byId("cf-copy");
    let lastPlainMessage = "";
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        }
        catch (_a) {
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
    const fields = [
        {
            input: nameInput,
            errorEl: byId("cf-name-error"),
            validate: (value) => {
                if (value.trim().length === 0)
                    return "Ingresá tu nombre.";
                if (value.trim().length < 2)
                    return "El nombre es demasiado corto.";
                return "";
            },
        },
        {
            input: emailInput,
            errorEl: byId("cf-email-error"),
            validate: (value) => {
                if (value.trim().length === 0)
                    return "Ingresá tu email.";
                if (!isValidEmail(value.trim()))
                    return "Ingresá un email válido.";
                return "";
            },
        },
        {
            input: messageInput,
            errorEl: byId("cf-message-error"),
            validate: (value) => {
                if (value.trim().length === 0)
                    return "Escribí tu mensaje.";
                if (value.trim().length < 10)
                    return "Contame un poco más (mínimo 10 caracteres).";
                return "";
            },
        },
    ];
    function validateField(field) {
        const message = field.validate(field.input.value);
        field.errorEl.textContent = message;
        if (message) {
            field.input.setAttribute("aria-invalid", "true");
        }
        else {
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
    function showFallback(subject, body) {
        lastPlainMessage = `Para: ${DEST_EMAIL}\nAsunto: ${subject}\n\n${body}`;
        const mailtoUrl = `mailto:${DEST_EMAIL}` +
            `?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(body)}`;
        mailtoLink.setAttribute("href", mailtoUrl);
        fallbackEl.hidden = false;
    }
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const results = fields.map((field) => validateField(field));
        const allValid = results.every(Boolean);
        if (!allValid) {
            statusEl.textContent = "Revisá los campos marcados en rojo.";
            statusEl.classList.add("error");
            return;
        }
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        const subject = `Contacto desde el portfolio — ${name}`;
        submitBtn.disabled = true;
        statusEl.classList.remove("error");
        statusEl.textContent = "Enviando mensaje…";
        fallbackEl.hidden = true;
        try {
            const response = await fetch(WEB3FORMS_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    access_key: form.elements.namedItem("access_key").value,
                    name,
                    email,
                    message,
                    subject,
                    botcheck: form.elements.namedItem("botcheck").checked,
                }),
            });
            const result = await response.json();
            if (response.ok && result.success) {
                statusEl.textContent = "¡Mensaje enviado! Te voy a responder a la brevedad.";
                form.reset();
            }
            else {
                throw new Error(result.message || "Error desconocido al enviar el formulario.");
            }
        }
        catch (error) {
            console.error("Error enviando el formulario de contacto:", error);
            statusEl.classList.add("error");
            statusEl.textContent =
                "No se pudo enviar el mensaje. Probá de nuevo o usá el respaldo de abajo.";
            showFallback(subject, `Nombre: ${name}\nEmail: ${email}\n\n${message}`);
        }
        finally {
            submitBtn.disabled = false;
        }
    });
}
document.addEventListener("DOMContentLoaded", initContactForm);
