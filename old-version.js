//All Selectors
const message = document.querySelector('#message');
const tweetForm = document.querySelector('#tweet-form');
const inputTweet = document.querySelector('#input-tweet');
const characters = document.querySelector('#characters');
const addTweetBtn = document.querySelector('#add-tweet');
const filterTweet = document.querySelector('#filter-tweets');
const filterMessage = document.querySelector('#filter-message');
const tweetList = document.querySelector('#tweet-list');

//Environment Set Up
const maxLength = 250;

//Length Validation
inputTweet.onkeydown = () =>{
    const counter = inputTweet.value.length;
    const remainingCharacter = maxLength - counter;
    characters.innerHTML = counter;
    if (remainingCharacter < 0) {
        message.innerHTML = `<h5 class='alert alert-danger'>Your tweets must not type
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

// Data Save On LocalStorage
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

//Delete data from localStorage
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
    if (tweetStore.length > 0) {
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

//populate form
function populateForm(tweetsInfo){
    inputTweet.value = tweetsInfo.tweets;
}
//Edit
function findTweet(id){
   return tweetsInfo.find(tweet => tweet.id === id )
}

//update tweet
function updateTweet(event, id){
    event.preventDefault();
    const tweets = inputTweet.value;
    //console.log(inputTweet.value);
    const tweetsWithUpdate = tweetsInfo.map(tweet =>{
        if (tweet.id === id) {
            return {
                ...tweet,
                tweets: tweets,
            }
        }else{
            return tweet;
        }
    });
    //data source update
    tweetsInfo = tweetsWithUpdate;
    //update UI data
    tweetList.innerHTML = '';
    getTweets(tweetsInfo);
    //update to localStorage
    localStorage.setItem('tweetItems', JSON.stringify(tweetsInfo));

}

function initialAddState(){
    //removing update Button
    document.querySelector('#update-tweet').remove();
    //display add button
    addTweetBtn.style.display = 'block';
   // reset value
    inputTweet.value = '';
}


//Delete tweets
const updateOrRemoveTweet = (event) =>{
    if (event.target.classList.contains('delete-tweet')) {
        confirm(`Are you sure to delete this tweet`);
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
        const id = parseInt(event.target.parentElement.parentElement.children[0].textContent);
        const foundTweet = findTweet(id);
        //console.log(foundTweet);
        populateForm(foundTweet);
        //remove add tweet btn
        addTweetBtn.style.display = 'none';
        //add update button
        const updateTweetBtn = `<button class="btn btn-info btn-lg m-auto" id="update-tweet">Update</button>`;
        //insert into DOM
        tweetForm.insertAdjacentHTML('beforeend', updateTweetBtn);
        //update
        document.querySelector('#update-tweet').addEventListener('click',(event) =>{
            updateTweet(event, id);
            //return to add state
             initialAddState();
        });
        

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


