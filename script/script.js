



// function getjwtToken(isFromLogin = false) {
//   if (typeof (Storage) !== "undefined") {
//     var jwtToken = sessionStorage.jwtToken;
//     if (jwtToken) {
//       console.info("Session Object Found");
//       verifyJwt(jwtToken, isFromLogin);
//     } else {
//       jwtToken = localStorage.jwtToken;
//       if (jwtToken) {
//         console.info("Storage Object Found");
//         verifyJwt(jwtToken, isFromLogin);
//       } else {
//         console.info("Session Object Not Found... Redirect to Login Page");
//         if (!isFromLogin)
//           window.location.href = "login.html"
//       }
//     }
//   } else {
//     console.error("Browser Not Supported");
//   }
// }

// function verifyJwt(token, isFromLogin) {
//   var jwt = parseJwt2(token);
//   console.info(jwt);
//   var exp = new Date(jwt.exp * 1000)
//   userRole = jwt['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
//   console.info(exp);
//   if (!jwt || !jwt.exp || exp < new Date()) {
//     console.info("Session is Expired... Redirect to Login Page");
//     clearLocalStorage();
//     window.location.href = "login.html"
//   }
//   else if (isFromLogin)
//     window.location.href = "index.html";

//   return false;
// }

// function parseJwt2(token) {
//   var base64Url = token.split('.')[1];
//   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   return JSON.parse(window.atob(base64));
// }



const loadHTML = async (url, containerId) => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    document.getElementById(containerId).innerHTML = text;
  } catch (error) {
    console.error("Error loading HTML:", error);
  }
};
const initializeScripts = () => {
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const searchBarToggle = document.querySelector(".search-bar-toggle"); // Add this line to select the search bar toggle button
  const profileLinks = document.querySelectorAll(
    '.nav-link.collapsed[href="#"]'
  ); // Select profile links with href="#"
  const profileDropdown = document.getElementById("profileDropdown");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const searchBar = document.querySelector(".header .search-bar"); // Add this line to select the search bar

  profileDropdown.addEventListener("click", function (event) {
    event.stopPropagation();
    dropdownMenu.style.display =
      dropdownMenu.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", function (event) {
    if (!profileDropdown.contains(event.target)) {
      dropdownMenu.style.display = "none";
    }
  });

  sidebarToggle?.addEventListener("click", function () {
    toggleSidebar();
  });

  searchBarToggle?.addEventListener("click", function () { // Add this event listener for the search bar toggle button
    searchBar.classList.toggle("show");
  });

  document.addEventListener("click", function (event) {
    profileLinks.forEach((profileLink) => {
      const submenu = profileLink.nextElementSibling; // Select the submenu associated with the profile link
      if (
        !profileLink.contains(event.target) &&
        !submenu.contains(event.target)
      ) {
        submenu.style.display = "none";
        submenu.classList.remove("show");
      }
    });
  });

  profileLinks.forEach((profileLink) => {
    const submenu = profileLink.nextElementSibling; // Select the submenu associated with the profile link
    const chevronIcon = profileLink.querySelector(".bi-chevron-down");
    profileLink?.addEventListener("click", function (event) {
      event.preventDefault();
      if (submenu.style.display === "block") {
        submenu.style.display = "none";
        submenu.classList.remove("show");
      } else {
        submenu.style.display = "block";
        submenu.classList.add("show");
      }
      chevronIcon?.classList.toggle("rotated");
    });

  });

  // Check window width on load and resize
  checkWindowWidth();
  window.addEventListener("resize", checkWindowWidth);

  // Highlight active link
  highlightActiveLink();
};


const toggleSidebar = () => {
  const sidebars = document.querySelectorAll(".sidebar");
  const mainContent = document.getElementById("main-content");

  sidebars.forEach((sidebar) => {
    if (sidebar?.classList.contains("active")) {
      sidebar.classList.remove("active");
      sidebar.classList.add("hidden");
      mainContent?.classList.add("full-width");
    } else {
      sidebar?.classList.add("active");
      sidebar.classList.remove("hidden");
      mainContent?.classList.remove("full-width");
    }
  });
};

const checkWindowWidth = () => {
  const sidebars = document.querySelectorAll(".sidebar");
  if (window.innerWidth <= 1199) {
    sidebars.forEach((sidebar) => {
      sidebar?.classList.remove("active");
      sidebar.classList.add("hidden");
    });
    document.addEventListener('click', handleClickOutside);
  } else {
    sidebars.forEach((sidebar) => {
      sidebar?.classList.add("active");
      sidebar.classList.remove("hidden");
    });
  }
};
const handleClickOutside = (event) => {
  const sidebars = document.querySelectorAll(".sidebar");
  const toggleButton = document.querySelector(".sidebar-toggle");

  const isClickInsideSidebar = Array.from(sidebars).some(sidebar => sidebar.contains(event.target));
  const isClickOnToggleButton = event.target === toggleButton || toggleButton.contains(event.target);

  if (!isClickInsideSidebar && !isClickOnToggleButton) {
    sidebars.forEach((sidebar) => {
      sidebar?.classList.remove("active");
      sidebar.classList.add("hidden");
    });
  }
};


const highlightActiveLink = () => {
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    const linkImg = link.querySelector(".nav-side-img");

    if (linkHref === currentPage) {
      link.classList.add("active");
      if (linkImg) {
        linkImg.classList.add("active");
      }
    } else {
      link.classList.remove("active");
      if (linkImg) {
        linkImg.classList.remove("active");
      }
    }
  });

  // Show profile nav-content if on details or password page
  if (["details.html", "password.html"].includes(currentPage)) {
    const profileLinks = document.querySelectorAll(
      '.nav-link.collapsed[href="#"]'
    );
    profileLinks.forEach((profileLink) => {
      const submenu = profileLink.nextElementSibling;
      const chevronIcon = profileLink.querySelector(".bi-chevron-down");
      submenu.style.display = "block";
      submenu.classList.add("show");
      chevronIcon?.classList.add("rotated");
    });
  }
};

const initializeAll = async () => {
  await loadHTML("header.html", "header-container");
  await loadHTML("sidebar.html", "sidebar-container");

  // Set the user type and manage sidebar visibility
  setuserRole(userRole);

  // Initialize scripts after loading HTML content
  initializeScripts();
};



function setuserRole(userRole) {
  const agentSidebar = document.getElementById("agent-sidebar");
  const traderSidebar = document.getElementById("trader-sidebar");
  const adminSidebar = document.getElementById("admin-sidebar");

  const agentOnlyElements = document.querySelectorAll(".agent-only");
  const traderOnlyElements = document.querySelectorAll(".trader-only");
  const adminOnlyElements = document.querySelectorAll(".admin-only");
  const leftIcons = document.querySelectorAll(".left-icon");

  if (agentSidebar && traderSidebar && adminSidebar) {
    if (userRole === "agent") {
      agentSidebar.style.display = "block";
      traderSidebar.style.display = "none";
      adminSidebar.style.display = "none";
      agentOnlyElements.forEach((item) => (item.style.display = "block"));
      traderOnlyElements.forEach((item) => (item.style.display = "none"));
      adminOnlyElements.forEach((item) => (item.style.display = "none"));



    } else if (userRole === "trader") {
      agentSidebar.style.display = "none";
      traderSidebar.style.display = "block";
      adminSidebar.style.display = "none";
      agentOnlyElements.forEach((item) => (item.style.display = "none"));
      traderOnlyElements.forEach((item) => (item.style.display = "block"));
      adminOnlyElements.forEach((item) => (item.style.display = "none"));


    } else if (userRole === "admin") {
      agentSidebar.style.display = "none";
      traderSidebar.style.display = "none";
      adminSidebar.style.display = "block";
      agentOnlyElements.forEach((item) => (item.style.display = "none"));
      traderOnlyElements.forEach((item) => (item.style.display = "none"));
      adminOnlyElements.forEach((item) => (item.style.display = "block"));
      leftIcons.forEach((icon) => (icon.style.display = "none"));
    }
  } else {
    console.error("One or more sidebar elements are not found in the DOM.");
  }
}


function initializeDashboard(userRole) {
  setuserRole(userRole);
  drawPieCharts(userRole);
}


function drawPieCharts(userRole) {

  if (userRole === "agent") {
    drawPieChart("piechart6", jobsData6);
    createLabels("labels6", jobsData6);
    drawPieChart("piechart7", jobsData6);
    createLabels("labels7", jobsData6);
    drawPieChart("piechart8", jobsData6);
    createLabels("labels8", jobsData6);

  } else if (userRole === "trader") {
    drawPieChart("piechart3", jobsData3);
    createLabels("labels3", jobsData3);
    drawPieChart("piechart4", tradersData3);
    createLabels("labels4", tradersData3);
    drawPieChart("piechart5", tradersData3);
    createLabels("labels5", tradersData3);

  } else if (userRole === "admin") {
    drawPieChart("piechart1", jobsData);
    createLabels("labels1", jobsData);
    drawPieChart("piechart2", tradersData);
    createLabels("labels2", tradersData);

  }

}




function handleLogin(event) {
  console.log("inside ")
  event.preventDefault(); // Prevent the default form submission

  // Get the form data
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Log the form data (for demonstration purposes)
  console.log('Email:', email);
  console.log('Password:', password);

  $.ajax({
    url: apiUrl + 'login',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ email: email, password: password, "captcha_token": "string" }),
    success: function (response) {
      console.log(response);
      if (response.success) {
        localStorage.setItem('jwtToken', response.data.token);
        let statusMsg = {
          text: loginTsySuccess,
          duration: 3000,
          destination: "#",
          newWindow: true,
          close: true,
          gravity: "bottom",
          position: "center",
          stopOnFocus: false,
          style: {
            background: "#458746",
          },
        };
        Toastify(statusMsg).showToast();

        setTimeout(function () {
          window.location.href = "index.html";
        }, 2000);

      }
      else {
        let statusMsg = {
          text: response.data.error_message,
          duration: 3000,
          destination: "#",
          newWindow: true,
          close: true,
          gravity: "bottom",
          position: "center",
          stopOnFocus: false,
          style: {
            background: "#FF0000",
          },
        };
        Toastify(statusMsg).showToast();
      }
    },
    error: function (xhr, status, error) {
      console.error('Error:', error);
      let statusMsg = {
        text: loginTsyUnSuccess,
        duration: 3000,
        destination: "#",
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "center",
        stopOnFocus: false,
        style: {
          background: "#FF0000",
        },
      };
      Toastify(statusMsg).showToast();
    }
  });
}

function handleRegister(event) {
  // event.preventDefault(); // Prevent the default form submission

  // Get the form data
  const formData = {
    first_name: $('#firstName').val(),
    last_name: $('#lastName').val(),
    gender: true,
    dob: "2024-07-21T18:14:17.568Z",
    country_id: 1,
    state_id: 1,
    city_id: 1,

    email: $('#email').val(),
    phone_no: $('#contactNumber').val(),
    type: 0,
    captcha_token: "string",
    acceptEula: "I Accept",
    password: $('#password').val(),
  };

  console.log("fromdata", formData)

  // Make the AJAX call
  $.ajax({
    url: apiUrl + 'register', // Replace with your API endpoint
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(formData),
    success: function (response) {
      // Handle the response from the server
      console.log(response);
      if (response.success) {
        let statusMsg = {
          text: regiTsySuccess,
          duration: 3000,
          destination: "#",
          newWindow: true,
          close: true,
          gravity: "bottom",
          position: "center",
          stopOnFocus: false,
          style: {
            background: "#458746",
          },
        };
        Toastify(statusMsg).showToast();

        setTimeout(function () {
          window.location.href = "login.html";
        }, 2000);
      }
      else{
        let statusMsg = {
          text: response.data.error_message,
          duration: 3000,
          destination: "#",
          newWindow: true,
          close: true,
          gravity: "bottom",
          position: "center",
          stopOnFocus: false,
          style: {
            background: "#FF0000",
          },
        };
        Toastify(statusMsg).showToast();
      }
      // You can handle the response here, e.g., redirect to another page
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error('Error:', error);
      let statusMsg = {
        text: regiTsyUnSuccess,
        duration: 3000,
        destination: "#",
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "center",
        stopOnFocus: false,
        style: {
          background: "#FF0000",
        },
      };
      Toastify(statusMsg).showToast();

    }
  });
}


// pagination

function updatePaginationControls(totalCount, currentPage, itemsPerPage, callFunction) {
  const paginationContainer = document.querySelector('.pagination');
  paginationContainer.innerHTML = ''; // Clear existing pagination links

  if (totalCount === 0) {
    // No data case
    const showingEntriesText = `Showing 0 to 0 out of 0 entries`;
    document.querySelector('.items-per-page p').textContent = showingEntriesText;
    return;
  }

  // Update the showing entries text
  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalCount);
  const showingEntriesText = `Showing ${startEntry} to ${endEntry} out of ${totalCount} entries`;
  document.querySelector('.items-per-page p').textContent = showingEntriesText;

  // Define options and select the appropriate one
  const options = [10, 20, 30, 50, 100]; // Example options
  let selectedOption = options.find(option => option >= totalCount) || options[options.length - 1]; // Default to the largest option

  // Create and update the items per page select
  const itemsPerPageSelect = document.getElementById('itemsPerPage');
  itemsPerPageSelect.innerHTML = ''; // Clear existing options

  options.forEach(option => {
    if (option <= totalCount || option === selectedOption) {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      if (option === itemsPerPage) {
        optionElement.selected = true;
      }
      itemsPerPageSelect.appendChild(optionElement);
    }
  });

  itemsPerPageSelect.addEventListener('change', function () {
    callFunction(currentPage, parseInt(this.value));
  });

  // Create pagination buttons
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const createPageLink = (page, isActive) => {
    const pageLink = document.createElement('li');
    pageLink.innerHTML = `<a href="#" class="${isActive ? 'page-active' : ''}">${page}</a>`;
    pageLink.addEventListener('click', (e) => {
      e.preventDefault();
      callFunction(page, itemsPerPage);
    });
    return pageLink;
  };

  // Double left button
  const doubleLeftButton = document.createElement('li');
  doubleLeftButton.innerHTML = `<a href="#"><img src="./images/double_right.svg" alt="" class="pagiantion-img"></a>`;
  if (currentPage === 1) {
    doubleLeftButton.classList.add('disabled');
  } else {
    doubleLeftButton.addEventListener('click', () => callFunction(1, itemsPerPage));
  }
  paginationContainer.appendChild(doubleLeftButton);

  // Single left button
  const singleLeftButton = document.createElement('li');
  singleLeftButton.innerHTML = `<a href="#"><img src="./images/single_right.svg" alt="" class="pagiantion-img"></a>`;
  if (currentPage === 1) {
    singleLeftButton.classList.add('disabled');
  } else {
    singleLeftButton.addEventListener('click', () => callFunction(currentPage - 1, itemsPerPage));
  }
  paginationContainer.appendChild(singleLeftButton);

  // Page number links
  if (totalPages <= 5) {
    // Show all page links
    for (let i = 1; i <= totalPages; i++) {
      paginationContainer.appendChild(createPageLink(i, i === currentPage));
    }
  } else {
    // Show ellipsis and page numbers
    let pagesToShow = [1, '...', totalPages];
    if (currentPage > 3 && currentPage < totalPages - 2) {
      pagesToShow = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    } else if (currentPage <= 3) {
      pagesToShow = [1, 2, 3, '...', totalPages];
    } else if (currentPage >= totalPages - 2) {
      pagesToShow = [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }
    pagesToShow.forEach(page => {
      paginationContainer.appendChild(createPageLink(page, page === currentPage));
    });
  }

  // Single right button
  const singleRightButton = document.createElement('li');
  singleRightButton.innerHTML = `<a href="#"><img src="./images/single_right.svg" alt="" class="pagiantion-img double-right-rotated"></a>  `;
  if (currentPage === totalPages) {
    singleRightButton.classList.add('disabled');
  } else {
    singleRightButton.addEventListener('click', () => callFunction(currentPage + 1, itemsPerPage));
  }
  paginationContainer.appendChild(singleRightButton);

  // Double right button
  const doubleRightButton = document.createElement('li');
  doubleRightButton.innerHTML = `<a href="#"><img src="./images/double_right.svg" alt=""
  class="pagiantion-img double-right-rotated"></a>`;
  if (currentPage === totalPages) {
    doubleRightButton.classList.add('disabled');
  } else {
    doubleRightButton.addEventListener('click', () => callFunction(totalPages, itemsPerPage));
  }
  paginationContainer.appendChild(doubleRightButton);
}


// my propertices

const dummy = [
  {
    addressLine1: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, omnis?',
    agentName: 'Jane Doe',
    status: 'inactive',
    floors: 8,
    rooms: 8,
    living: 8,
    washrooms: 8,
    isCarpet: 'Yes',
    isSwimmingPool: 'No',
    isGarden: 'No',
    isActive: 'True',
  },
  // 14 original rows...


  {
    addressLine1: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, omnis?',
    agentName: 'James Garcia',
    status: 'active',
    floors: 5,
    rooms: 6,
    living: 3,
    washrooms: 2,
    isCarpet: 'Yes',
    isSwimmingPool: 'No',
    isGarden: 'Yes',
    isActive: 'False'
  },
  {
    addressLine1: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, omnis?',
    agentName: 'Amelia Lewis',
    status: 'inactive',
    floors: 5,
    rooms: 4,
    living: 3,
    washrooms: 3,
    isCarpet: 'No',
    isSwimmingPool: 'Yes',
    isGarden: 'No',
    isActive: 'True'
  },
  {
    addressLine1: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, omnis?',
    agentName: 'Lucas Walker',
    status: 'active',
    floors: 4,
    rooms: 7,
    living: 2,
    washrooms: 4,
    isCarpet: 'Yes',
    isSwimmingPool: 'No',
    isGarden: 'Yes',
    isActive: 'False'
  },
  {
    addressLine1: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, omnis?',
    agentName: 'Harper Hall',
    status: 'inactive',
    floors: 3,
    rooms: 6,
    living: 4,
    washrooms: 2,
    isCarpet: 'No',
    isSwimmingPool: 'Yes',
    isGarden: 'No',
    isActive: 'True'
  },
  {
    addressLine1: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, omnis?',
    agentName: 'Elijah Allen',
    status: 'active',
    floors: 7,
    rooms: 5,
    living: 3,
    washrooms: 3,
    isCarpet: 'Yes',
    isSwimmingPool: 'No',
    isGarden: 'Yes',
    isActive: 'False'
  },
  {
    addressLine1: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, omnis?',
    agentName: 'Ava Young',
    status: 'inactive',
    floors: 6,
    rooms: 8,
    living: 4,
    washrooms: 2,
    isCarpet: 'No',
    isSwimmingPool: 'Yes',
    isGarden: 'No',
    isActive: 'True'
  }
];


function updateMyPropertydata(page = 1, itemsPerPage = 10) {
  console.log("jwtToken", jwtToken);
  // show loader
  document.getElementById('tableLoader').style.display = 'block'
  document.getElementById('accordionRows').style.display = 'none'
  $.ajax({
    url: `${apiUrl}PropertyBook?pageNumber=${page}&pageSize=${itemsPerPage}`, // Replace with your API endpoint
    type: 'GET',
    contentType: 'application/json',
    headers: {
      "Authorization": `Bearer ${jwtToken}`
    },
    success: function (response) {

      console.log(response);
      if (response.success) {
        addMyPropertydata(response.listData, response.totalCount, page, itemsPerPage);
      } else {
        addMyPropertydata([], 0, page, itemsPerPage);
      }
    },
    error: function (xhr, status, error) {

      console.error('Error:', error);

      addMyPropertydata(dummy, 7, page, itemsPerPage);
    }
  });
}

function myproperty() {

  const toggles = document.querySelectorAll(".accordion-toggle");

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const content = this.nextElementSibling;
      const arrowIcon = this.querySelector(".arrow-icon img");

      // Hide all other contents
      document
        .querySelectorAll(".accordion-content")
        .forEach((otherContent) => {
          if (otherContent !== content) {
            otherContent.classList.remove("show");
            // Remove rotation from other arrow icons
            const otherArrowIcon =
              otherContent.previousElementSibling.querySelector(
                ".arrow-icon img"
              );
            if (otherArrowIcon) {
              otherArrowIcon.classList.remove("rotated");
            }
          }
        });

      // Toggle the current content
      content.classList.toggle("show");
      // Toggle the rotation of the arrow icon
      arrowIcon.classList.toggle("rotated");
    });
  });

  const paginationLinks = document.querySelectorAll(".pagination a.page");
  const pageContents = document.querySelectorAll(".page-content");

  paginationLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all pagination links
      paginationLinks.forEach((link) => link.classList.remove("active"));

      // Add active class to the clicked pagination link
      this.classList.add("active");

      // Get the page number from the data-page attribute
      const pageNumber = this.getAttribute("data-page");

      // Hide all page contents
      pageContents.forEach((content) => content.classList.remove("active"));

      // Show the selected page content
      document.getElementById(`page${pageNumber}`).classList.add("active");
    });
  });



}

function addMyPropertydata(rows, totalCount, currentPage, itemsPerPage) {
  // hide loader
  document.getElementById('tableLoader').style.display = 'none'
  document.getElementById('accordionRows').style.display = 'block'
  const accordionRows = document.getElementById('accordionRows');
  accordionRows.innerHTML = ''; // Clear existing rows

  rows.forEach((row, index) => {
    const statusClass = row.isActive === 'True' ? 'active' : 'in-active';
    const statusIcon = row.isActive === 'True' ? './images/active_icon.svg' : './images/in_active_icon.svg';
    const statusText = row.isActive === 'True' ? 'Active' : 'In-Active';
    const evenClass = index % 2 === 1 ? ' even-num' : '';
    const carpet = row.isCarpet === 'True' ? 'Yes' : 'No';
    const pool = row.isSwimmingPool === 'True' ? 'Yes' : 'No';
    const is_backyard = row.is_backyard === 'True' ? 'Yes' : 'No';
    const is_frontyard = row.is_frontyard === 'True' ? 'Yes' : 'No';

    var agentData = `
      <div class="agent-name">
        <img src="images/call_icon.svg" alt="Call" class="call-icon">
        <span class="agent-name-text">${row.agentName}</span>
      </div>`;
    var agentsSubData = `
              <div class="accordian-bottom">
                <div class="agent-name-responsive">
                  <span>Agent Name</span>
                  <div class="agent-name-2">
                    <img src="images/call_icon.svg" alt="Call" class="call-icon">
                    <span class="agent-name-text">${row.agentName}</span>
                  </div>
                </div>
              </div>
      `;
    var responsiveEditicon = `<a href="add_properties.html?id=${row.propId}"><img src="images/pencile_icon.svg" alt="Edit" class="action-icon-responsive left-icon"></a>`;
    var editIcon = `<a href="add_properties.html?id=${row.propId}"><img src="images/pencile_icon.svg" alt="Edit" class="action-icon left-icon"></a>`;
    const rowHTML = `
      <div class="accordion-container">
        <div class="accordion-item ${evenClass}">
          <div class="accordion-toggle ${userRole === 'admin' ? 'adminPropertices' : 'ClientPropertices'}" aria-expanded="false">
            <div class="arrow-icon"><img src="./images/arrow_down.svg" alt=""></div>
            <div class="td-address">${row.addressLine1}</div>

            ${userRole === 'admin' ? agentData : ''}

            <div class="action-val action-change" data-status="${status}">
              <span class="${statusClass}" onclick='clickStatus(event,"${row.propId}","${row.isActive}")' >
                <img src="${statusIcon}" alt="status icon" class="status-icon">${statusText}
              </span>
            </div>
            <div class="action">
              ${userRole === 'agent' ? editIcon : ''}
              <a href="services.html?id=${row.propId}"><img src="images/eye_icon.svg" alt="View" class="action-icon right-icon"></a>
              
            </div>
          </div>
          <div class="accordion-content collapse">
            <div class="collapse-content">
              <div class="left-buttons">
                <button class="info-btn"><img src="./images/floors_icon.svg" alt="" class="info-btn-icon">Floors: ${row.floors}</button>
                <button class="info-btn"><img src="./images/rooms_icon.svg" alt="" class="info-btn-icon">Rooms: ${row.rooms}</button>
                <button class="info-btn"><img src="./images/living_icon.svg" alt="" class="info-btn-icon">Living: ${row.living}</button>
                <button class="info-btn"><img src="./images/washroom_icon.svg" alt="" class="info-btn-icon">Washroom: ${row.washrooms}</button>
              </div>
              <div class="right-info">
                <div class="info-div">Carpet Cloth: ${carpet}</div>
                <div class="info-div">Swimming Pool: ${pool}</div>
                <div class="info-div">Front Yard: ${is_frontyard}</div>
                <div class="info-div">Back Yard: ${is_backyard}</div>
              </div>

              ${userRole === 'admin' ? agentsSubData : ''}

              <div class="accordian-bottom action-respoonsive">
                <div class="action-responsive">Action</div>
                <div class="action-responsive">
               
                ${userRole === 'agent' ? responsiveEditicon : ''}
                  <a href="services.html?id=${row.propId}"><img src="images/eye_icon.svg" alt="View" class="action-icon-responsive right-icon"></a>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    accordionRows.innerHTML += rowHTML;
  });

  // Add event listener only to the span elements inside .action-change divs


  updatePaginationControls(totalCount, currentPage, itemsPerPage, updateMyPropertydata);
  myproperty();
  setuserRole()
}






// add propertices



async function handleAddPropertices(event) {
  event.preventDefault()
  const name = document.getElementById('properties-name').value;
  const address_line1 = document.getElementById('address').value;
  const cityid = document.getElementById('city').value;
  const stateid = document.getElementById('state').value;
  const countryid = document.getElementById('country').value;
  const floors = document.getElementById('floors').value;
  const rooms = document.getElementById('rooms').value;
  const living = document.getElementById('living').value;
  const washrooms = document.getElementById('washroom').value;
  const is_carpet = document.getElementById('carpet').checked;
  const is_swimming_pool = document.getElementById('pool').checked;
  const is_frontyard = document.getElementById('frontYard').checked;
  const is_backyard = document.getElementById('backYard').checked;
  const is_active = document.getElementById('customSwitch').checked;

  // Gather image data
  // const imageUpload = document.getElementById('fileInput');
  // const images = await Promise.all(Array.from(imageUpload.files).map(file => toBase64(file)));

  var valid = true;
  if (!name) {
    document.getElementById('nameError').innerHTML = 'error msg';
    valid = false;
  }
  if (!address_line1) {
    document.getElementById('addressError').innerHTML = 'error msg';
    valid = false;
  }
  if (!cityid) {
    document.getElementById('cityError').innerHTML = 'error msg';
    valid = false;
  }
  if (!stateid) {
    document.getElementById('stateError').innerHTML = 'error msg';
    valid = false;
  }
  if (!countryid) {
    document.getElementById('countryError').innerHTML = 'error msg';
    valid = false;
  }
  if (!floors) {
    document.getElementById('floorsError').innerHTML = 'error msg';
    valid = false;
  }
  if (!rooms) {
    document.getElementById('roomError').innerHTML = 'error msg';
    valid = false;
  }
  if (!living) {
    document.getElementById('livingError').innerHTML = 'error msg';
    valid = false;
  }
  if (!washrooms) {
    document.getElementById('washroomError').innerHTML = 'error msg';
    valid = false;
  }

  if (!valid) {
    return;
  }

  // Create the data object to send in the POST request
  const formData = {
    name,
    address_line1,
    cityid,
    stateid,
    countryid,
    floors,
    rooms,
    living,
    washrooms,
    is_carpet,
    is_swimming_pool,
    is_garden: "true",
    is_frontyard,
    is_backyard,
    is_active,
    propertyBookPhotos_Path: imgPaths
  };
  console.log("data for add", formData);
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  var url = apiUrl + 'PropertyBook';
  var method = 'POST';

  if (id) {
    url = apiUrl + 'PropertyBook?id=' + id;
    method = 'PUT'
  }
  $.ajax({
    url: url,
    type: method,
    contentType: 'application/json',
    data: JSON.stringify(formData),
    headers: {
      "Authorization": `Bearer ${jwtToken}`
    },
    success: function (response) {
      console.log(response);
      if (response.success) {
        let statusMsg = {
          text: propBookTsySuccess,
          duration: 3000,
          destination: "#",
          newWindow: true,
          close: true,
          gravity: "bottom",
          position: "center",
          stopOnFocus: false,
          style: {
            background: "#458746",
          },
        };
        Toastify(statusMsg).showToast();

        setTimeout(function () {
          window.location.href = "myproperties.html";
        }, 2000);
        
      }
      else {
        let statusMsg = {
          text: response.data.error_message,
          duration: 3000,
          destination: "#",
          newWindow: true,
          close: true,
          gravity: "bottom",
          position: "center",
          stopOnFocus: false,
          style: {
            background: "#FF0000",
          },
        };
        Toastify(statusMsg).showToast();
      }
    },
    error: function (xhr, status, error) {
      console.error('Error:', error);
      // alert("data not add")
      let statusMsg = {
        text: propBookTsyUnSuccess,
        duration: 3000,
        destination: "#",
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "center",
        stopOnFocus: false,
        style: {
          background: "#FF0000",
        },
      };
      Toastify(statusMsg).showToast();
    }
  });

}

function editAddPropertices() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id) {
    return;
  }
  $.ajax({
    url: apiUrl + 'PropertyBook/Byid?id=' + id,
    type: 'GET',
    contentType: 'application/json',
    headers: {
      "Authorization": `Bearer ${jwtToken}`
    },
    success: function (response) {
      console.log(response);
      if (response.success) {

        document.getElementById('properties-name').value = response.data.name;
        document.getElementById('address').value = response.data.addressLine1;
        document.getElementById('city').value = response.data.cityId;
        document.getElementById('state').value = response.data.stateId;
        document.getElementById('country').value = response.data.countryId;
        document.getElementById('floors').value = response.data.floors;
        document.getElementById('rooms').value = response.data.rooms;
        document.getElementById('living').value = response.data.living;
        document.getElementById('washroom').value = response.data.washrooms;
        document.getElementById('carpet').checked = response.data.isCarpet == 'True' ? true : false;
        document.getElementById('pool').checked = response.data.isSwimmingPool == 'True' ? true : false;
        document.getElementById('frontYard').checked = response.data.isFrontYard == 'True' ? true : false;
        document.getElementById('backYard').checked = response.data.isBackYard == 'True' ? true : false;
        document.getElementById('customSwitch').checked = response.data.isActive == 'True' ? true : false;

      }
    },
    error: function (xhr, status, error) {
      console.error('Error:', error);

    }
  });
}




var dumyjobs = [
  {
    propertyName: 'user1',
    jobStatus: 'Completed',
    completedAt: '18-4-1994 10:00:00',
    SlotType: '10:24 AM to 01:00 PM',
    jobPrice: '500.23',
    propertyAddress: '123 Main St, Apt 4B, Cityville',
    ServiceType: 'cleaning',
    comments: 'Full address of the property goes here. If the address is too long, the card will adjust its height accordingly.',
  },
  {
    propertyName: 'user2',
    jobStatus: 'In Progress',
    completedAt: '19-4-1994 11:00:00',
    SlotType: '01:15 PM to 03:00 PM',
    jobPrice: '450.00',
    propertyAddress: '456 Oak St, Suite 12, Townsville',
    ServiceType: 'repair',
    comments: 'Please ensure to check all the details before finalizing.',
  },
  {
    propertyName: 'user3',
    jobStatus: 'Pending',
    completedAt: '20-4-1994 12:00:00',
    SlotType: '03:30 PM to 05:00 PM',
    jobPrice: '600.50',
    propertyAddress: '789 Pine St, Floor 5, Villagetown',
    ServiceType: 'inspection',
    comments: 'Inspect the property thoroughly and report any issues.',
  },
  {
    propertyName: 'user4',
    jobStatus: 'Completed',
    completedAt: '21-4-1994 09:00:00',
    SlotType: '09:00 AM to 11:00 AM',
    jobPrice: '520.75',
    propertyAddress: '101 Maple St, House 7, Cityland',
    ServiceType: 'cleaning',
    comments: 'Ensure that all rooms are cleaned as per the checklist.',
  },
  {
    propertyName: 'user5',
    jobStatus: 'Cancelled',
    completedAt: '22-4-1994 02:00:00',
    SlotType: '11:30 AM to 01:00 PM',
    jobPrice: '300.00',
    propertyAddress: '202 Birch St, Apt 9A, Suburbia',
    ServiceType: 'maintenance',
    comments: 'The job was cancelled, no action required.',
  }
];

var dummyAdminJobs = [
  {
    address: '123 Elm St, Springfield',
    serviceName: 'Plumbing',
    Status: 'Completed',
    agentName: 'John Doe',
    traderName: 'Jane Smith',
    date: '15 Jul 2024',
    time: '09:00 AM to 11:00 AM',
    ammount: '350.00',
    comment: 'Service completed successfully with no issues.',
  },
  {
    address: '456 Oak St, Metropolis',
    serviceName: 'Electrical Repair',
    Status: 'Quote Request',
    agentName: 'Alice Brown',
    traderName: 'Bob Johnson',
    date: '16 Jul 2024',
    time: '11:30 AM to 01:00 PM',
    ammount: '150.00',
    comment: 'Waiting for approval of the quote.',
  },
  {
    address: '789 Pine St, Gotham',
    serviceName: 'Carpet Cleaning',
    Status: 'Completed',
    agentName: 'Eve Davis',
    traderName: 'Frank Wilson',
    date: '17 Jul 2024',
    time: '02:00 PM to 04:00 PM',
    ammount: '200.00',
    comment: 'The carpet cleaning was done with high satisfaction.',
  },
  {
    address: '101 Maple St, Star City',
    serviceName: 'Roof Inspection',
    Status: 'Completed',
    agentName: 'Carol Martinez',
    traderName: 'Dave Lee',
    date: '18 Jul 2024',
    time: '10:15 AM to 12:00 PM',
    ammount: '500.00',
    comment: 'Inspection completed and no major issues found.',
  },
  {
    address: '202 Birch St, Smallville',
    serviceName: 'HVAC Maintenance',
    Status: 'Quote Request',
    agentName: 'Tom White',
    traderName: 'Sarah Green',
    date: '19 Jul 2024',
    time: '04:30 PM to 06:00 PM',
    ammount: '75.00',
    comment: 'Awaiting customer confirmation for the maintenance quote.',
  }
];



// my jobs 
function updateMyJobs(page = 1, itemsPerPage = 10) {
  console.log("jwtToken", jwtToken);
  if (userRole == 'agent') {
    document.getElementById('agentjobLoader').style.display = 'block'
    document.getElementById('agentJobs').style.display = 'none'
  } else if (userRole == 'trader') {
    document.getElementById('traderjobLoader').style.display = 'block'
    document.getElementById('traderJobs').style.display = 'none'
  } else if (userRole == 'admin') {
    document.getElementById('adminjobLoader').style.display = 'block'
    document.getElementById('adminJobs').style.display = 'none'
  }
  $.ajax({
    url: `${apiUrl}Trade?pageSize=${itemsPerPage}&pageNumber=${page}`,
    type: 'GET',
    contentType: 'application/json',
    headers: {
      "Authorization": `Bearer ${jwtToken}`
    },
    success: function (response) {

      console.log(response);
      if (response.success) {
        if (userRole == 'admin')
          addAdminJobs(response.listData, response.totalCount, page, itemsPerPage)
        else
          addAgentMyjobs(response.listData, response.totalCount, page, itemsPerPage);

      } else {
        if (userRole == 'admin')
          addAdminJobs([], 0, page, itemsPerPage)
        else
          addAgentMyjobs([], 0, page, itemsPerPage);
      }
    },
    error: function (xhr, status, error) {

      console.error('Error:', error);
      if (userRole == 'admin')
        addAdminJobs(dummyAdminJobs, 5, page, itemsPerPage)
      else
        addAgentMyjobs(dumyjobs, 5, page, itemsPerPage);

    }
  });
}
function addAgentMyjobs(rows, totalCount, currentPage, itemsPerPage) {

  if (userRole == 'agent') {
    document.getElementById('agentjobLoader').style.display = 'none'
    document.getElementById('agentJobs').style.display = 'block'
  } else if (userRole == 'trader') {
    document.getElementById('traderjobLoader').style.display = 'none'
    document.getElementById('traderJobs').style.display = 'block'
  }
  var accordionRows = document.getElementById('agentJobs');
  if (userRole == 'trader')
    accordionRows = document.getElementById('traderJobs');
  accordionRows.innerHTML = ''; // Clear existing rows

  rows.forEach((row, index) => {
    var statusClass = row.jobStatus == 'Pending' ? 'status-pending' : 'status-completed'
    var dateHTML = row.completedAt != '' ? `<div class="footer-date">
                  <img class="footer-icon" src="./images/date_icon.svg" alt="Date Icon">
                  <span>${row.completedAt.split(' ')[0]}</span>
                </div>` : '';
    var timeHTML = row.SlotType != null ? ` <div class="footer-time footer-time-agent">
                  <img class="footer-icon" src="./images/time_icon.svg" alt="Time Icon">
                  <span>${row.SlotType}</span>
                </div>` : '';
    var ammountHTML = (row.jobPrice && userRole != 'trader') != '' ? `<div class="footer-currency">
                <img class="footer-icon" src="./images/payment_icon.svg" alt="Currency Icon">
                <span>$${row.jobPrice}</span>
              </div>` : '';
    const rowHTML = `
    <div class="property-card">
        <div class="property-card-header">
          <div class="property-name">
            ${row.propertyAddress}
            <div class="sub-property-name"><a href="">${row.propertyName} </a></div>
          </div>
          <div class="service-status">
            <div class="service-name-job">Service Name : ${row.ServiceType}</div>
            <div class="${statusClass}">Status : ${row.jobStatus}</div>
          </div>
        </div>
        <div class="property-card-footer">
          <div class="footer-left">
            <img class="footer-icon comment-icon" src="./images/address_icon.svg" alt="Chat Icon">
            <span class="address-text">
              ${row.comments}
            </span>
          </div>
          <div class="footer-right">
            
          
          ${dateHTML}
          ${timeHTML}
          ${ammountHTML}
           

            
          </div>
        </div>
      </div>
    `;
    accordionRows.innerHTML += rowHTML;
  });

  updatePaginationControls(totalCount, currentPage, itemsPerPage, updateMyJobs);

}

function addAdminJobs(rows, totalCount, currentPage, itemsPerPage) {

  document.getElementById('adminjobLoader').style.display = 'none'
  document.getElementById('adminJobs').style.display = 'block'

  var accordionRows = document.getElementById('adminJobs');
  accordionRows.innerHTML = ''; // Clear existing rows

  rows.forEach((row, index) => {
    var statusClass = row.Status == 'Quote Request' ? 'status-pending' : 'status-completed'

    const rowHTML = `
    <div class="admin-property-card">
    <div class="admin-property-card-header" onclick="toggleAccordion(this)">

      <div class="property-name p-flex">
        <img src="./images/arrow_down.svg" alt="Arrow Icon" class="arrow-icon-accordian-2">
        ${row.address}

      </div>
      <div class="service-status">
            <div class="service-name-job">Service Name : ${row.serviceName}</div>
            <div class="${statusClass}">Status : ${row.Status}</div>
      </div>
    </div>
    <div class="admin-property-card-body">
      <div class="admin-agent-trader-middle">
        <div class="admin-agent-trader">
          <button class="admin-agent-button">Agent: ${row.agentName}</button>
          <button class="admin-trader-button">Trader: ${row.traderName}</button>
        </div>
        <div class="admin-middle-right">
          <div class="footer-date">
            <img class="footer-icon" src="./images/date_icon.svg" alt="Date Icon">
            <span>${row.date}</span>
          </div>
          <div class="footer-time">
            <img class="footer-icon" src="./images/time_icon.svg" alt="Time Icon">
            <span>${row.time}</span>
          </div>
          <div class="footer-currency">
            <img class="footer-icon" src="./images/payment_icon.svg" alt="Currency Icon">
            <span>$${row.ammount}</span>
          </div>
        </div>
      </div>
      <div class="admin-footer-left padding-bottom-jobs">
        <img class="footer-icon comment-icon" src="./images/address_icon.svg" alt="Chat Icon">
        <span class="address-text">
          Lorem ipsum dolor sit amet consectetur. Semper ac bibendum id ornare facilisis dis eu cras urna. Tellus
          ${row.comment}
        </span>
      </div>
    </div>
    <div class="footer-right"></div>
  </div>
    `;
    accordionRows.innerHTML += rowHTML;
  });

  updatePaginationControls(totalCount, currentPage, itemsPerPage, updateMyJobs);

}


// my services
var dummyServicesData = [
  {
    propertyBookAddress: '123 Elm St, Springfield',
    propertyBookName: 'Elm Street Property',
    serviceName: 'Cleaning',
    completedOn: '01 Jul 2024',
    serviceStatus: 'Completed',
    expiryInDays: '-5', // Negative value indicates overdue
    comments: 'Full cleaning service was provided.',
  },
  {
    propertyBookAddress: '456 Oak St, Metropolis',
    propertyBookName: 'Oak Street Property',
    serviceName: 'Electrical Inspection',
    completedOn: '15 Jul 2024',
    serviceStatus: 'Completed',
    expiryInDays: '3', // Positive value indicates due soon
    comments: 'Inspection completed with minor issues found.',
  },
  {
    propertyBookAddress: '789 Pine St, Gotham',
    propertyBookName: 'Pine Street Property',
    serviceName: 'Plumbing',
    completedOn: '10 Jun 2024',
    serviceStatus: 'Completed',
    expiryInDays: '-1', // Negative value indicates overdue
    comments: 'Plumbing issues resolved successfully.',
  },
  {
    propertyBookAddress: '101 Maple St, Star City',
    propertyBookName: 'Maple Street Property',
    serviceName: 'Roof Repair',
    completedOn: '20 Aug 2024',
    serviceStatus: 'Pending',
    expiryInDays: '10', // Positive value indicates due soon
    comments: 'Roof repair scheduled for the next week.',
  },
  {
    propertyBookAddress: '202 Birch St, Smallville',
    propertyBookName: 'Birch Street Property',
    serviceName: 'HVAC Maintenance',
    completedOn: '30 Jul 2024',
    serviceStatus: 'Completed',
    expiryInDays: '0', // Zero indicates no status change
    comments: 'HVAC system checked and serviced.',
  }
];
function setServices() {
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const content = this.nextElementSibling;
      const arrowIcon = this.querySelector(".arrow-icon-responsive img");

      // Hide all other contents
      document.querySelectorAll(".dropdown-content").forEach((otherContent) => {
        if (otherContent !== content) {
          otherContent.classList.remove("show");
          // Remove rotation from other arrow icons
          const otherArrowIcon = otherContent.previousElementSibling.querySelector(".arrow-icon-responsive img");
          if (otherArrowIcon) {
            otherArrowIcon.classList.remove("rotated");
          }
        }
      });

      // Toggle the current content
      content.classList.toggle("show");
      // Toggle the rotation of the arrow icon
      arrowIcon.classList.toggle("rotated");
    });
  });
}
function updateServices(page = 1, itemsPerPage = 10) {
  console.log("jwtToken", jwtToken);

  document.getElementById('tableLoader').style.display = 'block'
  document.getElementById('serviceTable').style.display = 'none'

  $.ajax({
    url: `${apiUrl}PropertyBook?pageNumber=${page}&pageSize=${itemsPerPage}`, // Replace with your API endpoint
    type: 'GET',
    contentType: 'application/json',
    headers: {
      "Authorization": `Bearer ${jwtToken}`
    },
    success: function (response) {

      console.log(response);
      if (response.success) {
        addServicesDate(response.listData, response.totalCount, page, itemsPerPage);
      } else {
        addServicesDate([], 0, page, itemsPerPage);
      }
    },
    error: function (xhr, status, error) {

      console.error('Error:', error);

      addServicesDate(dummyServicesData, 5, page, itemsPerPage);

    }
  });
}


// Function to show the popup
function showPopup() {
  document.getElementById('popupOverlay').style.display = 'flex';
}

// Function to close the popup
function closePopup() {
  document.getElementById('popupOverlay').style.display = 'none';
}

// Function to handle the "Yes" action
function confirmAction() {
  // Handle the "Yes" action here
  console.log('Status change confirmed.');
  closePopup();
}
function addServicesDate(rows, totalCount, currentPage, itemsPerPage) {
  document.getElementById('tableLoader').style.display = 'none'
  document.getElementById('serviceTable').style.display = 'block'
  var accordionRows = document.getElementById('serviceTable');
  accordionRows.innerHTML = ''
  rows.forEach((row, index) => {
    if (index == 0) {
      document.getElementById('propertyAddress').innerHTML = row.propertyBookAddress
      document.getElementById('propertyName').innerHTML = row.propertyBookName
    }
    const evenClass = index % 2 === 1 ? ' even-num' : '';
    let status = ''
    let statusClass = ''
    let dueicon = ''
    let imgFull = ''
    let imgresponsive = ''
    if (Number(row.expiryInDays) < 0) {
      status = `Due in ${row.expiryInDays} days`;
      statusClass = 'due';
      dueicon = `<div onclick="showPopup()" class="due-icon"> <img src="images/service_due_icon.svg" alt=""> </div>`;
      imgFull = `<img src="images/pencile_icon.svg" alt="Edit">`;
      imgresponsive = `<img src="images/pencile_icon.svg" alt="Edit" class="action-icon-responsive">`;
    } else if (Number(row.expiryInDays) > 0) {
      status = `Overdue ${row.expiryInDays} days`;
      statusClass = 'overdue';
      dueicon = `<div onclick="showPopup()" class="due-icon" > <img src="images/service_due_icon.svg" alt=""> </div>`;
      imgFull = `<img src="images/pencile_icon.svg" alt="Edit">`;
      imgresponsive = `<img src="images/pencile_icon.svg" alt="Edit" class="action-icon-responsive">`;
    }
    else {
      status = row.serviceStatus;
      statusClass = 'status-completed';
    }



    const rowHTML = `
    <div class="dropdown-container accordion-container ${evenClass}">

    <div class="dropdown-toggle" aria-expanded="false">
      <div class="accordion-toggle" aria-expanded="false">
        <div class="arrow-icon-responsive"><img src="./images/arrow_down.svg" alt=""></div>
        <div class="service-name">${row.serviceName}</div>
        <div class="completed-date">${row.completedOn}</div>
        <div class="service-status">
          <div>
            <span class="status-button ${statusClass}">${status}</span>
          </div>
          ${dueicon}

        </div>
        <div class="comments">${row.comments}</div>
        <div class="action-service">
           ${imgFull}
          <img src="images/delete_icon.svg" alt="View">
        </div>
      </div>
    </div>

    <div class="dropdown-content">
      <div class="status-row">
        <div class="dropdown-heading">Service Status</div>
        <div class="status-content">

          <div class="service-status-dropdown">

            <div>
              <span class="status-button ${statusClass}">${status}</span>
            </div>
            ${dueicon}

          </div>
        </div>
      </div>
      <div class="comments-row">
        <div class="dropdown-heading">Comments:</div>
        <div class="comments-content">${row.comments}</div>
      </div>
      <div class="accordian-bottom">
        <div class="action-heading">Action</div>
        <div class="action-content">
          ${imgresponsive}
          <img src="images/delete_icon.svg" alt="View" class="action-icon-responsive">
        </div>
      </div>
    </div>

  </div>
    `;
    accordionRows.innerHTML += rowHTML;
  });

  updatePaginationControls(totalCount, currentPage, itemsPerPage, updateServices);
  setServices()
}




// user profile
function getUserDetail() {
  $.ajax({
    url: apiUrl + '/UserProfile', // Replace with your API endpoint
    type: 'GET',
    contentType: 'application/json',
    headers: {
      "Authorization": `Bearer ${jwtToken}`
    },
    success: function (response) {

      console.log(response);
      fillUserData(response.data)
    },
    error: function (xhr, status, error) {

      console.error('Error:', error);
    }
  });
}
function fillUserData(data) {
  document.getElementById('firstName').value = data.FirstName;
  document.getElementById('lastName').value = data.LastName;
  document.getElementById('emailInput').value = data.Email;
  document.getElementById('phone').value = data.PhoneNo;
  document.getElementById('address').value = data.Address;

  let parts = data.Dob.split('-'); // Split the date into [day, month, year]
  let formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // Rearrange to YYYY-MM-DD

  document.getElementById('dob').value = formattedDate;

  document.getElementById('city').value = data.CityId;
  document.getElementById('state').value = data.StateId;
  document.getElementById('country').value = data.CountryId;

  if (data.Gender == 'True') {
    document.getElementById('male').checked = true;
    document.getElementById('female').checked = false;
  }
  else {
    document.getElementById('male').checked = false;
    document.getElementById('female').checked = true;
  }

}


function updateprofile(event) {
  event.preventDefault()
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;

  const dob = document.getElementById('dob').value;

  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  const country = document.getElementById('country').value;


  const gender = document.getElementById('male').checked;

  let valid = true;
  if (!firstName) {
    document.getElementById('FNError').innerHTML = 'error'
    valid = false
  }
  if (!lastName) {
    document.getElementById('LNError').innerHTML = 'error'
    valid = false
  }
  if (!phone) {
    document.getElementById('phoneError').innerHTML = 'error'
    valid = false
  }
  if (!address) {
    document.getElementById('addressError').innerHTML = 'error'
    valid = false
  }
  if (!dob) {
    document.getElementById('dateError').innerHTML = 'error'
    valid = false
  }
  if (!city) {
    document.getElementById('countryError').innerHTML = 'error'
    valid = false
  }
  if (!state) {
    document.getElementById('stateError').innerHTML = 'error'
    valid = false
  }
  if (!state) {
    document.getElementById('cityError').innerHTML = 'error'
    valid = false
  }
  if (!valid) {
    return
  }

  $.ajax({
    url: apiUrl + 'UserProfile',
    type: 'PUT',
    contentType: 'application/json',
    headers: {
      "Authorization": `Bearer ${jwtToken}`
    },
    data: JSON.stringify({
      "FirstName": firstName,
      "LastName": lastName,
      "PhoneNo": phone,
      "Gender": gender,
      "Dob": dob,
      "CountryID": country,
      "StateId": state,
      "CityId": city,
      "Address": address
    }),
    success: function (response) {
      console.log(response);

      if(response.success){
        let statusMsg = {
          text: "Profile updated successfully.",
          duration: 3000,
          destination: "#",
          newWindow: true,
          close: true,
          gravity: "bottom",
          position: "center",
          stopOnFocus: false,
          style: {
            background: "#458746",
          },
        };
        Toastify(statusMsg).showToast();
      }
      else{
        let statusMsg = {
          text: response.data.error_message,
          duration: 3000,
          destination: "#",
          newWindow: true,
          close: true,
          gravity: "bottom",
          position: "center",
          stopOnFocus: false,
          style: {
            background: "#FF0000",
          },
        };
        Toastify(statusMsg).showToast();
      }

    },
    error: function (xhr, status, error) {
      console.error('Error:', error);
      let statusMsg = {
        text: "Error.",
        duration: 3000,
        destination: "#",
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "center",
        stopOnFocus: false,
        style: {
          background: "#FF0000",
        },
      };
      Toastify(statusMsg).showToast();
    }
  });


}

function clearUser(event) {
  event.preventDefault();
  document.getElementById('firstName').value = '';
  document.getElementById('lastName').value = '';
  document.getElementById('email').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('address').value = '';

  document.getElementById('dob').value = '';

  document.getElementById('city').value = '';
  document.getElementById('state').value = '';
  document.getElementById('country').value = '';

  document.getElementById('male').checked = true;
}


// forgot  password 
function forgotPassword(event) {
  event.preventDefault();
  const oldPassword = document.getElementById('oldPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;


  console.log("pass", {
    oldPassword,
    newPassword,
    confirmPassword
  })
  let valid = true;
  if (!oldPassword) {
    document.getElementById('oldPassError').innerHTML = 'error msg'
    valid = false;
  }
  if (!newPassword) {
    document.getElementById('newPassError').innerHTML = 'error msg'
    valid = false
  }
  if (!confirmPassword) {
    document.getElementById('cfmPassError').innerHTML = 'error msg'
    valid = false
  }
  if (!valid) {
    return
  }

  $.ajax({
    url: apiUrl + 'UserProfile/changepassword',
    type: 'POST',
    contentType: 'application/json',
    headers: {
      "Authorization": `Bearer ${jwtToken}`
    },
    data: JSON.stringify({
      oldPassword,
      newPassword,
    }),
    success: function (response) {
      console.log(response);
      if (response.success) {
        // alert("suucess")
        let statusMsg = {
          text: " successfully.",
          duration: 3000,
          destination: "#",
          newWindow: true,
          close: true,
          gravity: "bottom",
          position: "center",
          stopOnFocus: false,
          style: {
            background: "#458746",
          },
        };
        Toastify(statusMsg).showToast();
      }
      else{
        let statusMsg = {
          text: response.data.error_message,
          duration: 3000,
          destination: "#",
          newWindow: true,
          close: true,
          gravity: "bottom",
          position: "center",
          stopOnFocus: false,
          style: {
            background: "#FF0000",
          },
        };
        Toastify(statusMsg).showToast();
      }

    },
    error: function (xhr, status, error) {
      console.error('Error:', error);
      let statusMsg = {
        text: "Error.",
        duration: 3000,
        destination: "#",
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "center",
        stopOnFocus: false,
        style: {
          background: "#FF0000",
        },
      };
      Toastify(statusMsg).showToast();
    }
  });

}


// Function to populate the select element with country data
function populateCountryDropdown(data, selectedOption) {
  const countrySelect = document.getElementById(selectedOption);
  console.log("respons", countrySelect, "popop", data)
  // Clear all options except the first one
  countrySelect.options.length = 1;
  if (selectedOption == 'country') {
    data.forEach(country => {
      const option = document.createElement('option');
      option.value = country.id;
      option.textContent = country.name;
      countrySelect.appendChild(option);
    });
  }
  else if (selectedOption == 'state') {
    data.forEach(country => {
      const option = document.createElement('option');
      option.value = country.State_id;
      option.textContent = country.State_name;
      countrySelect.appendChild(option);
    });
  }
  else if (selectedOption == 'city') {
    data.forEach(country => {
      const option = document.createElement('option');
      option.value = country.cityid;
      option.textContent = country.city_name;
      countrySelect.appendChild(option);
    });
  }
}

// Country , State and City
function setContryData() {
  $.ajax({
    url: apiUrl + 'Country', // Replace with your API endpoint
    type: 'GET',
    contentType: 'application/json',
    headers: {
      "Authorization": `Bearer ${jwtToken}`
    },
    success: function (response) {

      if (response.success) {
        populateCountryDropdown(response.listData, 'country');
      }

    },
    error: function (xhr, status, error) {

      console.error('Error:', error);
    }
  });
}

function setStateData() {
  $.ajax({
    url: apiUrl + 'State', // Replace with your API endpoint
    type: 'GET',
    contentType: 'application/json',
    headers: {
      "Authorization": `Bearer ${jwtToken}`
    },
    success: function (response) {

      if (response.success) {
        populateCountryDropdown(response.listData, 'state');
      }

    },
    error: function (xhr, status, error) {

      console.error('Error:', error);
    }
  });
}

function setCityData() {
  $.ajax({
    url: apiUrl + 'City', // Replace with your API endpoint
    type: 'GET',
    contentType: 'application/json',
    headers: {
      "Authorization": `Bearer ${jwtToken}`
    },
    success: function (response) {

      if (response.success) {
        populateCountryDropdown(response.listData, 'city');
      }

    },
    error: function (xhr, status, error) {

      console.error('Error:', error);
    }
  });
}


// trader 
var dummyTraderData = [
  {
    traderName: 'Alice Johnson',
    serviceName: 'Cleaning',
    registerDate: '01 Jan 2024',
    contactNo: '(555) 123-4567',
  },
  {
    traderName: 'Bob Smith',
    serviceName: 'Landscaping',
    registerDate: '15 Feb 2024',
    contactNo: '(555) 234-5678',
  },
  {
    traderName: 'Charlie Brown',
    serviceName: 'Plumbing',
    registerDate: '23 Mar 2024',
    contactNo: '(555) 345-6789',
  },
  {
    traderName: 'Diana Prince',
    serviceName: 'Electrical Repair',
    registerDate: '07 Apr 2024',
    contactNo: '(555) 456-7890',
  },
  {
    traderName: 'Edward Cullen',
    serviceName: 'HVAC Maintenance',
    registerDate: '30 May 2024',
    contactNo: '(555) 567-8901',
  }
];

function setTraderDrop() {
  const dropdownToggles = document.querySelectorAll(".trader-container.dropdown-toggle");

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const content = this.nextElementSibling; // Correctly target the dropdown-content
      const arrowIcon = this.querySelector(".arrow-icon");

      // Log to debug
      console.log("Content:", content);
      console.log("Arrow Icon:", arrowIcon);

      if (content && arrowIcon) {
        // Hide all other contents and reset their arrow icons
        document.querySelectorAll(".dropdown-content").forEach((otherContent) => {
          if (otherContent !== content) {
            otherContent.classList.remove("show");
            const otherArrowIcon = otherContent.previousElementSibling.querySelector(".arrow-icon");
            if (otherArrowIcon) {
              otherArrowIcon.classList.remove("rotated");
            }
          }
        });

        // Toggle the current content and rotate the arrow icon
        content.classList.toggle("show");
        arrowIcon.classList.toggle("rotated");
      }
    });
  });
}
function updateTrader(page = 1, itemsPerPage = 10) {
  console.log("jwtToken", jwtToken);
  document.getElementById('tableLoader').style.display = 'block'
  document.getElementById('traderTable').style.display = 'none'
  $.ajax({
    url: `${apiUrl}user/getAllTraders?pageNumber=${page}&pageSize=${itemsPerPage}`,
    type: 'GET',
    contentType: 'application/json',
    headers: {
      "Authorization": `Bearer ${jwtToken}`
    },
    data: {
      page: page,
      itemsPerPage: itemsPerPage
    },
    success: function (response) {

      console.log(response);
      if (response.success) {
        addTraderDate(response.listData, response.totalCount, page, itemsPerPage);
      } else {
        addTraderDate([], 0, page, itemsPerPage);
      }
    },
    error: function (xhr, status, error) {

      console.error('Error:', error);

      addTraderDate(dummyTraderData, 5, page, itemsPerPage);

    }
  });
}
function addTraderDate(rows, totalCount, currentPage, itemsPerPage) {
  document.getElementById('tableLoader').style.display = 'none'
  document.getElementById('traderTable').style.display = 'block'
  var accordionRows = document.getElementById('traderTable');
  accordionRows.innerHTML = ''
  rows.forEach((row, index) => {
    const evenClass = index % 2 === 1 ? ' even-num' : '';

    const rowHTML = `
    <div class="trader_row" >
    <div class="trader-container dropdown-toggle ${evenClass}">
      <div class="trader-column trader-name">
        <div class="arrow-icon-responsive"><img src="./images/arrow_down.svg" alt="" class="arrow-icon"></div>
        ${row.traderName}
      </div>
      <div class="trader-column trader-service">${row.serviceName}</div>
      <div class="trader-column trader-registerdate">${row.registerDate}</div>
      <div class="trader-column trader-contact">${row.contactNo}</div>

    </div>
    <div class="dropdown-content">
      
      <div class="accordian-bottom">
        <div class="responsive-heading">Contact No</div>
        <div class="user-contact-responsive">${row.contactNo}</div>
      </div>
      <div class="accordian-bottom">
        <div class="responsive-heading">Register Date</div>
        <div class="created-date-responsive">${row.registerDate}</div>
      </div>
      
    </div>
  </div>
    `;
    accordionRows.innerHTML += rowHTML;
  });

  updatePaginationControls(totalCount, currentPage, itemsPerPage, updateTrader);
  setTraderDrop()
}


// user 
var dummyUserData = [
  {
    adminName: 'John Doe',
    adminEmail: 'john.doe@example.com',
    contactNo: '(555) 123-4567',
    status: '1',  // Activated
    createdDate: '2024-01-15 08:30:00'
  },
  {
    adminName: 'Jane Smith',
    adminEmail: 'jane.smith@example.com',
    contactNo: '(555) 234-5678',
    status: '0',  // Pending
    createdDate: '2024-02-20 10:00:00'
  },
  {
    adminName: 'Emily Johnson',
    adminEmail: 'emily.johnson@example.com',
    contactNo: '(555) 345-6789',
    status: '1',  // Activated
    createdDate: '2024-03-05 09:15:00'
  },
  {
    adminName: 'Michael Brown',
    adminEmail: 'michael.brown@example.com',
    contactNo: '(555) 456-7890',
    status: '0',  // Pending
    createdDate: '2024-04-10 11:45:00'
  },
  {
    adminName: 'Sarah Davis',
    adminEmail: 'sarah.davis@example.com',
    contactNo: '(555) 567-8901',
    status: '1',  // Activated
    createdDate: '2024-05-25 14:30:00'
  }
];

function setuserDrop() {
  const dropdownToggles = document.querySelectorAll(".user-column.dropdown-toggle");

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const content = this.nextElementSibling;
      const arrowIcon = this.querySelector(".arrow-icon-responsive .arrow-icon");

      // Hide all other contents and reset their arrow icons
      document.querySelectorAll(".dropdown-content").forEach((otherContent) => {
        if (otherContent !== content) {
          otherContent.classList.remove("show");
          const otherArrowIcon = otherContent.previousElementSibling.querySelector(".arrow-icon-responsive .arrow-icon");
          if (otherArrowIcon) {
            otherArrowIcon.classList.remove("rotated");
          }
        }
      });

      // Toggle the current content and rotate the arrow icon
      content.classList.toggle("show");
      arrowIcon.classList.toggle("rotated");
    });
  });
}
function updateUser(page = 1, itemsPerPage = 10) {
  console.log("jwtToken", jwtToken);
  document.getElementById('tableLoader').style.display = 'block'
  document.getElementById('userTable').style.display = 'none'
  $.ajax({
    url: `${apiUrl}user/getAllAdmins?pageNumber=${page}&pageSize=${itemsPerPage}`,
    type: 'GET',
    contentType: 'application/json',
    headers: {
      "Authorization": `Bearer ${jwtToken}`
    },
    data: {
      page: page,
      itemsPerPage: itemsPerPage
    },
    success: function (response) {

      console.log(response);
      if (response.success) {
        addUserDate(response.listData, response.totalCount, page, itemsPerPage);
      } else {
        addUserDate([], 0, page, itemsPerPage);
      }
    },
    error: function (xhr, status, error) {

      console.error('Error:', error);

      addUserDate(dummyUserData, 5, page, itemsPerPage);

    }
  });
}
function addUserDate(rows, totalCount, currentPage, itemsPerPage) {
  document.getElementById('tableLoader').style.display = 'none'
  document.getElementById('userTable').style.display = 'block'
  var accordionRows = document.getElementById('userTable');
  accordionRows.innerHTML = ''
  rows.forEach((row, index) => {
    const evenClass = index % 2 === 1 ? ' even-num' : '';
    let status = '';
    let statusClass = '';
    if (Number(row.status) == 1) {
      status = 'Activated';
      statusClass = 'status-completed'
    }
    else if (Number(row.status) == 0) {
      status = 'Pending';
      statusClass = 'status-pending'
    }
    const rowHTML = `
    <div class="user-container ${evenClass} ">
    <div class="user-column dropdown-toggle user-row-height">
      <div class="user-name">
        <div class="arrow-icon-responsive"><img src="./images/arrow_down.svg" alt="" class="arrow-icon"></div>

        ${row.adminName}
      </div>
      <div class="user-email">${row.adminEmail}</div>
      <div class="user-contact">${row.contactNo}</div>
      <div class="user-status">
        <span class="status-button ${statusClass}">${status}</span>
      </div>
      <div class="created-date">${row.createdDate.split(' ')[0]}</div>
      <div class="user-action">
        <img src="images/delete_icon.svg" alt="Delete" class="action-icon right-icon">
      </div>
    </div>
    <div class="dropdown-content">
      <div class="accordian-bottom">
        <div class="responsive-heading">Email</div>
        <div class="user-email-responsive">${row.adminEmail}</div>
      </div>
      <div class="accordian-bottom">
        <div class="responsive-heading">Contact No</div>
        <div class="user-contact-responsive">${row.contactNo}</div>
      </div>
      <div class="accordian-bottom">
        <div class="responsive-heading">Created Date</div>
        <div class="created-date-responsive">${row.createdDate.split(' ')[0]}</div>
      </div>
      <div class="accordian-bottom">
        <div class="responsive-heading">Action</div>
        <div class="action-responsive">
          <img src="images/delete_icon.svg" alt="View" class="action-responsive">
        </div>
      </div>
    </div>

  </div>
    `;
    accordionRows.innerHTML += rowHTML;

  });

  updatePaginationControls(totalCount, currentPage, itemsPerPage, updateUser);
  setuserDrop()
}



//  Manage Services for trader
var dummymngservice = [
  {
    serviceName: 'Service 1',
    completedDate: '20 Jun 2025',
    actionIcon: 'images/delete_icon.svg'
  },
  {
    serviceName: 'Service 2',
    completedDate: '21 Jun 2025',
    actionIcon: 'images/delete_icon.svg'
  },
  {
    serviceName: 'Service 3',
    completedDate: '22 Jun 2025',
    actionIcon: 'images/delete_icon.svg'
  },
  {
    serviceName: 'Service 4',
    completedDate: '23 Jun 2025',
    actionIcon: 'images/delete_icon.svg'
  },
  {
    serviceName: 'Service 5',
    completedDate: '24 Jun 2025',
    actionIcon: 'images/delete_icon.svg'
  }
];

function setMngServices() {
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const content = this.nextElementSibling;
      const arrowIcon = this.querySelector(".arrow-icon-responsive img");

      // Hide all other contents and remove rotation from other arrow icons
      document.querySelectorAll(".dropdown-content").forEach((otherContent) => {
        if (otherContent !== content) {
          otherContent.classList.remove("show");
          const otherArrowIcon = otherContent.previousElementSibling.querySelector(".arrow-icon-responsive img");
          if (otherArrowIcon) {
            otherArrowIcon.classList.remove("rotated");
          }
        }
      });

      // Toggle the current content
      content.classList.toggle("show");
      // Toggle the rotation of the arrow icon
      arrowIcon.classList.toggle("rotated");
    });
  });
}

function updateMngServices(page = 1, itemsPerPage = 10) {
  console.log("jwtToken", jwtToken);
  document.getElementById('tableLoader').style.display = 'block';
  document.getElementById('MngServiceTable').style.display = 'none';
  $.ajax({
    url: `${apiUrl}   ?pageNumber=${page}&pageSize=${itemsPerPage}`, // Replace with your API endpoint
    type: 'GET',
    contentType: 'application/json',
    headers: {
      "Authorization": `Bearer ${jwtToken}`
    },
    success: function (response) {

      console.log(response);
      if (response.success) {
        addMngServices(response.listData, response.totalCount, page, itemsPerPage);
      } else {
        addMngServices([], 0, page, itemsPerPage);
      }
    },
    error: function (xhr, status, error) {

      console.error('Error:', error);

      addMngServices(dummymngservice, 5, page, itemsPerPage);

    }
  });
}
function addMngServices(rows, totalCount, currentPage, itemsPerPage) {
  document.getElementById('tableLoader').style.display = 'none';
  document.getElementById('MngServiceTable').style.display = 'block';
  var accordionRows = document.getElementById('MngServiceTable');
  accordionRows.innerHTML = ''
  rows.forEach((row, index) => {

    const evenClass = index % 2 === 1 ? ' even-num' : '';



    const rowHTML = `
    <div class="accordion-container">
    <div class="accordion-item ${evenClass}">
      <div class="accordion-toggle dropdown-toggle" aria-expanded="false">
        <div class="arrow-icon-responsive"><img src="./images/arrow_down.svg" alt="" class="arrow-con-service">
        </div>
        <div class="service-name">${row.serviceName}</div>
        <div class="completed-date">${row.completedDate}</div>
        <div class="action-service">
          <img src="images/delete_icon.svg" alt="View" class="action-icon right-icon">
        </div>
      </div>
      <div class="dropdown-content">
        <div class="accordian-bottom">
          <div class="action-responsive">Action</div>
          <div class="action-responsive">
            <img src="images/delete_icon.svg" alt="View" class="action-responsive">
          </div>
        </div>
      </div>
    </div>
  </div>
    `;
    accordionRows.innerHTML += rowHTML;
  });

  updatePaginationControls(totalCount, currentPage, itemsPerPage, updateMngServices);
  setMngServices()
}


// add propertices from services
function UpdatePropertyData() {
  $.ajax({
    url: `${apiUrl}/PropertyBook/selectComboBox`, // Replace with your API endpoint
    type: 'GET',
    contentType: 'application/json',
    headers: {
      "Authorization": `Bearer ${jwtToken}`
    },
    success: function (response) {
      console.log("responsee", response)
      addPropertyData(response.listData)
    },
    error: function (xhr, status, error) {
      console.error('Error:', error);
      response = {
        "success": true,
        "listData": [
          {
            "propId": "be610e6e-2b03-49f8-9835-69b70e3ff0e9",
            "propertyName": "Sample Property 2",
            "addressLine1": "456 Oak St"
          },
          {
            "propId": "bfb18b4f-129f-4d48-8408-f0f3153af45b",
            "propertyName": "name ",
            "addressLine1": "18,state,country"
          },
          {
            "propId": "2654c308-9f09-4d0a-a897-f72cb7433cb8",
            "propertyName": "taruvilla",
            "addressLine1": "vadodara, gujarat,india "
          },
          {
            "propId": "612242fb-4ab7-4ce1-bcae-a70aa9d049ef",
            "propertyName": "taruvilla",
            "addressLine1": "vadodara, gujarat,india "
          },
          {
            "propId": "5b1f6420-f500-48de-8e2d-cd4e795cd2e6",
            "propertyName": "Sample Property 1",
            "addressLine1": "rajkot"
          },
          {
            "propId": "2f12b7b0-3c9a-41e8-b28b-c0b3fe70186d",
            "propertyName": "taruvilla 22",
            "addressLine1": null
          },
          {
            "propId": "f955cab2-bb09-4d04-b8a3-9ad63b7cac7e",
            "propertyName": "taruvilla",
            "addressLine1": "vadodara, gujarat,india ,390019"
          },
          {
            "propId": "e85448ef-669a-43e5-b198-13aa2111589f",
            "propertyName": "Sample Property 1 edited",
            "addressLine1": "123 Main St"
          },
          {
            "propId": "10078bb7-f407-4218-9bc1-ae47056de7ab",
            "propertyName": "Sunny Villa",
            "addressLine1": "123 Beach Ave"
          },
          {
            "propId": "3a9ecf3f-5deb-4db5-8fe4-e7c55cbaeac1",
            "propertyName": "Cozy Cottage",
            "addressLine1": "456 Mountain Rd"
          },
          {
            "propId": "066068bc-b942-4580-8867-2683c1d6e2c6",
            "propertyName": "Modern Apartment",
            "addressLine1": "789 City Center"
          },
          {
            "propId": "42092045-9eb8-44b2-94d1-b8be24aedfdd",
            "propertyName": "Charming Bungalow",
            "addressLine1": "101 Suburban St"
          },
          {
            "propId": "77d62851-1fcc-4cb9-a9e2-880c38011cdd",
            "propertyName": "Luxury Condo",
            "addressLine1": "121 Luxury Blvd"
          },
          {
            "propId": "bddde8c6-47b3-4cd9-934b-d029ad8b7f9d",
            "propertyName": "Classic Farmhouse",
            "addressLine1": "131 Country Ln"
          },
          {
            "propId": "a366d796-4fb8-4add-be8e-290e66432443",
            "propertyName": "Spacious Loft",
            "addressLine1": "141 Industrial Way"
          },
          {
            "propId": "6e1634d0-4714-4ed0-ae65-1843c63d5208",
            "propertyName": "Sea View Apartment",
            "addressLine1": "151 Ocean Dr"
          },
          {
            "propId": "3b73f2eb-1446-4736-b7e7-dd2e2d4f3ace",
            "propertyName": "Elegant Townhouse",
            "addressLine1": "161 Urban St"
          },
          {
            "propId": "831a4295-ec38-4bff-95c2-0bf531d785c3",
            "propertyName": "Penthouse Suite",
            "addressLine1": "171 High St"
          },
          {
            "propId": "314cd905-57f1-43aa-a454-58318f168a51",
            "propertyName": "Rustic Retreat",
            "addressLine1": "181 Nature Rd"
          },
          {
            "propId": "ae51687b-52fc-42dc-a67d-19d2dbcac3a3",
            "propertyName": "Urban Loft",
            "addressLine1": "191 Art St"
          },
          {
            "propId": "4ae3e313-0896-489a-888c-eeff440ded77",
            "propertyName": "Suburban Haven",
            "addressLine1": "201 Quiet St"
          },
          {
            "propId": "a634ee8c-2d2a-464d-9b73-8dd6970997d2",
            "propertyName": "Mountain Lodge",
            "addressLine1": "211 Peak Rd"
          },
          {
            "propId": "2c58bbd2-8df3-49a4-90e0-33bb633c852e",
            "propertyName": "Country House",
            "addressLine1": "221 Farm St"
          },
          {
            "propId": "217cd550-1bb8-48ba-85df-de8186d740d8",
            "propertyName": "City Escape",
            "addressLine1": "231 Urban Rd"
          },
          {
            "propId": "4d002a15-6c24-43fa-8ee5-4172e3f49725",
            "propertyName": "Heavenly Heights",
            "addressLine1": "241 Skyscraper Rd"
          },
          {
            "propId": "35b19a6b-87b3-42fe-ba6c-e0e7530b03a5",
            "propertyName": "Ocean Breeze",
            "addressLine1": "251 Seaside Rd"
          },
          {
            "propId": "9ef0dd3e-3254-4f30-b056-28dd0e0db545",
            "propertyName": "Riverside Retreat",
            "addressLine1": "261 River St"
          },
          {
            "propId": "bbf2a794-a24b-420f-b330-78def9d182ce",
            "propertyName": "Forest Cabin",
            "addressLine1": "271 Wooded Ln"
          },
          {
            "propId": "97bdbb60-6a38-42f3-b712-24a9784f5b40",
            "propertyName": "Cultural Hub",
            "addressLine1": "281 Art St"
          },
          {
            "propId": "47b2651b-68db-401a-9cb4-e9d661af8283",
            "propertyName": "Quiet Nook",
            "addressLine1": "291 Calm Rd"
          },
          {
            "propId": "092e925a-9f91-4510-bfb0-323ff8f118b9",
            "propertyName": "Sunny Retreat",
            "addressLine1": "301 Bright St"
          },
          {
            "propId": "a79b1143-38e9-4e7b-a5aa-db1c8b50389c",
            "propertyName": "Wilderness Lodge",
            "addressLine1": "311 Wild Rd"
          },
          {
            "propId": "fc6b8710-9eee-4afe-bc00-fc9aa462a3ae",
            "propertyName": "Artisan Loft",
            "addressLine1": "321 Craft St"
          },
          {
            "propId": "0ba11523-0178-4c13-b20c-48133e8616ce",
            "propertyName": "Sleek Studio",
            "addressLine1": "331 Minimalist Rd"
          },
          {
            "propId": "eab85812-3740-42b8-b944-723da3ecbf16",
            "propertyName": "Breezy Cabin",
            "addressLine1": "341 Breeze Ln"
          },
          {
            "propId": "782bb13e-c619-4095-b0e6-da636e27ada2",
            "propertyName": "Luxury Flat",
            "addressLine1": "351 Wealth St"
          },
          {
            "propId": "b2783de5-2bab-4683-8c43-5d1b50e22088",
            "propertyName": "Family Home",
            "addressLine1": "361 Family St"
          },
          {
            "propId": "1e67255e-361d-40c6-a594-2e0b08798957",
            "propertyName": "Elegant Villa",
            "addressLine1": "371 Elegant Rd"
          },
          {
            "propId": "aae88ed7-cbf6-429c-8089-ed44e4c4ae40",
            "propertyName": "Serene Oasis",
            "addressLine1": "391 Oasis Blvd"
          },
          {
            "propId": "f1f08d2e-73d1-432e-a3f8-120e1bba755c",
            "propertyName": "Coastal Paradise",
            "addressLine1": "401 Shoreline Dr"
          },
          {
            "propId": "c15d6b3b-0ed5-44fb-b9f7-7742f52b5eee",
            "propertyName": "Tranquil Villa",
            "addressLine1": "411 Peace Rd"
          },
          {
            "propId": "8dcb64d4-1531-48b6-b731-75716ddecbef",
            "propertyName": "Garden Villa",
            "addressLine1": "421 Green Ln"
          },
          {
            "propId": "3a51736b-94c6-46aa-bb84-cbf0c0d43b8c",
            "propertyName": "Lakeside Retreat",
            "addressLine1": "431 Lake St"
          },
          {
            "propId": "bba5f107-cd9c-4d89-8193-69ccab897862",
            "propertyName": "Rustic Retreat",
            "addressLine1": "441 Country Rd"
          },
          {
            "propId": "57ed260a-20c1-45b9-80ae-5d6734ef95bd",
            "propertyName": "Dream House",
            "addressLine1": "451 Dream St"
          },
          {
            "propId": "a8c1d010-0daf-471d-b56d-05182d9ad847",
            "propertyName": "Skyline Villa",
            "addressLine1": "461 Sky Rd"
          },
          {
            "propId": "a286aac0-2bad-42f7-9595-662083ebd9c9",
            "propertyName": "Hillside Bungalow",
            "addressLine1": "471 Hilltop Rd"
          },
          {
            "propId": "8db2a9e7-9ce1-4f31-8152-23d911e73c21",
            "propertyName": "Countryside Home",
            "addressLine1": "481 Country Ln"
          },
          {
            "propId": "27360730-dd54-4561-a8cc-6e5aa2347f60",
            "propertyName": "Chic Loft",
            "addressLine1": "491 Trendy St"
          },
          {
            "propId": "e010b7b1-f778-4c1d-9f18-3633363be6b2",
            "propertyName": "Blissful Retreat",
            "addressLine1": "501 Happy St"
          },
          {
            "propId": "da7eaa4b-035e-4fa5-acd5-97dec7395667",
            "propertyName": "Mountain Escape",
            "addressLine1": "511 Rocky Rd"
          },
          {
            "propId": "89e77ee8-ed2b-4976-a1fc-852618b90a80",
            "propertyName": "Sunnyvale Apartment",
            "addressLine1": "101 Sunflower St"
          },
          {
            "propId": "a009947b-17bf-4d9c-abd6-6eb15cc6cb86",
            "propertyName": "Lakeview Cottage",
            "addressLine1": "202 Lakeside Dr"
          },
          {
            "propId": "b7ab5f2a-3c3e-4220-954d-dd209f14a2ed",
            "propertyName": "Mountain Retreat",
            "addressLine1": "303 Mountain Rd"
          },
          {
            "propId": "abf7c00b-c091-4348-9de1-8b557dd0649d",
            "propertyName": "Downtown Loft",
            "addressLine1": "404 City Center Blvd"
          },
          {
            "propId": "9dcfb485-1124-4c19-8e06-9424dfcaa96a",
            "propertyName": "Suburban Family Home",
            "addressLine1": "505 Maple Ave"
          },
          {
            "propId": "898507d7-14a8-4264-b8b8-b4ca85518a0b",
            "propertyName": "Urban Studio",
            "addressLine1": "606 Trendy St"
          },
          {
            "propId": "15cd467e-cace-4ecf-b837-c22b40ad603c",
            "propertyName": "Coastal Villa",
            "addressLine1": "707 Ocean Dr"
          },
          {
            "propId": "4d8f9b7b-754a-4802-b65f-2b727fac3edd",
            "propertyName": "Riverside Bungalow",
            "addressLine1": "808 River Rd"
          },
          {
            "propId": "ca87af11-6e4b-422f-a90f-fbde3800775e",
            "propertyName": "Countryside Farmhouse",
            "addressLine1": "909 Farm Rd"
          },
          {
            "propId": "43a0cb43-8e7f-40e1-ba6f-415e3a5a132a",
            "propertyName": "City Penthouse",
            "addressLine1": "1010 Skyline Dr"
          },
          {
            "propId": "d70e24f2-5aac-42ef-8e85-699030eab0ef",
            "propertyName": "Historic Brownstone",
            "addressLine1": "1111 Heritage St"
          },
          {
            "propId": "6d15c3ef-5d1b-4898-a58e-f6a5be6b1d5c",
            "propertyName": "Chic Apartment",
            "addressLine1": "1212 Style Ave"
          },
          {
            "propId": "8c5e7eb8-209d-4574-82ee-61925a1244b5",
            "propertyName": "Grand Mansion",
            "addressLine1": "1313 Royal Rd"
          },
          {
            "propId": "22208d3c-a9fa-46e0-9d70-9ae26363d694",
            "propertyName": "Seaside Cabin",
            "addressLine1": "1414 Coastal Rd"
          },
          {
            "propId": "5fec4ea2-ade4-4f0a-aa23-c6741061b435",
            "propertyName": "Artistic Studio",
            "addressLine1": "1515 Creative St"
          },
          {
            "propId": "ad873193-7ba7-4bcf-bd46-eabe3c8346c8",
            "propertyName": "Elegant Estate",
            "addressLine1": "1616 Elegant Blvd"
          },
          {
            "propId": "a3970a8d-9f5a-49c5-a626-3277fd4399df",
            "propertyName": "Comfortable Condo",
            "addressLine1": "1717 Cozy Ln"
          },
          {
            "propId": "02630a91-e907-4862-bfa0-c6e90fb0950a",
            "propertyName": "Peaceful Retreat",
            "addressLine1": "381 Calm St"
          }
        ]
      }
      addPropertyData(response.listData)
    }
  });
}
function setProperticesData() {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const paramValue = urlParams.get('id');
  if (paramValue) {
    selectPropertyById(paramValue);
    return
  }

  console.log('inside set')
  var select = document.querySelector(".custom-select-2");
  var selected = select.querySelector(".select-selected");
  var items = select.querySelector(".select-items");
  var lines = select.querySelectorAll(".line-between");

  function updateHrVisibility() {
    // Show <hr> if the dropdown is open or an item is selected
    if (items.style.display === "block" || selected.innerHTML !== items.querySelector(".property-light").innerHTML) {
      selected.classList.add("select-arrow-active");
    } else {
      selected.classList.remove("select-arrow-active");
    }
  }


  selected.addEventListener("click", function () {
    if (items.style.display === "block") {
      items.style.display = "none";
      selected.classList.remove("select-arrow-active");
    } else {
      items.style.display = "block";
      selected.classList.add("select-arrow-active");
    }
    updateHrVisibility();
  });

  items.addEventListener("click", function (e) {
    if (e.target.tagName === "DIV" || e.target.tagName === "SPAN") {
      selected.innerHTML = e.target.closest("div").innerHTML;

      items.style.display = "none";
      selected.classList.remove("select-arrow-active");
      updateHrVisibility();
    }
  });

  document.addEventListener("click", function (e) {
    if (!select.contains(e.target)) {
      items.style.display = "none";
      selected.classList.remove("select-arrow-active");
      updateHrVisibility();
    }
  });

  // Initialize hr visibility based on default state
  updateHrVisibility();
}
function addPropertyData(rows) {

  const accordionRows = document.getElementById('propertiesList');
  accordionRows.innerHTML = ''; // Clear existing rows

  rows.forEach((row, index) => {
    const rowHTML = `
      <div class="dropProperticeItem" >
          <input type="text" hidden value= '${row.propId}' >
          <span class="property-bold"> ${row.addressLine1}</span><br>
          <hr class="line-between">
          <span class="property-light">${row.propertyName}</span>
      </div>                                                
`;

    accordionRows.innerHTML += rowHTML;
  });
  setProperticesData()
}


// for agent dashboard  jobs
function updateDashAgentJObs(page = 1, itemsPerPage = 10) {
  console.log("jwtToken", jwtToken);
  $.ajax({
    url: `${apiUrl} ?pageNumber=${page}&pageSize=${itemsPerPage}`, // Replace with your API endpoint
    type: 'GET',
    contentType: 'application/json',
    headers: {
      "Authorization": `Bearer ${jwtToken}`
    },
    success: function (response) {

      console.log(response);
      if (response.success) {
        addDashAgentJObs(response.listData, response.totalCount, page, itemsPerPage);
      } else {
        addDashAgentJObs([], 0, page, itemsPerPage);
      }
    },
    error: function (xhr, status, error) {

      console.error('Error:', error);

      addDashAgentJObs([], 0, page, itemsPerPage);

    }
  });
}
function addDashAgentJObs(rows, totalCount, currentPage, itemsPerPage) {
  var accordionRows = document.getElementById('agentDashJobs');
  accordionRows.innerHTML = ''
  rows.forEach((row, index) => {

    var statusClass = row.jobStatus == 'Pending' ? 'status-pending' : 'status-completed'
    

    const rowHTML = `
    <div class="agent-property-card">
    <div class="agent-property-card-header" onclick="toggleAccordion(this)">
      <div class="property-name">
        <img src="./images/arrow_down.svg" alt="Arrow Icon" class="arrow-icon-accordian-2">
        admin ipsum dolor sit amet consectetur. snf// Address
      </div>
      <div class="service-status">
        <div class="service-name-job">Service Name : Cleaning</div>
        <div class="status schedule">Status : Scheduled</div>
      </div>
    </div>
    <div class="admin-property-card-body">

      <section class="agent-footer-2">
        <div class="admin-footer-left-2">
          <img class="comment-icon" src="./images/address_icon.svg" alt="Chat Icon">
          <span class="address-text">
            Lorem ipsum dolor sit amet consectetur. Semper ac bibendum id ornare facilisis dis eu cras urna.
            Tellus
            lorem ut dignissim mus faucibus dui tortor gravida.
          </span>
        </div>
        <div class="agent-footer-right">


          <div class="footer-date">
            <img class="footer-icon" src="./images/date_icon.svg" alt="Date Icon">
            <span>18-4-1994</span>
          </div>
          <div class="footer-time footer-time-agent">
            <img class="footer-icon" src="./images/time_icon.svg" alt="Time Icon">
            <span>10:24 AM to 01:00 PM</span>
          </div>
          <div class="footer-currency">
            <img class="footer-icon" src="./images/payment_icon.svg" alt="Currency Icon">
            <span>$500.23</span>
          </div>



        </div>
      </section>
    </div>

  </div>
    `;
    accordionRows.innerHTML += rowHTML;
  });

  updatePaginationControls(totalCount, currentPage, itemsPerPage, updateDashAgentJObs);
}


// for agent dashboard propeertics

function updateDashAgentprop(page = 1, itemsPerPage = 10) {
  console.log("jwtToken", jwtToken);
  $.ajax({
    url: `${apiUrl} ?pageNumber=${page}&pageSize=${itemsPerPage}`, // Replace with your API endpoint
    type: 'GET',
    contentType: 'application/json',
    headers: {
      "Authorization": `Bearer ${jwtToken}`
    },
    success: function (response) {

      console.log(response);
      if (response.success) {
        addDashAgentProp(response.listData, response.totalCount, page, itemsPerPage);
      } else {
        addDashAgentProp([], 0, page, itemsPerPage);
      }
    },
    error: function (xhr, status, error) {

      console.error('Error:', error);

      addDashAgentProp([], 0, page, itemsPerPage);

    }
  });
}
function addDashAgentProp(rows, totalCount, currentPage, itemsPerPage) {
  var accordionRows = document.getElementById('agentDashProps');
  accordionRows.innerHTML = ''
  rows.forEach((row, index) => {

    let statusClass = 'due';
    if(row.status == 'overdue'){
      statusClass = 'overdue';
    }
    else if(row.status == 'completed'){
      statusClass = 'completed';
    }

    const rowHTML = `
    <div class="agent-property-card">
    <div class="agent-property-card-header" onclick="toggleAccordion(this)">
      <div class="property-name">
        <img src="./images/arrow_down.svg" alt="Arrow Icon" class="arrow-icon-accordian-2">
        admin ipsum dolor sit amet consectetur. snf// Address
      </div>
      <div class="service-status">
        <div onclick="showPopup()" class="due-icon"> <img src="images/service_due_icon.svg" alt=""
            class="service-due-icon"> </div>
        <div class="status overdue">Status : overdue</div>
      </div>
    </div>
    <div class="admin-property-card-body">

      <section class="agent-footer-2">
        <div class="admin-footer-left-2">
          <div class="left-buttons">
            <button class="info-btn"><img src="./images/floors_icon.svg" alt="" class="info-btn-icon">Floors:
              8</button>
            <button class="info-btn"><img src="./images/rooms_icon.svg" alt="" class="info-btn-icon">Rooms:
              8</button>
            <button class="info-btn"><img src="./images/living_icon.svg" alt="" class="info-btn-icon">Living:
              8</button>
            <button class="info-btn"><img src="./images/washroom_icon.svg" alt="" class="info-btn-icon">Washroom:
              8</button>
          </div>
        </div>
        <div class="agent-footer-right">
          <div class="right-info">
            <div class="info-div">Carpet Cloth: No</div>
            <div class="info-div">Swimming Pool: No</div>
            <div class="info-div">Front Yard: No</div>
            <div class="info-div">Back Yard: No</div>
          </div>


        </div>
      </section>
    </div>

  </div>
    `;
    accordionRows.innerHTML += rowHTML;
  });

  updatePaginationControls(totalCount, currentPage, itemsPerPage, updateDashAgentprop);
}