const fs = require('fs');

let content = fs.readFileSync('script.js', 'utf8');

const search = `  plannerList.querySelectorAll(".planner-input").forEach(function (input) {
    input.addEventListener("input", function (e) {
      const h = e.target.getAttribute("data-hour");
      plannerData[h] = e.target.value;
      localStorage.setItem("dashboard-planner", JSON.stringify(plannerData));
    });
  });`;

const replace = `  let plannerTimeout;
  plannerList.querySelectorAll(".planner-input").forEach(function (input) {
    input.addEventListener("input", function (e) {
      const h = e.target.getAttribute("data-hour");
      plannerData[h] = e.target.value;
      clearTimeout(plannerTimeout);
      plannerTimeout = setTimeout(function() {
        localStorage.setItem("dashboard-planner", JSON.stringify(plannerData));
      }, 500);
    });
  });`;

content = content.replace(search, replace);
fs.writeFileSync('script.js', content, 'utf8');
