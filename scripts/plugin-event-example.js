const sk = document.querySelector('helix-sidekick');
console.log('sdsdsdsdsd');
if (sk) {
  // sidekick already loaded
  sk.addEventListener('custom:foo', foo);
} else {
  // wait for sidekick to be loaded
  document.addEventListener('sidekick-ready', () => {
    document.querySelector('helix-sidekick')
      .addEventListener('custom:foo', foo);
  }, { once: true });
}
