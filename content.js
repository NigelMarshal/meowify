let isMeowed = false;

function replaceText(element) {
  // Add check to skip certain elements to avoid DOM chaos
  if (
    [
      "SCRIPT",
      "STYLE",
      "NOSCRIPT",
      "IFRAME",
      "OBJECT",
      "VIDEO",
      "AUDIO",
      "SVG",
      "CANVAS",
    ].includes(element.tagName)
  ) {
    return;
  }

  // Iterate over all child nodes of the current element
  element.childNodes.forEach((node) => {
    // Check if the current node is a text node
    if (node.nodeType === Node.TEXT_NODE) {
      // Store the original text if it hasn't been stored yet for toggling
      if (!node.originalText) {
        node.originalText = node.textContent;
      }
      node.textContent = !isMeowed
        ? node.textContent.replace(/\b(\w+)\b/g, (match) =>
            match === match.toLowerCase() ? "meow" : "Meow"
          )
        : node.originalText;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      replaceText(node);
    }
  });
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.text === "toggle") {
    replaceText(document.body);
    isMeowed = !isMeowed;
  }
});
