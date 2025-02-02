// tslint:disable

const loadGA = () => {
  /**
   * Creates a temporary global ga object and loads analytics.js.
   * Parameters o, a, and m are all used internally. They could have been
   * declared using 'var', instead they are declared as parameters to save
   * 4 bytes ('var ').
   *
   * @param {Window}        i The global context object.
   * @param {HTMLDocument}  s The DOM document object.
   * @param {string}        o Must be 'script'.
   * @param {string}        g Protocol relative URL of the analytics.js script.
   * @param {string}        r Global name of analytics object. Defaults to 'ga'.
   * @param {HTMLElement}   a Async script tag.
   * @param {HTMLElement}   m First script tag in document.
   */

  if (window.ga) {
    return window.ga;
  }

  /**
   * Do not modify. Below snippet is from Google
   */

  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; // Acts as a pointer to support renaming.

    // Creates an initial ga() function.
    // The queued commands will be executed once analytics.js loads.
    (i[r] =
      i[r] ||
      function () {
        (i[r].q = i[r].q || []).push(arguments);
      }),
      // Sets the time (as an integer) this tag was executed.
      // Used for timing hits.
      (i[r].l = 1 * new Date());

    // Insert the script tag asynchronously.
    // Inserts above current tag to prevent blocking in addition to using the
    // async attribute.
    (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

  return ga;
};

module.exports = {
  loadGA
};
