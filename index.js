/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

function addGamesToPage(games) {

    for(let i = 0; i < games.length; i++){

        const newDiv = document.createElement('div');
        newDiv.classList.add('game-card');
        newDiv.innerHTML = `
            <h1>${games[i].name}</h1>
            <img src=${games[i].img} alt="game image" class="game-img">
            <p>Description: ${games[i].description}</p>
            <p>Goal: ${games[i].goal}</p>
            <p>Number of Donora: ${games[i].backers}</p>
            <p>Number of Donations: ${games[i].pledged}</p>
            
        `;
        gamesContainer.append(newDiv);
    }
}

addGamesToPage(GAMES_JSON)


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

const contributionsCard = document.getElementById("num-contributions");

const totalContributions = GAMES_JSON.reduce( (sum, current) => {
    return sum + current.backers;
}, 0); 

contributionsCard.innerHTML = `${totalContributions.toLocaleString('en-US')}`

const raisedCard = document.getElementById("total-raised");

const totalRaised = GAMES_JSON.reduce( (sum, current) => {
    return sum + current.pledged;
}, 0); 

raisedCard.innerHTML = `$${totalRaised.toLocaleString('en-US')}`

const gamesCard = document.getElementById("num-games");

const totalGames = GAMES_JSON.reduce( (sum) => {
    return sum + 1;
}, 0); 

gamesCard.innerHTML = `${totalGames.toLocaleString('en-US')}`

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const listOfMatchedGames = GAMES_JSON.filter ( (game) => {
        return game.pledged < game.goal;
    });

    addGamesToPage(listOfMatchedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    const listOfMatchedGames = GAMES_JSON.filter ( (game) => {
        return game.pledged >= game.goal;
    });

    addGamesToPage(listOfMatchedGames);
}

function showAllGames() {
    deleteChildElements(gamesContainer);

    addGamesToPage(GAMES_JSON)

}

const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

const descriptionContainer = document.getElementById("description-container");

const unfundedList = GAMES_JSON.filter ( (game) => {
    return game.pledged < game.goal;
});

const unfundedCount = unfundedList.reduce( (sum) => {
    return sum + 1;
}, 0); 

const displayStr = unfundedCount == totalGames 
    ?  `A total of $${totalRaised.toLocaleString('en-US')} has been raised for ${totalGames-unfundedCount} games. All games have been funded! Thank you for your help funding these amazing games! ` 
    : `A total of $${totalRaised.toLocaleString('en-US')} has been raised for ${totalGames- unfundedCount} games. Currently, ${unfundedCount} games remain unfunded. We need your help to fund these amazing games!`


const descript = document.createElement('p');
descript.innerHTML = `<p>${displayStr}</p>`
descriptionContainer.append(descript);


/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

const [firstGame, secondGame, ...rest] = sortedGames;
const topFunded = document.createElement('p');
const secondFunded = document.createElement('p');

topFunded.innerHTML = `<p>${firstGame.name}</p>`;
secondFunded.innerHTML = `<p>${secondGame.name}</p>`;

firstGameContainer.append(topFunded);
secondGameContainer.append(secondFunded);

const searchBar = document.getElementById("search");

const gameNames = sortedGames.map((game) => {
    return game.name
});
let gameName = Object.values(gameNames);

searchBar.addEventListener("input", (e) => {
    let value = e.target.value;
    
    deleteChildElements(gamesContainer);
    const listOfMatchedGames = GAMES_JSON.filter( (game) => {
        return (game.name.toLowerCase()).includes(value.toLowerCase())
        
    });
    addGamesToPage(listOfMatchedGames);   

});