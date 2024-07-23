//used to make dropdown menu in mobile view colapse

const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar_menu')

menu.addEventListener('click', function()
{
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');

});