//All Selectors
const message = document.querySelector('#message');
const inputTweet = document.querySelector('#input-tweet');
const characters = document.querySelector('#characters');
const addTweetBtn = document.querySelector('#add-tweet');
const tweetContent = document.querySelector('#tweet-data');
const filterTweet = document.querySelector('#filter-tweets');
const tweetTable = document.querySelector('#tweets-table');
const filterMessage = document.querySelector('#filter-message');
const tweetList = document.querySelector('#tweet-list');
const editTweetBtn = document.querySelector('.edit-tweet');
const deleteTweetBtn = document.querySelector('.delete-tweet');

//Environment
const maxLength = 250;

//length Validation
inputTweet.onkeyup = () =>{
    const counter = inputTweet.value.length;
    const remainingCharacter = maxLength - counter;
    characters.innerHTML = counter;
    if (remainingCharacter < 0) {
        message.innerHTML = `<h5 class='alert alert-danger'>Your tweets must not 
        greater than 250 Characters.</h5>`;
        setTimeout(() =>{
        message.innerHTML = '';
        }, 5000)
        addTweetBtn.setAttribute('disabled', 'disabled');
    }else{
        message.innerHTML = '';
        addTweetBtn.removeAttribute('disabled', 'disabled');
    }
}

//Data-store
let tweetsInfo = [];

//Get All Tweets
function getTweets(tweetStore){
if (tweetsInfo.length > 0) {
    tweetContent.style.display = 'block';
    let row = '';
    tweetStore.forEach(tweet => {
        row = document.createElement('tr');
        row.className = 'tweet-row';
        row.innerHTML = `
        <td>${tweet.id}</td>
        <td>${tweet.tweets}</td>
        <td>${tweet.date}</td>
        <td>
            <i class="fa fa-pencil edit-tweet"aria-hidden="true"></i>
        </td>
        <td>
            <i class="fa fa-trash delete-tweet" aria-hidden="true"></i>
        </td>
        `;
        tweetList.appendChild(row);
    });
}else{
    tweetContent.style.display = 'none';
}
};
getTweets(tweetsInfo);

//Validation
addTweetBtn.addEventListener('click', event =>{
    //prevent default
    event.preventDefault();
    const tweets = inputTweet.value;
    //unique id generate
    let id;
    if (tweetsInfo.length === 0) {
        id = 1;
    }else{
        id = tweetsInfo[tweetsInfo.length-1].id+1;
    }
    //empty field validation
    if (tweets === '') {
        message.innerHTML = `<h5 class='alert alert-danger'>You must fill up the field for submit tweets.</h5>`;
        setTimeout(() =>{
            message.innerHTML = '';
        }, 3000)
    }else{
        tweetsInfo.push({
            id,
            tweets,
            date:`1:2`
        });
        tweetList.innerHTML = '';
        getTweets(tweetsInfo);
        inputTweet.value = '';
        characters.textContent=0;
    }
});

//Delete tweets
tweetList.addEventListener('click', event =>{
    //console.log(event.target);
    if (event.target.classList.contains('delete-tweet')) {
        //console.log(`ok`);
        //removing data from UI
        event.target.parentElement.parentElement.remove();
        //removing data from Store
        const id = parseInt(event.target.parentElement.parentElement.children[0].textContent);
        console.log(id);
       const result =  tweetsInfo.filter((tweet) =>{
          return  tweet.id !== id  
        });
        tweetsInfo = result; 
    }
});

//Searching
filterTweet.addEventListener('keyup', event =>{
    const text = event.target.value.toLowerCase();
    //console.log(text);
    document.querySelectorAll('#tweet-list .tweet-row').forEach(tweetItem =>{
        //console.log(tweet);
        const tweets = tweetItem.children[1].textContent.toLowerCase();
        //console.log(tweets);
        if (tweets.indexOf(text) === -1) {
            tweetItem.style.display = 'none';
            tweetTable.style.display = 'none';
            filterMessage.innerHTML = `<h5 class='alert alert-danger'>No Tweets Found According your Criteria.</h5>`;
            setTimeout(() =>{
                filterMessage.innerHTML = '';
            }, 5000)
            
        }else{
            tweetItem.style.display = '';
            tweetTable.style.display = '';
            filterMessage.innerHTML = '';
        }
    });
})



























//All Selectors
const message = document.querySelector('#message');
const inputTweet = document.querySelector('#input-tweet');
const characters = document.querySelector('#characters');
const addTweetBtn = document.querySelector('#add-tweet');
const tweetContent = document.querySelector('#tweet-data');
const filterTweet = document.querySelector('#filter-tweets');
const tweetTable = document.querySelector('#tweets-table');
const filterMessage = document.querySelector('#filter-message');
const tweetList = document.querySelector('#tweet-list');
// const editTweetBtn = document.querySelector('.edit-tweet');
// const deleteTweetBtn = document.querySelector('.delete-tweet');

//Environment
const maxLength = 250;

//length Validation
inputTweet.onkeydown = () =>{
    const counter = inputTweet.value.length;
    const remainingCharacter = maxLength - counter;
    characters.innerHTML = counter;
    if (remainingCharacter < 0) {
        message.innerHTML = `<h5 class='alert alert-danger'>Your tweets must not 
        greater than 250 Characters.</h5>`;
        setTimeout(() =>{
        message.innerHTML = '';
        }, 5000)
        addTweetBtn.setAttribute('disabled', 'disabled');
    }else{
        message.innerHTML = '';
        addTweetBtn.removeAttribute('disabled', 'disabled');
    }
}

//Data-store in local Storage
let tweetsInfo = getDataFromLocalStorage();
function getDataFromLocalStorage(){
    let items = '';
    if (localStorage.getItem('tweetItems') === null) {
        items = [];
    }else{
        items = JSON.parse(localStorage.getItem('tweetItems'));
    }
    return items;
} 

function saveDataToLocalStorage(item) {
    let items = '';
    if (localStorage.getItem('tweetItems') === null) {
      items = [];
      items.push(item);
      localStorage.setItem('tweetItems', JSON.stringify(items));
    } else {
      items = JSON.parse(localStorage.getItem('tweetItems'));
      items.push(item);
      localStorage.setItem('tweetItems', JSON.stringify(items));
    }
  }

  //delete data from localStorage
function deleteItemFromLocalStorage(id) {
    const items = JSON.parse(localStorage.getItem('tweetItems'));
    let result = items.filter(tweetItem => {
      return tweetItem.id !== id;
    });
    localStorage.setItem('tweetItems', JSON.stringify(result));
    if (result.length === 0) location.reload();
  }

//Get All Tweets
function getTweets(tweetStore){
    if (tweetsInfo.length > 0) {
        tweetContent.style.display = 'block';
        let row = '';
        tweetStore.forEach(tweet => {
            row = document.createElement('tr');
            row.className = 'tweet-row';
            row.innerHTML = `
            <td>${tweet.id}</td>
            <td>${tweet.tweets}</td>
            <td>${tweet.date}</td>
            <td><i class="fa fa-pencil edit-tweet"aria-hidden="true"></i></td>
            <td><i class="fa fa-trash delete-tweet" aria-hidden="true"></i></td>
            `;
            tweetList.appendChild(row);
        });
    }else{
        tweetContent.style.display = 'none';
    };
};


//Add Tweets and Validation
const addTweet =  (event) =>{
    event.preventDefault();
    const tweets = inputTweet.value;
    //unique id generate
    let id;
    if (tweetsInfo.length === 0) {
        id = 1;
    }else{
        id = tweetsInfo[tweetsInfo.length-1].id+1;
    }
    //empty field validation
    if (tweets === '') {
        message.innerHTML = `<h5 class='alert alert-danger'>You must fill up the field for submit tweets.</h5>`;
        setTimeout(() =>{
            message.innerHTML = '';
        }, 3000)
    }else{
        const data = {
            id,
            tweets,
            date: moment().calendar()
        }
        tweetsInfo.push(data);
        saveDataToLocalStorage(data);
        tweetList.innerHTML = '';
        getTweets(tweetsInfo);
        inputTweet.value = '';
        characters.textContent=0;
    }
}

//Delete tweets
const updateOrRemoveTweet = (event) =>{
    if (event.target.classList.contains('delete-tweet')) {
        //removing data from UI
        event.target.parentElement.parentElement.remove();
        //removing data from Store
        const id = parseInt(event.target.parentElement.parentElement.children[0].textContent);
        // console.log(id);
       let result =  tweetsInfo.filter((tweet) =>{
          return  tweet.id !== id  
        });
        tweetsInfo = result; 
        deleteItemFromLocalStorage(id);
    }else if (event.target.classList.contains('edit-tweet')) {
        
    }
}

//Searching
const filterTweetItem = (event) =>{
    let text = event.target.value.toLowerCase();
    let itemLength = 0;
    document.querySelectorAll('#tweet-list .tweet-row').forEach(tweetItem =>{
        const tweets = tweetItem.children[1].textContent.toLowerCase();
        if (tweets.indexOf(text) === -1) {
            tweetItem.style.display = 'none';
           ;
        }else{
            tweetItem.style.display = '';
            ++itemLength;
        }
    });
    if ( itemLength > 0 ) {
        filterMessage.innerHTML = '';
    }else{
        filterMessage.innerHTML = `<h5 class='alert alert-danger'>No Tweets Found According your Criteria.</h5>`;
        setTimeout(() =>{
           filterMessage.innerHTML = '';
        }, 5000);
    }
    
}
//Load all event listeners
function loadEventListener (){
    addTweetBtn.addEventListener('click', addTweet);
    tweetList.addEventListener('click', updateOrRemoveTweet);
    filterTweet.addEventListener('keyup', filterTweetItem);
    window.addEventListener('DOMContentLoaded', getTweets.bind(null, tweetsInfo));
}
loadEventListener();


