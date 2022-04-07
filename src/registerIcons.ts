export function registerIcons(app) {
  let components = import.meta.globEager('./assets/icons/*.svg');

  Object.entries(components).forEach(([path, definition]) => {
    let componentName = path.split('/').pop().replace(/\.\w+$/, '');
    app.component("up-icon-" + componentName, definition.default);
  });
}
