function onMessage(event) {
  return {text: "You said: " + event.message.text};
}