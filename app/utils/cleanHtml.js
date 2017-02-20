const cleaner = {
  gif: function gif(html) {
    return html.replace(/[\w_\-/]+\.gif/g, 'javascript:void(0)');
  },
  png: function png(html) {
    return html.replace(/[\w_\-/]+\.png/g, 'javascript:void(0)');
  },
  images: function images(html) {
    return html.replace(/[\w_\-/]+\.(png|gif|jpg)/g, 'javascript:void(0)');
  },
};

export default function cleanHtml(html, cleanOptions = ['gif']) {
  return cleanOptions.reduce((xhtml, method) => {
    if (!cleaner[method]) throw new Error(`Cleaning method ${method} is not existed`);
    return cleaner[method](xhtml);
  }, html);
}
