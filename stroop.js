var states = [[1, "cong", 80], 
              [2, "incong", 80],
              [3, "neutr", 40]
            ]
const RED = "قرمز"
const BLUE = "آبی"
const GREEN = "سبز"
const YELLOW = "زرد"

var cong = {
  "red": [RED],
  "blue": [BLUE],
  "green": [GREEN],
  "yellow": [YELLOW],
} 

var incong = {
  "red": [BLUE, GREEN, YELLOW],
  "blue": [RED, GREEN, YELLOW],
  "green": [RED, BLUE, YELLOW],
  "yellow": [RED, BLUE, GREEN],
} 

var neutr = {
  "red": ["قربی", "آرزی","یازد","زرمق"],
  "blue": ["قربی", "آرزی","یازد","زرمق"],
  "green": ["قربی", "آرزی","یازد","زرمق"],
  "yellow": ["قربی", "آرزی","یازد","زرمق"],
}  

var the_list = null
the_list = generate()

var start_time = 0
var last_id = -1
var last_color = null
var last_text = null
var color = null
var text = null

var maxCount = 200;
var intervalMillisec = 1000;
var timeoutId;


function next(){
    last_id += 1
    if (last_id < maxCount) {
        timeoutId = window.setTimeout(show_plus, intervalMillisec);
    } else {
        the_end();
    }
    $('#answers').hide();
    choices = the_list[last_id]
    if (choices[0] == 1){
      selection = cong
    }else if (choices[0] == 2){
      selection = incong
    }else{
      selection = neutr
    }

    while(color == last_color && text == last_text){
        ind = Math.floor(10 * Math.random()); 
        while(ind>=Object.keys(selection).length){
            ind = Math.floor(10 * Math.random()); 
        }
        color = Object.keys(selection)[ind]

        items = selection[Object.keys(selection)[ind]]
        if (items.length == 1){
            text = items[0]
        }else {
            ind = Math.floor(10 * Math.random());
            while(ind>=items.length){
                ind = Math.floor(10 * Math.random()); 
            }
            text = items[ind]
        }
    }
    last_color = color
    last_text = text
    
    
    show_word(color, text)
    
}

function show_word(c, t){
  d = new Date()
  start_time = d.getTime()
  
  $('#content').css('color', c);
  $('#content').html(t);
}

function show_plus(){
  $('#answers').show();
  $('#content').css('color', "black");
  $('#content').html("+");

}

function generate(){
  const expanded = states.flatMap(s => Array(s[2]).fill(s));
  arr = shuffle(expanded)
  return arr
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


function set_reaction_time(){
  d = new Date();
  reaction_time = d.getTime() - start_time;
  state = the_list[last_id][1]
  value = {
      'state' : state, // cong , incong nuetr
      'color' : color,
      'text' : text,
      'reaction_time' : reaction_time,
      'response': $(this).text()
    }
  if(localStorage.getItem('subject_data') === null) {
    sub_data = {};
  } else {
    sub_data = JSON.parse(localStorage.getItem('subject_data'));
  }
  sub_data[last_id] = value
  localStorage.setItem('subject_data', JSON.stringify(sub_data));
  next();
}
var person = ""
$(document).ready(function(){
	person = prompt("Please enter your name or id");
	while (person == null){
		person = prompt("Please enter your name or id");
	}
  
  $('.item').click(set_reaction_time)
  $('#start').click(start);
  $('#next').click(show_intro_2);
  $('#intro_2').hide();
  $('#content').hide();
  $('#answers').hide();
  
});

function start() {
  if (localStorage.getItem('subject_data') != null){
    localStorage.setItem('subject_data', JSON.stringify({}));
  }
  $('#content').show();
  $('#startstop').hide();
  $('#answers').hide();
  next();
}

function show_intro_2(){
  $('#intro_1').hide();
  $('#intro_2').show();
}

function the_end(){
  console.log("the end")
  sub_data = JSON.parse(localStorage.getItem('subject_data'));
  export_csv(sub_data)
  $('#main').remove();
  var end = document.createElement('section');
  end.style.cssText = 'text-align:center;';
  var h1 = document.createElement('h1');
  h1.style.cssText = 'font-size:12rem;';
  h1.innerHTML = "THE END"
  end.append(h1)
  $('body').append(end)
}


function export_csv(arrayData) {
  let header =  ["state","color","text","reaction_time","response"].join(",") + '\n';
  let csv = header;
  for (var k in arrayData){
      let row = [];
      let obj = arrayData[k]
      for (key in obj) {
          if (obj.hasOwnProperty(key)) {
              row.push(obj[key]);
          }
      }
      csv += row.join(",")+"\n";
  };

	let storage_name = new Date().getTime() / 1000;
	console.log('subject-' +person+ "_"+storage_name + '.csv');
	console.log(csv);

	$.ajax({
		type: 'post',
		cache: false,
		url: 'save_data.php',
		data: { filename: 'subject-' + person+"_"+ storage_name + '.csv', filedata: csv },
		success: function (response) {
			console.log(response);
		},
		error: function () {
			console.log('Error');
		},
	});
}