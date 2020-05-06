// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]
const baseURL = 'https://jservice.io/api/';
let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

function getCategoryIds() {
	const categoryArry = [];
	let currentCategory;
	while (categoryArry.length < 6) {
		currentCategory = Math.ceil(Math.random() * 10000);
		if (!categoryArry.includes(currentCategory)) {
			categoryArry.push(currentCategory);
		}
	}
	return categoryArry;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
	const res = await axios.get(`${baseURL}category?id=${catId}`);
	if (res) {
		let returnObj = { title: res.data.title, clues: res.data.clues.slice(0, 5) };
		returnObj.clues = returnObj.clues.map((element) => {
			return { question: element.question, answer: element.answer, showing: null };
		});
		return returnObj;
	}
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

function fillTable() {
	//select table head and table body
	const thead = document.querySelector('thead');
	const tbody = document.querySelector('tbody');
	//clear thead and tbody
	thead.innerHTML = '';
	tbody.innerHTML = '';
	//create element for thead Row
	const theadRow = document.createElement('tr');
	//create eletments for tbody Rows
	let tbodyRows = [ 'row1', 'row2', 'row3', 'row4', 'row5' ];
	tbodyRows = tbodyRows.map((val) => {
		return document.createElement('tr');
	});
	//For loop to go through categories and add in data
    console.log(categories[0]);
    console.log(categories);
	for (let category of categories) {
		//create & append td for thead row
		let theadel = document.createElement('TD');
		theadel.innerText = category.title;
		theadRow.append(theadel);
		console.log(theadRow);
		//loop to add td into tbody
		for (let i = 0; i < category.clues.length; i++) {
			let tbodyel = document.createElement('TD');
			tbodyel.dataset.question = category.clues[i].question;
			tbodyel.dataset.answer = category.clues[i].answer;
			tbodyel.innerText = '?';
			tbodyel.dataset.status = 'nothing';
			tbodyRows[i].append(tbodyel);
		}
	}

	console.log(theadRow);
	console.log(tbodyRows);
	//add thead row and tobody rows to DOM
	thead.append(theadRow);
	tbodyRows.forEach((val) => {
		tbody.append(val);
	});
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
	target = evt.target;
	if (target.tagName === 'TD') {
		if (target.dataset.status === 'nothing') {
			target.innerText = target.dataset.question;
			target.dataset.status = 'question';
		} else if (target.dataset.status === 'question') {
			target.innerText = target.dataset.answer;
			target.dataset.status = 'answer';
		}
	}
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    const categoriesArray = getCategoryIds();
    
    const container = await fetchingData(categoriesArray);
    categories = container;
	console.log(categories);
	fillTable();
}

async function fetchingData(arr){
    const awaitArray =[];
    await asyncForEach(arr,async function(val) {
		const categoryData = await getCategory(val);
		awaitArray.push(categoryData);
    })
    return awaitArray;
}


/** On click of restart button, restart game. */
const restart = document.querySelector('#restart');
restart.addEventListener('click', async function() {
	categories = [];
	await setupAndStart();
});
// TODO

/** On page load, setup and start & add event handler for clicking clues */
window.addEventListener('DOMContentLoaded', async function(event) {
	await setupAndStart();
	const jeopardyTable = document.querySelector('#jeopardy');
	jeopardyTable.addEventListener('click', handleClick);
});

//New for each methodes to avoiding not awaiting for result;
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }