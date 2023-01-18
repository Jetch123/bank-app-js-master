'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  dates: ['2/4/2020', '22/4/2020', '26/4/2020', '2/5/2020', '12/6/2020', '23/7/2020', '22/8/2020', '2/9/2020'],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  dates: ['2/4/2020', '22/4/2020', '26/4/2020', '2/5/2020', '12/6/2020', '23/7/2020', '22/8/2020', '2/9/2020'],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  dates: ['11/2/2020', '13/5/2021', '26/4/2021', '7/8/2021', '23/9/2021', '1/2/2019', '3/2/2010', '4/4/2019'],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  dates: ['1/2/2000', '20/4/2000', '21/6/2001', '6/4/2002', '12/6/2002'],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');




const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayMovements = function(acc){
  // delete previous movements before we query next ones
  containerMovements.innerHTML = '';

  acc.movements.forEach(function(mov, i){ // mov is movement
      const type = mov > 0 ? 'deposit':'withdrawal'; 

      const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__date" id="${i}"></div>
          <div class="movements__value">${mov}</div>
      </div>
      `;

      // insertAdjacentHTML - create a row in parent element
      containerMovements.insertAdjacentHTML('afterbegin',html)
    })
    // end of forEach

    acc.dates.forEach(function(d, i){
      document.getElementById(i).textContent = d
    })
}

const user = 'Steven Thomas Williams'; //i need stw abbrevation

const createUserNames = function (arr_with_accounts) {

  arr_with_accounts.forEach(function(one_account){

    // e.g. js - jonas schmedtmann
    // we create new field 'username'
    one_account.username = one_account.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join(''); //join letters without any seperator

  // console.log(username)
  // return username;
  })
};
createUserNames(accounts)
console.log(accounts);

const updateUI = function(acc){
  displayMovements(acc)
  calcDisplayBalance(acc)
  clacDisplaySummary(acc)
}
// const deposits = movements.filter(function(mov){
//   return mov > 0;
// });

// modern way with arrow function
const deposits = movements.filter(mov => mov > 0);
const withdrawals = movements.filter(mov => mov < 0);


console.log('--movements---')
console.log(movements)
console.log('------------')
console.log(deposits)
console.log(withdrawals)

// REDUCE
// acc - accumulator - snowball
// cur - current, i - index

// const balance = movements.reduce(function (acc,cur, i, arr){
//   console.log(`Iteration ${i}: ${acc}`)
//   return acc +cur;
// }, 0)

// modern way
const balance = movements.reduce((acc,cur) => acc+cur,0);

console.log(balance)

const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc,mov) => acc+mov,0);

  labelBalance.textContent = `${acc.balance} PLN`
} 

const clacDisplaySummary = function(acc){
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc,mov) => acc+mov,0);

  labelSumIn.textContent = `${incomes} PLN`

  const outcomes = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc,mov) => acc+mov,0);

  labelSumOut.textContent = `${outcomes} PLN`

  // 1.2% of deposit
  // const interest = incomes * 0.012

  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(deposit => (deposit * acc.interestRate)/100)
  .reduce((acc,inter) => acc + inter,0);

  labelSumInterest.textContent = `${parseFloat(interest).toFixed(2)} PLN`

}


let currentAcount;
btnLogin.addEventListener('click',function(e){
  // prevent form from permiting (default behavior of web browser)
  e.preventDefault();
  currentAcount = accounts.find(acc => acc.username === inputLoginUsername.value)

  console.log(currentAcount)
  // ? - checks if current account exists 
  if(currentAcount?.pin === Number(inputLoginPin.value)){
    console.log('LOGIN OK')

    // display UI and welcome message
    labelWelcome.textContent = `Welcome back ${currentAcount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100

    updateUI(currentAcount)

    // clear input
    inputLoginUsername.value = ''
    inputLoginPin.value = ''

    startTimer()
  }
})

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, recieverAcc)
  inputTransferAmount.value = inputTransferTo.value = ''

  if(amount > 0 && 
    recieverAcc && //if obj exists
     currentAcount.balance >= amount &&
     recieverAcc.username !== currentAcount.username
     ){
       console.log('transfer valid')

      //  doing the transfer
      currentAcount.movements.push(-amount)
      recieverAcc.movements.push(amount)
      currentAcount.dates.push(getDate())
      recieverAcc.dates.push(getDate())
      updateUI(currentAcount)
     }
});

btnClose.addEventListener('click',function(e){
  e.preventDefault()
  
  if(inputCloseUsername.value === currentAcount.username &&
    Number(inputClosePin.value) === currentAcount.pin){

      //1. find index
      const index = accounts.findIndex( acc => acc.username === currentAcount.username)
      console.log(index)
      //2. delete account
      accounts.splice(index,1)
      // hide UI
      containerApp.style.opacity = 0
    }
    inputClosePin.value = inputCloseUsername.value = ''
})

btnLoan.addEventListener('click',function(e){
  e.preventDefault()
  const amount = Number(inputLoanAmount.value)
  if(amount > 0 &&
    currentAcount.movements.some( mov => mov >= amount * 0.1)){
      currentAcount.movements.push(amount)
      currentAcount.dates.push(getDate())
      updateUI(currentAcount)
  }
})

// todo - HOMEWORK
// timer at the end
// logging out

// highlight propper date
// dates for every transaction
// btn sort from high/low one time sort (original order)

//HOMEWORK
const getDate = function(){
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  let newdate = day + "/" + month + "/" + year;
  console.log(newdate)
  return newdate
}
labelDate.textContent = getDate()

//HOMEWORK
function startTimer() {
  var timer = 300;
  setInterval(function () {
      //getting minutes and seconds
      var minutes = parseInt(timer / 60, 10);
      var seconds = parseInt(timer % 60, 10);

      //adding 0 when single digit
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      labelTimer.textContent = minutes + ":" + seconds;

      //logging out when time 0
      if (--timer < 0) {
          containerApp.style.opacity = 0;
      }
  }, 1000);
}

// HOMEWORK
// Btn sort
btnSort.addEventListener('click',function(e){
  e.preventDefault()

  console.log('movenents',currentAcount.movements.sort())
  currentAcount.movements.sort(function(a,b){return a - b})
  updateUI(currentAcount)

})