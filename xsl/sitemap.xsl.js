var document = document || null;
if (document) {
  document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('default-sort').click();
  });

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
    var tds = document.getElementsByClassName("changefreq");
    for (var i = 0; i < tds.length; i++) {
      tds[i].setAttribute('data-sort', formatChangeFreq(tds[i].textContent))
    }

    var h1 = document.getElementsByTagName("h1")[0];
    h1.innerHTML = h1.textContent + ': ' + location;
    document.title = h1.textContent;
  }, 0);
}
