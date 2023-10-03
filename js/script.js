import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


let newTweetsArray = []
if(JSON.parse(localStorage.getItem("newTweetsArray"))){
    getCommentsLS()
}
let currentTweetsData = []
if(localStorage.getItem("currentTweetsData")){
  getInterationLS()
}
 

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
})

function getCommentsLS(){
    newTweetsArray = JSON.parse(localStorage.getItem("newTweetsArray"))
    newTweetsArray.forEach(function(tweet){
        tweetsData.unshift(tweet)
    })
}

function getInterationLS(){
    currentTweetsData = JSON.parse(localStorage.getItem("currentTweetsData"))
  currentTweetsData.forEach(function(tweet){
    tweetsData.splice(currentTweetsData.indexOf(tweet), 1, tweet)
  })
}
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    const specificIndexObj = tweetsData.indexOf(targetTweetObj)

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked

    tweetsData.splice(specificIndexObj, 1, targetTweetObj)
    updateTweetsData()
    render(tweetsData)
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    const specificIndexObj = tweetsData.indexOf(targetTweetObj)
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    tweetsData.splice(specificIndexObj, 1, targetTweetObj)
    updateTweetsData()
    render(tweetsData) 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        const newTweet = {
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        }
        tweetsData.unshift(newTweet)
        newTweetsArray.push(newTweet)
        localStorage.setItem("newTweetsArray", JSON.stringify(newTweetsArray))
        tweetInput.value = ''
        updateTweetsData()
        render(currentTweetsData)
    }
}

function getFeedHtml(data){
    let feedHtml = ``
    
    data.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <div class="profile-pic" style=
            "background-image:url('${tweet.profilePic}');">
        </div>
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(data){
  document.getElementById('feed').innerHTML = getFeedHtml(data)
}

function updateTweetsData(){
  currentTweetsData = tweetsData
  localStorage.setItem("currentTweetsData", JSON.stringify(currentTweetsData))
}

if(!localStorage.getItem("currentTweetsData")){
    render(tweetsData)
}else{
    render(currentTweetsData)
}
