(function(){

var TOTAL_STEPS = 5;
var currentStep = 1;
var answers = {
  name: '', age: null, eaters: 1, kids: '', schedule: '',
  allergies: '', dislikes: '', cooktime: '', whole30: '',
  goal: '', timeframe: '', blockers: '',
  wodays: '', wotime: '', equipment: '', injuries: ''
};

function renderDots(){
  var wrap = document.getElementById('progressDots');
  wrap.innerHTML = '';
  for (var i=1;i<=TOTAL_STEPS;i++){
    var d = document.createElement('div');
    d.className = 'dot' + (i < currentStep ? ' done' : '') + (i === currentStep ? ' active' : '');
    wrap.appendChild(d);
  }
  var labels = ['The basics','Food and kitchen','Your goal','Workouts','Review'];
  document.getElementById('stepLabel').textContent = 'Step ' + currentStep + ' of ' + TOTAL_STEPS + ' \u2014 ' + labels[currentStep-1];
}

function showStep(n){
  document.querySelectorAll('.step').forEach(function(s){
    s.classList.toggle('visible', parseInt(s.dataset.step,10) === n);
  });
  document.getElementById('backBtn').disabled = (n === 1);
  document.getElementById('nextBtn').textContent = (n === TOTAL_STEPS) ? 'Generate my plan' : 'Continue';
  if (n === TOTAL_STEPS) buildReview();
  renderDots();
  window.scrollTo({top:0, behavior:'smooth'});
}

document.querySelectorAll('.choice-group').forEach(function(group){
  group.addEventListener('click', function(e){
    var choice = e.target.closest('.choice');
    if (!choice) return;
    group.querySelectorAll('.choice').forEach(function(c){ c.classList.remove('selected'); });
    choice.classList.add('selected');
  });
});

function getSelected(groupId){
  var sel = document.querySelector('#'+groupId+' .choice.selected');
  return sel ? sel.dataset.value : '';
}

function collectStep(n){
  if (n===1){
    answers.name = document.getElementById('name').value.trim();
    answers.age = document.getElementById('age').value;
    answers.eaters = document.getElementById('eaters').value || 1;
    answers.kids = getSelected('kidsGroup');
    answers.schedule = document.getElementById('schedule').value;
  } else if (n===2){
    answers.allergies = document.getElementById('allergies').value.trim();
    answers.dislikes = document.getElementById('dislikes').value.trim();
    answers.cooktime = getSelected('cooktimeGroup');
    answers.whole30 = document.getElementById('whole30').value;
  } else if (n===3){
    answers.goal = getSelected('goalGroup');
    answers.timeframe = document.getElementById('timeframe').value;
    answers.blockers = document.getElementById('blockers').value.trim();
  } else if (n===4){
    answers.wodays = document.getElementById('wodays').value;
    answers.wotime = document.getElementById('wotime').value;
    answers.equipment = getSelected('equipGroup');
    answers.injuries = document.getElementById('injuries').value.trim();
  }
}

function validateStep(n){
  var ok = true;
  if (n===1) ok = answers.age && answers.eaters;
  if (n===2) ok = !!answers.cooktime;
  if (n===3) ok = !!answers.goal;
  if (n===4) ok = answers.wodays && answers.wotime && answers.equipment;
  var errEl = document.getElementById('err'+n);
  if (errEl) errEl.classList.toggle('show', !ok);
  return ok;
}

document.getElementById('nextBtn').addEventListener('click', function(){
  collectStep(currentStep);
  if (!validateStep(currentStep)) return;
  if (currentStep === TOTAL_STEPS){
    generatePlan();
    return;
  }
  currentStep++;
  showStep(currentStep);
});

document.getElementById('backBtn').addEventListener('click', function(){
  if (currentStep === 1) return;
  currentStep--;
  showStep(currentStep);
});

function buildReview(){
  var kidsText = {'no':'No kids at home','yes-young':'Young kids at home','yes-older':'Older kids/teens at home','yes-both':'Mix of ages at home'}[answers.kids] || 'Not specified';
  var goalText = {'weight-loss':'Lose weight','energy':'More energy / feel better','muscle':'Build strength','reset':'Reset habits'}[answers.goal] || 'Not specified';
  var equipText = {'none':'Bodyweight only','dumbbells':'Dumbbells at home','bands':'Resistance bands','gym':'Full gym access'}[answers.equipment] || 'Not specified';
  var cookText = {'15':'15 min or less','30':'About 30 min','45':'45\u201360 min','batch':'Batch cooking'}[answers.cooktime] || 'Not specified';

  var items = [
    ['Name', answers.name || '\u2014'],
    ['Age', answers.age || '\u2014'],
    ['Eating this plan', answers.eaters + (answers.eaters == 1 ? ' person' : ' people')],
    ['Household', kidsText],
    ['Allergies to avoid', answers.allergies || 'None listed'],
    ['Dislikes to avoid', answers.dislikes || 'None listed'],
    ['Weeknight cook time', cookText],
    ['Main goal', goalText],
    ['Workout days/week', answers.wodays || '\u2014'],
    ['Minutes per session', answers.wotime || '\u2014'],
    ['Equipment', equipText]
  ];
  var ul = document.getElementById('reviewList');
  ul.innerHTML = '';
  items.forEach(function(pair){
    var li = document.createElement('li');
    li.innerHTML = '<span>'+pair[0]+'</span><span>'+pair[1]+'</span>';
    ul.appendChild(li);
  });
}

// ---------- DATA LIBRARIES ----------

var breakfasts = [
  { name:'Veggie egg white scramble', tags:['eggs'], ing:[
    {item:'Egg whites', qty:1, unit:'cup', cat:'protein'},
    {item:'Bell pepper', qty:0.5, unit:'each', cat:'produce'},
    {item:'Spinach', qty:1, unit:'cup', cat:'produce'},
    {item:'Yellow onion', qty:0.25, unit:'each', cat:'produce'},
    {item:'Compliant salsa', qty:2, unit:'tbsp', cat:'pantry'}
  ]},
  { name:'Turkey and sweet potato hash', tags:['pork'], ing:[
    {item:'Ground turkey (93/7)', qty:4, unit:'oz', cat:'protein'},
    {item:'Sweet potato', qty:0.5, unit:'each', cat:'produce'},
    {item:'Yellow onion', qty:0.25, unit:'each', cat:'produce'},
    {item:'Spinach', qty:1, unit:'cup', cat:'produce'}
  ]},
  { name:'Shrimp and veggie skillet', tags:['shellfish'], ing:[
    {item:'Shrimp', qty:4, unit:'oz', cat:'protein'},
    {item:'Zucchini', qty:0.5, unit:'each', cat:'produce'},
    {item:'Cherry tomatoes', qty:0.5, unit:'cup', cat:'produce'},
    {item:'Garlic', qty:1, unit:'clove', cat:'produce'}
  ]},
  { name:'Protein egg muffins', tags:['eggs','pork'], ing:[
    {item:'Eggs', qty:2, unit:'each', cat:'protein'},
    {item:'Egg whites', qty:0.5, unit:'cup', cat:'protein'},
    {item:'Compliant turkey bacon', qty:1, unit:'oz', cat:'protein'},
    {item:'Spinach', qty:0.5, unit:'cup', cat:'produce'},
    {item:'Mushrooms', qty:0.5, unit:'cup', cat:'produce'}
  ]},
  { name:'Chicken sausage and greens scramble', tags:['eggs'], ing:[
    {item:'Compliant chicken sausage', qty:2, unit:'oz', cat:'protein'},
    {item:'Eggs', qty:1, unit:'each', cat:'protein'},
    {item:'Kale', qty:1, unit:'cup', cat:'produce'}
  ]},
  { name:'Tuna salad lettuce wraps', tags:['fish'], ing:[
    {item:'Canned tuna', qty:1, unit:'can', cat:'protein'},
    {item:'Celery', qty:1, unit:'stalk', cat:'produce'},
    {item:'Compliant mayo', qty:1, unit:'tbsp', cat:'pantry'},
    {item:'Romaine lettuce', qty:3, unit:'leaves', cat:'produce'}
  ]}
];

var lunches = [
  { name:'Grilled chicken and roasted veg bowl', tags:[], ing:[
    {item:'Chicken breast', qty:5, unit:'oz', cat:'protein'},
    {item:'Broccoli', qty:1, unit:'cup', cat:'produce'},
    {item:'Carrots', qty:0.5, unit:'cup', cat:'produce'},
    {item:'Cauliflower rice', qty:1, unit:'cup', cat:'produce'}
  ]},
  { name:'Turkey lettuce wraps', tags:[], ing:[
    {item:'Ground turkey (93/7)', qty:5, unit:'oz', cat:'protein'},
    {item:'Romaine lettuce', qty:4, unit:'leaves', cat:'produce'},
    {item:'Cucumber', qty:0.5, unit:'each', cat:'produce'},
    {item:'Carrots', qty:0.25, unit:'cup', cat:'produce'},
    {item:'Coconut aminos', qty:1, unit:'tbsp', cat:'pantry'}
  ]},
  { name:'Tuna salad over greens', tags:['fish'], ing:[
    {item:'Canned tuna', qty:1, unit:'can', cat:'protein'},
    {item:'Mixed greens', qty:2, unit:'cup', cat:'produce'},
    {item:'Cucumber', qty:0.5, unit:'each', cat:'produce'},
    {item:'Tomato', qty:0.5, unit:'each', cat:'produce'}
  ]},
  { name:'Shrimp and zucchini noodles', tags:['shellfish'], ing:[
    {item:'Shrimp', qty:5, unit:'oz', cat:'protein'},
    {item:'Zucchini noodles', qty:1.5, unit:'cup', cat:'produce'},
    {item:'Cherry tomatoes', qty:0.5, unit:'cup', cat:'produce'},
    {item:'Garlic', qty:1, unit:'clove', cat:'produce'}
  ]},
  { name:'Chicken and veggie soup', tags:[], ing:[
    {item:'Chicken breast', qty:4, unit:'oz', cat:'protein'},
    {item:'Carrots', qty:0.5, unit:'cup', cat:'produce'},
    {item:'Celery', qty:1, unit:'stalk', cat:'produce'},
    {item:'Yellow onion', qty:0.25, unit:'each', cat:'produce'},
    {item:'Compliant bone broth', qty:1.5, unit:'cup', cat:'pantry'}
  ]},
  { name:'Lean beef and veggie stir-fry', tags:['beef'], ing:[
    {item:'Lean beef strips', qty:5, unit:'oz', cat:'protein'},
    {item:'Broccoli', qty:1, unit:'cup', cat:'produce'},
    {item:'Bell pepper', qty:0.5, unit:'each', cat:'produce'},
    {item:'Coconut aminos', qty:1, unit:'tbsp', cat:'pantry'}
  ]}
];

var dinners = [
  { name:'Baked white fish and asparagus', tags:['fish'], ing:[
    {item:'White fish fillet', qty:6, unit:'oz', cat:'protein'},
    {item:'Asparagus', qty:1, unit:'cup', cat:'produce'},
    {item:'Lemon', qty:0.5, unit:'each', cat:'produce'}
  ]},
  { name:'Turkey meatballs and spaghetti squash', tags:[], ing:[
    {item:'Ground turkey (93/7)', qty:6, unit:'oz', cat:'protein'},
    {item:'Spaghetti squash', qty:1, unit:'cup', cat:'produce'},
    {item:'Compliant marinara', qty:0.75, unit:'cup', cat:'pantry'}
  ]},
  { name:'Grilled chicken fajita bowl', tags:[], ing:[
    {item:'Chicken breast', qty:6, unit:'oz', cat:'protein'},
    {item:'Bell pepper', qty:1, unit:'each', cat:'produce'},
    {item:'Yellow onion', qty:0.5, unit:'each', cat:'produce'},
    {item:'Cauliflower rice', qty:1, unit:'cup', cat:'produce'}
  ]},
  { name:'Pork tenderloin and roasted vegetables', tags:['pork'], ing:[
    {item:'Pork tenderloin', qty:6, unit:'oz', cat:'protein'},
    {item:'Brussels sprouts', qty:1, unit:'cup', cat:'produce'},
    {item:'Carrots', qty:0.5, unit:'cup', cat:'produce'}
  ]},
  { name:'Shrimp skewers and grilled veggies', tags:['shellfish'], ing:[
    {item:'Shrimp', qty:6, unit:'oz', cat:'protein'},
    {item:'Zucchini', qty:0.5, unit:'each', cat:'produce'},
    {item:'Bell pepper', qty:0.5, unit:'each', cat:'produce'}
  ]},
  { name:'Lean beef and sweet potato skillet', tags:['beef'], ing:[
    {item:'Lean ground beef (93/7)', qty:6, unit:'oz', cat:'protein'},
    {item:'Sweet potato', qty:0.75, unit:'each', cat:'produce'},
    {item:'Spinach', qty:1, unit:'cup', cat:'produce'}
  ]}
];

var snacks = [
  { name:'Hard-boiled eggs and cucumber', tags:['eggs'], ing:[
    {item:'Eggs', qty:2, unit:'each', cat:'protein'},
    {item:'Cucumber', qty:0.5, unit:'each', cat:'produce'}
  ]},
  { name:'Turkey roll-ups', tags:[], ing:[
    {item:'Sliced turkey breast', qty:3, unit:'oz', cat:'protein'},
    {item:'Cucumber', qty:0.25, unit:'each', cat:'produce'}
  ]},
  { name:'Tuna and celery', tags:['fish'], ing:[
    {item:'Canned tuna', qty:0.5, unit:'can', cat:'protein'},
    {item:'Celery', qty:1, unit:'stalk', cat:'produce'}
  ]},
  { name:'Apple with a few almonds', tags:['nuts'], ing:[
    {item:'Apple', qty:1, unit:'each', cat:'produce'},
    {item:'Almonds', qty:6, unit:'each', cat:'pantry'}
  ]}
];

var tagKeywords = {
  shellfish: ['shrimp','shellfish','crab','lobster'],
  fish: ['fish','tuna','salmon','cod','tilapia'],
  eggs: ['egg'],
  pork: ['pork','bacon'],
  beef: ['beef'],
  nuts: ['almond','nut','cashew','walnut','pecan']
};

function buildAvoidTags(allergyStr, dislikeStr){
  var raw = (allergyStr + ',' + dislikeStr).toLowerCase().split(',').map(function(s){return s.trim();}).filter(Boolean);
  var avoidTags = [];
  var avoidWords = [];
  raw.forEach(function(word){
    var matched = false;
    Object.keys(tagKeywords).forEach(function(tag){
      if (tagKeywords[tag].some(function(k){ return word.indexOf(k) > -1 || k.indexOf(word) > -1; })){
        avoidTags.push(tag);
        matched = true;
      }
    });
    if (!matched && word) avoidWords.push(word);
  });
  return { tags: avoidTags, words: avoidWords };
}

function mealAllowed(meal, avoid){
  var text = meal.name.toLowerCase() + ' ' + meal.ing.map(function(i){return i.item.toLowerCase();}).join(' ');
  if (meal.tags.some(function(t){ return avoid.tags.indexOf(t) > -1; })) return false;
  if (avoid.words.some(function(w){ return text.indexOf(w) > -1; })) return false;
  return true;
}

function filterLib(lib, avoid){
  var filtered = lib.filter(function(m){ return mealAllowed(m, avoid); });
  return filtered.length ? filtered : lib;
}

function pickRotation(lib, days){
  var picks = [];
  var pool = lib.slice();
  for (var i=0;i<days;i++){
    if (pool.length === 0) pool = lib.slice();
    var idx = i % pool.length;
    picks.push(pool[idx]);
  }
  return picks;
}

var dayNames = ['Day 1','Day 2','Day 3','Day 4','Day 5','Day 6','Day 7'];

function renderMealPlan(bfSel, luSel, diSel, snSel){
  var html = '';
  for (var i=0;i<7;i++){
    html += '<div class="day-card"><h3>'+dayNames[i]+'</h3>';
    html += '<div class="meal-row"><span class="tag">Breakfast</span><span class="name">'+bfSel[i].name+'</span></div>';
    html += '<div class="meal-row"><span class="tag">Lunch</span><span class="name">'+luSel[i].name+'</span></div>';
    html += '<div class="meal-row"><span class="tag">Dinner</span><span class="name">'+diSel[i].name+'</span></div>';
    html += '<div class="meal-row"><span class="tag">Snack</span><span class="name">'+snSel[i].name+'</span></div>';
    html += '</div>';
  }
  document.getElementById('panel-meals').innerHTML = html;
}

function roundQty(n){
  var r = Math.round(n * 4) / 4;
  if (r % 1 === 0) return r.toString();
  return r.toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
}

function renderShoppingList(allMeals, multiplier){
  var totals = {};
  var order = [];
  allMeals.forEach(function(meal){
    meal.ing.forEach(function(ing){
      var key = ing.item + '|' + ing.unit;
      if (!totals[key]){
        totals[key] = { item: ing.item, unit: ing.unit, qty: 0, cat: ing.cat };
        order.push(key);
      }
      totals[key].qty += ing.qty;
    });
  });
  var byCat = { protein: [], produce: [], pantry: [] };
  order.forEach(function(key){
    var t = totals[key];
    t.qty = t.qty * multiplier;
    if (byCat[t.cat]) byCat[t.cat].push(t);
  });
  var catLabels = { protein: 'Protein', produce: 'Produce', pantry: 'Pantry and compliant staples' };
  var html = '';
  ['protein','produce','pantry'].forEach(function(cat){
    if (!byCat[cat].length) return;
    html += '<div class="shop-cat"><h3>'+catLabels[cat]+'</h3>';
    byCat[cat].sort(function(a,b){ return a.item.localeCompare(b.item); }).forEach(function(t){
      html += '<div class="shop-item"><span>'+t.item+'</span><span class="qty">'+roundQty(t.qty)+' '+t.unit+(t.qty==1?'':(t.unit.endsWith('s')?'':'s'))+'</span></div>';
    });
    html += '</div>';
  });
  document.getElementById('panel-shopping').innerHTML = html;
}

// ---------- WORKOUT LIBRARY ----------

var workoutTemplates = {
  none: {
    'Full body A': [['Bodyweight squats','3 x 15'],['Push-ups (knee okay)','3 x 10'],['Walking lunges','3 x 12/side'],['Glute bridges','3 x 15'],['Plank hold','3 x 30 sec'],['Mountain climbers','3 x 20']],
    'Full body B': [['Jump squats or step-ups','3 x 12'],['Pike push-ups','3 x 10'],['Reverse lunges','3 x 12/side'],['Superman holds','3 x 15'],['Side plank','2 x 30 sec/side'],['High knees','3 x 30 sec']],
    'Cardio and core': [['Jumping jacks','4 x 30 sec'],['High knees','4 x 30 sec'],['Burpees (modified okay)','3 x 10'],['Bicycle crunches','3 x 20'],['Plank to downward dog','3 x 10'],['Mountain climbers','3 x 30 sec']],
    'Lower body focus': [['Goblet squats (hold anything heavy)','3 x 15'],['Glute bridges','3 x 20'],['Curtsy lunges','3 x 10/side'],['Wall sit','3 x 30 sec'],['Calf raises','3 x 20']],
    'Upper body focus': [['Push-ups','4 x 10'],['Tricep dips on a chair','3 x 12'],['Pike push-ups','3 x 8'],['Superman rows','3 x 15'],['Plank shoulder taps','3 x 20']],
    'Core and mobility': [['Dead bugs','3 x 12/side'],['Bird-dogs','3 x 12/side'],['Plank hold','3 x 30 sec'],['Side plank','2 x 20 sec/side'],['Cat-cow and hip openers','5 min flow']]
  },
  dumbbells: {
    'Full body A': [['Goblet squats','3 x 12'],['Dumbbell rows','3 x 12/side'],['Dumbbell shoulder press','3 x 10'],['Romanian deadlifts','3 x 12'],['Plank hold','3 x 30 sec']],
    'Full body B': [['Reverse lunges','3 x 10/side'],['Dumbbell chest press','3 x 12'],['Dumbbell deadlifts','3 x 10'],['Bent-over rows','3 x 12'],['Bicep curls','2 x 12']],
    'Cardio and core': [['Dumbbell thrusters','3 x 12'],['Renegade rows','3 x 10'],['Jump squats','3 x 15'],['Russian twists with weight','3 x 20'],['Plank pull-throughs','3 x 12']],
    'Lower body focus': [['Dumbbell squats','4 x 12'],['Walking lunges','3 x 12/side'],['Romanian deadlifts','3 x 12'],['Glute bridges with weight','3 x 15'],['Calf raises with weight','3 x 20']],
    'Upper body focus': [['Dumbbell chest press','4 x 10'],['Dumbbell rows','3 x 12'],['Shoulder press','3 x 10'],['Bicep curls','3 x 12'],['Tricep kickbacks','3 x 12']],
    'Core and mobility': [['Weighted dead bugs','3 x 12'],['Russian twists','3 x 20'],['Side bends','3 x 12/side'],['Plank hold','3 x 30 sec'],['Hip flexor stretch flow','5 min']]
  },
  bands: {
    'Full body A': [['Band squats','3 x 15'],['Band rows','3 x 15'],['Band shoulder press','3 x 12'],['Band deadlifts','3 x 15'],['Plank hold','3 x 30 sec']],
    'Full body B': [['Band lateral walks','3 x 12/side'],['Band chest press','3 x 15'],['Band pull-aparts','3 x 15'],['Band glute kickbacks','3 x 12/side'],['Band bicep curls','2 x 15']],
    'Cardio and core': [['Band jumping jacks','4 x 30 sec'],['Band woodchoppers','3 x 12/side'],['Fast feet with band','3 x 30 sec'],['Band-resisted crunches','3 x 20']],
    'Lower body focus': [['Band squats','4 x 15'],['Band clamshells','3 x 15/side'],['Band deadlifts','3 x 15'],['Band glute bridges','3 x 15'],['Band side steps','3 x 12/side']],
    'Upper body focus': [['Band chest press','4 x 15'],['Band rows','3 x 15'],['Band shoulder press','3 x 12'],['Band tricep pushdowns','3 x 15']],
    'Core and mobility': [['Band dead bugs','3 x 12'],['Band pull-aparts','3 x 15'],['Plank hold','3 x 30 sec'],['Band-assisted stretch flow','5 min']]
  },
  gym: {
    'Full body A': [['Barbell or dumbbell squats','3 x 10'],['Lat pulldown','3 x 12'],['Chest press machine','3 x 12'],['Leg press','3 x 12'],['Plank hold','3 x 30 sec']],
    'Full body B': [['Deadlifts','3 x 8'],['Cable rows','3 x 12'],['Shoulder press machine','3 x 10'],['Walking lunges','3 x 12/side'],['Cable crunches','3 x 15']],
    'Cardio and core': [['Treadmill or bike intervals','15 min'],['Cable woodchoppers','3 x 12/side'],['Hanging or lying leg raises','3 x 12'],['Plank hold','3 x 30 sec']],
    'Lower body focus': [['Leg press','4 x 12'],['Walking lunges','3 x 12/side'],['Leg curl machine','3 x 12'],['Hip thrusts','3 x 15'],['Calf raise machine','3 x 20']],
    'Upper body focus': [['Chest press machine','4 x 10'],['Lat pulldown','3 x 12'],['Shoulder press machine','3 x 10'],['Cable tricep pushdown','3 x 12'],['Bicep curl machine','3 x 12']],
    'Core and mobility': [['Cable crunches','3 x 15'],['Hanging leg raises','3 x 10'],['Plank hold','3 x 30 sec'],['Foam roll and stretch flow','8 min']]
  }
};

function pickWorkoutSplit(days){
  if (days <= 2) return ['Full body A','Full body B'];
  if (days === 3) return ['Full body A','Full body B','Cardio and core'];
  if (days === 4) return ['Upper body focus','Lower body focus','Full body A','Cardio and core'];
  if (days === 5) return ['Upper body focus','Lower body focus','Full body A','Full body B','Cardio and core'];
  return ['Upper body focus','Lower body focus','Full body A','Upper body focus','Lower body focus','Core and mobility'];
}

function exerciseCountForTime(time){
  if (time === '20') return 4;
  if (time === '30') return 5;
  if (time === '45') return 6;
  return 8;
}

function renderWorkoutPlan(equip, daysPerWeek, time, injuries){
  var templates = workoutTemplates[equip] || workoutTemplates.none;
  var split = pickWorkoutSplit(parseInt(daysPerWeek,10));
  var exCount = exerciseCountForTime(time);
  var schedule = [];
  var splitIdx = 0;
  var pattern = restPattern(7, parseInt(daysPerWeek,10));
  for (var i=0;i<7;i++){
    if (pattern[i]){
      schedule.push({ day: dayNames[i], template: split[splitIdx % split.length], rest:false });
      splitIdx++;
    } else {
      schedule.push({ day: dayNames[i], rest:true });
    }
  }
  var html = '';
  if (injuries){
    html += '<div class="note-box" style="margin-top:0; margin-bottom:1.2rem;">Noted limitation: <strong style="color:var(--ink);">'+escapeHtml(injuries)+'</strong>. Swap any exercise that aggravates this for a comfortable alternative, or check with a physical therapist before starting.</div>';
  }
  schedule.forEach(function(d){
    html += '<div class="w-day">';
    if (d.rest){
      html += '<div class="wd-head"><h3>'+d.day+'</h3><span class="rest">Rest or light walk</span></div>';
    } else {
      var exercises = templates[d.template].slice(0, exCount);
      html += '<div class="wd-head"><h3>'+d.day+' &mdash; '+d.template+'</h3><span class="meta">'+time+' min</span></div>';
      exercises.forEach(function(ex){
        html += '<div class="ex-row"><span>'+ex[0]+'</span><span class="reps">'+ex[1]+'</span></div>';
      });
    }
    html += '</div>';
  });
  document.getElementById('panel-workout').innerHTML = html;
}

function restPattern(totalDays, workoutDays){
  var pattern = new Array(totalDays).fill(false);
  if (workoutDays >= totalDays){ return new Array(totalDays).fill(true); }
  var spacing = totalDays / workoutDays;
  var placed = 0;
  var pos = 0;
  while (placed < workoutDays){
    var idx = Math.round(pos) % totalDays;
    if (!pattern[idx]){ pattern[idx] = true; placed++; }
    pos += spacing;
  }
  return pattern;
}

function escapeHtml(s){
  var div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function generatePlan(){
  var avoid = buildAvoidTags(answers.allergies, answers.dislikes);
  var bfLib = filterLib(breakfasts, avoid);
  var luLib = filterLib(lunches, avoid);
  var diLib = filterLib(dinners, avoid);
  var snLib = filterLib(snacks, avoid);

  var bfSel = pickRotation(bfLib, 7);
  var luSel = pickRotation(luLib, 7);
  var diSel = pickRotation(diLib, 7);
  var snSel = pickRotation(snLib, 7);

  renderMealPlan(bfSel, luSel, diSel, snSel);
  renderShoppingList(bfSel.concat(luSel, diSel, snSel), parseFloat(answers.eaters) || 1);
  renderWorkoutPlan(answers.equipment, answers.wodays, answers.wotime, answers.injuries);

  var resultSummary = 'Day 1 - Breakfast: ' + bfSel[0].name + '; Lunch: ' + luSel[0].name +
    '; Dinner: ' + diSel[0].name + '; Snack: ' + snSel[0].name +
    '; Workout: ' + answers.wodays + ' days/week, ' + answers.equipment + ' equipment';
  logAssessmentSubmission(resultSummary);

  document.getElementById('forName').textContent = answers.name ? ('Built for ' + answers.name) : '';
  document.getElementById('wizard').style.display = 'none';
  document.getElementById('results').style.display = 'block';
  window.scrollTo({top:0, behavior:'smooth'});
}

function logAssessmentSubmission(resultSummary){
  if (typeof RESET_TOOLKIT_CONFIG === 'undefined') return;
  var url = RESET_TOOLKIT_CONFIG.SHEET_WEB_APP_URL;
  if (!url || url.indexOf('PASTE_YOUR') > -1) return;

  var body = new URLSearchParams();
  body.append('formType', 'assessment');
  Object.keys(answers).forEach(function(key){
    body.append(key, answers[key] === null || answers[key] === undefined ? '' : answers[key]);
  });
  body.append('resultSummary', resultSummary);

  fetch(url, { method: 'POST', mode: 'no-cors', body: body }).catch(function(){
    /* logging is best-effort; a failed request should never block the client's plan from showing */
  });
}

document.querySelectorAll('.tab-btn').forEach(function(btn){
  btn.addEventListener('click', function(){
    document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
    document.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('panel-'+btn.dataset.tab).classList.add('active');
  });
});

document.getElementById('startOverBtn').addEventListener('click', function(){
  document.getElementById('results').style.display = 'none';
  document.getElementById('wizard').style.display = 'block';
  currentStep = 1;
  showStep(1);
});

renderDots();

})();
