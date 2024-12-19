// Function for mobile menu toggle and navbar links
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar_menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

// Function to toggle the dropdown visibility
function toggleDropdown(id) {
    var dropdown = document.getElementById(id);
    var arrow = dropdown.previousElementSibling.querySelector('.arrow');
    
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
        arrow.classList.remove('rotate');  
    } else {
        dropdown.style.display = "block";
        arrow.classList.add('rotate');  
    }
}

// Function to open the specific tab content when a tab is clicked
var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");
function opentab(tabname) {
    for (tablink of tablinks) {
        tablink.classList.remove("active-link");
    }
    for (tabcontent of tabcontents) {
        tabcontent.classList.remove("active-tab")
    }
    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
}
