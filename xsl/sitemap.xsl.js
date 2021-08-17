var document = document || null;
if (document) {
  function formatChangeFreq(changeFreq) {
    switch (changeFreq) {
      case 'always':
        return 0;

      case 'hourly':
        return 1;

      case 'daily':
        return 2;

      case 'weekly':
        return 3;

      case 'monthly':
        return 4;

      case 'yearly':
        return 5;

      default:
        return 6;
    }
  }

  setTimeout(function() {
    // Set data-sort attribute for changefreq field.
    var tds = document.getElementsByClassName("changefreq");
    for (var i = 0; i < tds.length; i++) {
      tds[i].setAttribute('data-sort', formatChangeFreq(tds[i].textContent))
    }

    // Add URL to title.
    var h1 = document.getElementsByTagName("h1")[0];
    h1.innerHTML = h1.textContent + ': ' + location;
    document.title = h1.textContent;

    // Set default sort.
    document.getElementById('default-sort').click();
  }, 0);
}
