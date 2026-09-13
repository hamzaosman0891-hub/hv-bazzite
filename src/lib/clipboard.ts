// The Quick Access panel is rendered in a different window than the plugin's JS context, so use the
// clicked element's own document/window for clipboard access, falling back to execCommand("copy").
export async function copyText(text: string, doc?: Document | null): Promise<boolean> {
  const targetDoc = doc ?? document;
  const targetWindow = targetDoc.defaultView ?? window;

  try {
    if (targetWindow.navigator?.clipboard?.writeText) {
      await targetWindow.navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    console.warn("[HV Control] clipboard.writeText failed, trying execCommand", e);
  }

  try {
    const textarea = targetDoc.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    targetDoc.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = targetDoc.execCommand("copy");
    targetDoc.body.removeChild(textarea);
    return ok;
  } catch (e) {
    console.error("[HV Control] execCommand copy failed", e);
    return false;
  }
}
