function switchTab(tabId) {
   
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

  
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

  
    document.getElementById(tabId).classList.add('active');


    event.target.classList.add('active');
}


document.querySelector('.load-more-btn').addEventListener('click', function() {
  
    console.log('Load more clicked');
});