/**
 * Passes in the Lectora group and displays all it's children.
 * @param {*} group refers to the Lectora object being referred to
 * @returns all the items that are within the Lectora group 
 * 
 */
function pageUpdate(group){
    let children=[];
    group.childArray.forEach(x=>{
        let loc = group.childArray.indexOf(x);
        
        let childObj = triv$("#"+x, getDisplayDocument());
        
        children[loc] = childObj;
        triv$(childObj).css("visibility","inherit");
        if(childObj[0].classList.contains("a_box")){
            setOpacity(childObj,VaropacityValue.defVal);
        }
        
        if(childObj[0].classList.contains("luckyCharm")){
            let regex= new RegExp(childObj[0].id);
            if(!regex.test(VariconList.value)){
                updateProgress(childObj[0].id);
            }
        }
        
        
    });
    
    return children;
}

/**
 * set the opacity for an object
 * @param {*} object item that will have it's opacity affected
 * @param {*} opacity opactity that will be set
 * @returns 
 */
function setOpacity(object,opacity){
    return triv$(object).css("opacity",opacity);
}


/**
 * Updates the trackers for the user's progress
 * @param {*} progressValue current page to be added for progress
 * @returns 
 */
function updateProgress(progressValue){
    VariconList.add(progressValue);
    
    if(VarcurrentCount.value < String(VariconTotal.value)){
        VarcurrentCount.add("1");
    }
    
    
    if(VarcurrentCount.value === String(VariconTotal.value) && VarprojectGated.value ==="1"){
        VarpageGated.set("0");
        return VarpageGated;
    }
    
}
/**
 * Updates the navagation bar to display the proper item
 * @param {*} button the navbar button to be updated
 * @param {*} value the value to be represented
 * @returns 
 */
function UpdateNavBar(button,value){
    switch(value){
        case value="fc":
            button.div.classList.add("flashcard");           
            button.div.children[0].children[1].innerText ="";            
            break;
        case value="cyp":
            button.div.classList.add("cyp");           
            button.div.children[0].children[1].innerText ="";
            break;
        case value="f":
            button.div.classList.add("final");           
            button.div.children[0].children[1].innerText ="";
            break;
        default:
            //buttonText = value;
            break;
       
    }
    return button;

}

/**
 * Jumps to a specific page when the navbar button is clicked
 * @param {*} currentChapter current chapter that the page live in
 * @param {*} currentPage  the page that we are on
 * @param {*} value the number of pages to progress
 * @returns 
 */
function jumpPage(currentChapter,currentPage,value){
    let np = parseInt(currentPage.value)+value;
   return trivExitPage("a001_"+currentChapter.title+"_page_"+np+".html",true);    

}

//CYP hover state

document.addEventListener("DOMContentLoaded", function () {

  var hoverClass = "quiz-can-hover";
  var body = document.body;

  // 🔧 CONFIG – set per page
  var isTrueFalsePage = false;              // true for T/F pages
  var maxAttempts = isTrueFalsePage ? 1 : 2;

  // ---- helpers for submit enable/disable ----
  function getSubmitBtn() {
    return document.querySelector(".quiz-submit");
  }

  function disableSubmit() {
    var btn = getSubmitBtn();
    if (!btn) return;
    btn.classList.add("is-disabled");
    btn.setAttribute("aria-disabled", "true");
    btn.style.pointerEvents = "none";
    btn.style.opacity = "0.5";
  }

  function enableSubmit() {
    var btn = getSubmitBtn();
    if (!btn) return;
    btn.classList.remove("is-disabled");
    btn.removeAttribute("aria-disabled");
    btn.style.pointerEvents = "";
    btn.style.opacity = "";
  }

  function isAnyAnswerSelected() {
    // This catches native quiz inputs
    var checked = document.querySelector('input[type="radio"]:checked, input[type="checkbox"]:checked');
    return !!checked;
  }

  // Optional: show your existing popup if you have one
  // If you don't have a popup, it will fall back to alert.
  function showSelectAnswerWarning() {
    var warn = document.getElementById("SelectAnswerWarning_Q1") ||
               document.querySelector(".SelectAnswerWarning_Q1") ||
               document.querySelector("#Warning_CYP"); // fallback to your existing warning if you want
    if (warn) {
      warn.style.visibility = "inherit";
      warn.style.display = "block";
    } else {
      alert("Please select an answer and then click Submit.");
    }
  }

  // ---- your existing hover logic ----
  body.classList.add(hoverClass);

  var attemptsUsed = 0;

  var hoverKey = "hoverOff:" + location.pathname + location.search + location.hash;
  if (sessionStorage.getItem(hoverKey) === "1") body.classList.remove(hoverClass);

  function updateHoverBasedOnFeedback() {
    if (isTrueFalsePage) {
      if (attemptsUsed >= 1) body.classList.remove(hoverClass);
      return;
    }

    if (typeof getDisplayDocument !== "function") return;
    var displayDoc = getDisplayDocument();
    if (!displayDoc) return;

    var feedbacks = displayDoc.querySelectorAll(".feedback1");
    var correctVisible = false;

    feedbacks.forEach(function (el) {
      var vis = el.style.visibility;
      if (vis !== "hidden") {
        var text = (el.textContent || "").trim();
        if (/Congratulations!/i.test(text)) correctVisible = true;
      }
    });

    if (correctVisible || attemptsUsed >= maxAttempts) {
      body.classList.remove(hoverClass);
      sessionStorage.setItem(hoverKey, "1");
    } else {
      body.classList.add(hoverClass);
      sessionStorage.removeItem(hoverKey);
    }
  }

  // ---- NEW: enable submit when they select an answer ----
  // This runs on any change to quiz inputs (radio/checkbox)
  document.addEventListener("change", function (e) {
    if (e.target && (e.target.matches('input[type="radio"]') || e.target.matches('input[type="checkbox"]'))) {
      // Enable submit as soon as something is selected
      if (isAnyAnswerSelected()) enableSubmit();
    }
  });

  document.addEventListener("click", function (e) {

    // 🔄 RESET clicked → attempt 2 begins → disable submit until they pick again
    if (!isTrueFalsePage && e.target.closest(".quiz-reset")) {
      // after reset, they must choose again
      disableSubmit();

      // do NOT reset attemptsUsed (your requirement)
      if (attemptsUsed < maxAttempts) {
        body.classList.add(hoverClass);
      } else {
        body.classList.remove(hoverClass);
      }

      setTimeout(updateHoverBasedOnFeedback, 0);
      return;
    }

    // 🟦 SUBMIT clicked
    if (e.target.closest(".quiz-submit")) {

      // Block submit if no answer selected
      if (!isAnyAnswerSelected()) {
        e.preventDefault();
        e.stopPropagation();
        showSelectAnswerWarning();
        return;
      }

      attemptsUsed += 1;
      if (attemptsUsed > maxAttempts) attemptsUsed = maxAttempts;

      if (isTrueFalsePage) {
        body.classList.remove(hoverClass);
        return;
      }

      setTimeout(updateHoverBasedOnFeedback, 60);
    }

  });

  // Optional: on first load, you can also disable submit until first selection
  // If you only want this behavior on attempt 2, comment this out:
  // disableSubmit();

});
