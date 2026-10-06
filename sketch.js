// 宣告五題 p5.js 簡易指令選擇題的題目資料。
const questions = [ // 建立題目陣列並保存每一題的內容、選項與正確答案索引。
  { // 建立第一題的資料物件。
    question: `在 setup() 中，哪一行可以建立 400 × 300 的畫布？`, // 設定第一題題目文字。
    options: [`createCanvas(400, 300);`, `canvas(400, 300);`, `size(400, 300);`, `makeCanvas(400, 300);`], // 設定第一題的四個選項。
    answer: 0 // 設定第一題正確選項的索引值。
  }, // 結束第一題資料物件。
  { // 建立第二題的資料物件。
    question: `哪一行程式可以在畫布上繪製矩形？`, // 設定第二題題目文字。
    options: [`circle(50, 50, 80);`, `rect(50, 50, 100, 80);`, `line(50, 50, 100, 80);`, `box(100, 80);`], // 設定第二題的四個選項。
    answer: 1 // 設定第二題正確選項的索引值。
  }, // 結束第二題資料物件。
  { // 建立第三題的資料物件。
    question: `background(220); 的主要用途是什麼？`, // 設定第三題題目文字。
    options: [`設定畫布背景顏色。`, `設定文字大小。`, `建立新的畫布。`, `讓滑鼠游標消失。`], // 設定第三題的四個選項。
    answer: 0 // 設定第三題正確選項的索引值。
  }, // 結束第三題資料物件。
  { // 建立第四題的資料物件。
    question: `p5.js 的 mouseX 代表什麼資訊？`, // 設定第四題題目文字。
    options: [`滑鼠目前的垂直座標。`, `畫布的寬度。`, `滑鼠目前的水平座標。`, `滑鼠按下的次數。`], // 設定第四題的四個選項。
    answer: 2 // 設定第四題正確選項的索引值。
  }, // 結束第四題資料物件。
  { // 建立第五題的資料物件。
    question: `p5.js 中的 draw() 通常會如何執行？`, // 設定第五題題目文字。
    options: [`只在程式啟動時執行一次。`, `只在滑鼠按下時執行。`, `只在視窗縮放時執行。`, `會依照影格率持續重複執行。`], // 設定第五題的四個選項。
    answer: 3 // 設定第五題正確選項的索引值。
  } // 結束第五題資料物件。
]; // 結束題目陣列。

let currentQuestion = 0; // 記錄目前顯示的題目編號。
let score = 0; // 記錄目前答對的題數。
let selectedIndex = -1; // 記錄使用者在目前題目選取的選項索引。
let hasAnswered = false; // 記錄目前題目是否已經作答。
let finished = false; // 記錄五題是否已經全部完成。
let optionBounds = []; // 保存四個選項的畫面範圍，供滑鼠與觸控判定使用。
let nextButton = { x: 0, y: 0, w: 0, h: 0 }; // 保存下一題按鈕的畫面範圍。
let restartButton = { x: 0, y: 0, w: 0, h: 0 }; // 保存重新開始按鈕的畫面範圍。
let lastPointerTime = 0; // 記錄上一次輸入時間，避免觸控同時觸發兩次事件。

function setup() { // 定義 p5.js 初始化函式。
  createCanvas(windowWidth, windowHeight); // 建立符合視窗大小的全螢幕畫布。
  textFont(`Arial, Noto Sans TC, sans-serif`); // 設定適合桌面與行動裝置的字型。
  textWrap(WORD); // 讓較長的中文題目與選項自動換行。
  rectMode(CORNER); // 將矩形座標設定為左上角模式。
  noStroke(); // 預設不繪製圖形外框。
} // 結束目前的程式區塊。

function draw() { // 定義 p5.js 每一影格重複執行的主繪圖函式。
  background(`#f5f7fb`); // 使用淡色背景建立清楚且舒適的閱讀介面。
  if (finished) { // 判斷是否已完成五題測驗。
    drawResultScreen(); // 完成測驗時繪製成績畫面。
  } else { // 如果尚未完成全部題目。
    drawQuizScreen(); // 繪製目前題目的測驗畫面。
  } // 結束完成狀態判斷。
} // 結束目前的程式區塊。

function drawQuizScreen() { // 定義測驗畫面的繪製函式。
  const layout = getLayout(); // 取得依照螢幕尺寸計算出的響應式版面資料。
  const item = questions[currentQuestion]; // 取得目前題目的資料物件。
  optionBounds = []; // 每一影格重新整理選項範圍，確保縮放後位置正確。
  drawHeader(layout); // 繪製標題與題目進度資訊。
  drawQuestionCard(layout, item); // 繪製目前題目的文字卡片。
  drawOptions(layout, item); // 繪製四個選項按鈕。
  if (hasAnswered) { // 判斷使用者是否已經選擇答案。
    nextButton.y = layout.buttonY; // 將下一題按鈕放在四個選項下方。
    drawButton(nextButton, currentQuestion === questions.length - 1 ? `查看結果` : `下一題`, `#3767d6`); // 作答後顯示前往下一題或查看結果按鈕。
  } // 結束作答狀態判斷。
} // 結束目前的程式區塊。

function getLayout() { // 定義依照視窗尺寸產生響應式版面配置的函式。
  const margin = constrain(width * 0.06, 18, 72); // 計算左右邊界並限制在適合閱讀的範圍。
  const contentWidth = min(width - margin * 2, 920); // 計算內容區寬度並避免桌面畫面過寬。
  const contentX = (width - contentWidth) / 2; // 計算內容區的水平置中位置。
  const top = constrain(height * 0.08, 28, 72); // 計算頁面上方留白。
  const titleSize = constrain(min(width * 0.06, height * 0.055), 20, 36); // 計算標題字級。
  const bodySize = constrain(min(width * 0.042, height * 0.035), 16, 24); // 計算題目與選項字級。
  const questionHeight = constrain(height * 0.145, 82, 132); // 計算題目卡片高度。
  const optionHeight = constrain(height * 0.092, 54, 78); // 計算選項按鈕高度。
  const gap = constrain(height * 0.018, 8, 16); // 計算選項與按鈕之間的間距。
  const questionY = top + 78; // 計算題目卡片的垂直位置。
  const optionsY = questionY + questionHeight + gap; // 計算第一個選項的垂直位置。
  const buttonY = optionsY + optionHeight * 4 + gap * 4; // 計算下一題按鈕的垂直位置。
  return { margin, contentWidth, contentX, top, titleSize, bodySize, questionHeight, optionHeight, gap, questionY, optionsY, buttonY }; // 回傳完整的版面配置資料。
} // 結束目前的程式區塊。

function drawHeader(layout) { // 定義標題區域的繪製函式。
  fill(`#183153`); // 設定標題文字顏色。
  textAlign(LEFT, CENTER); // 將標題文字設定為左側垂直置中對齊。
  textSize(layout.titleSize); // 套用響應式標題字級。
  textStyle(BOLD); // 將主標題設定為粗體。
  text(`p5.js 指令小測驗`, layout.contentX, layout.top + 18); // 繪製測驗主標題。
  fill(`#58708f`); // 設定進度文字顏色。
  textAlign(RIGHT, CENTER); // 將進度文字設定為右側垂直置中對齊。
  textSize(max(14, layout.bodySize * 0.78)); // 套用適合進度文字的字級。
  text(`第 ${currentQuestion + 1} / ${questions.length} 題`, layout.contentX + layout.contentWidth, layout.top + 18); // 繪製目前題目進度。
  textStyle(NORMAL); // 將文字樣式恢復為一般字體。
} // 結束目前的程式區塊。

function drawQuestionCard(layout, item) { // 定義題目卡片的繪製函式。
  fill(`#ffffff`); // 設定題目卡片背景顏色。
  rect(layout.contentX, layout.questionY, layout.contentWidth, layout.questionHeight, 16); // 繪製圓角題目卡片。
  fill(`#183153`); // 設定題目文字顏色。
  textAlign(LEFT, CENTER); // 將題目文字設定為左側垂直置中對齊。
  textSize(layout.bodySize); // 套用響應式題目字級。
  textStyle(BOLD); // 將題目文字設定為粗體。
  text(item.question, layout.contentX + layout.margin * 0.45, layout.questionY + 12, layout.contentWidth - layout.margin * 0.9, layout.questionHeight - 24); // 繪製題目內容並限制文字寬度。
  textStyle(NORMAL); // 將文字樣式恢復為一般字體。
} // 結束目前的程式區塊。

function drawOptions(layout, item) { // 定義四個選項按鈕的繪製函式。
  for (let i = 0; i < item.options.length; i += 1) { // 逐一處理目前題目的四個選項。
    const isCorrect = i === item.answer; // 判斷目前選項是否為正確答案。
    const isSelected = i === selectedIndex; // 判斷目前選項是否為使用者選取的答案。
    let offsetY = 0; // 建立選項垂直位移量。
    if (hasAnswered && isCorrect && !isSelected) { // 判斷答錯後是否需要讓正確選項跳動。
      offsetY = sin(frameCount * 0.12) * 6; // 使用正弦函式讓正確選項持續上下跳動。
    } // 結束跳動條件判斷。
    const x = layout.contentX; // 取得選項左側座標。
    const y = layout.optionsY + i * (layout.optionHeight + layout.gap) + offsetY; // 計算選項垂直座標並加入跳動位移。
    const w = layout.contentWidth; // 取得選項寬度。
    const h = layout.optionHeight; // 取得選項高度。
    optionBounds.push({ x, y, w, h }); // 保存選項範圍供輸入事件使用。
    let optionColor = `#ffffff`; // 設定尚未作答時的選項背景色。
    if (hasAnswered && isCorrect && !isSelected) { // 判斷答錯後的正確選項。
      optionColor = `#d0f4de`; // 將答錯時的正確選項背景設定為指定的 #d0f4de。
    } else if (hasAnswered && isSelected && isCorrect) { // 判斷使用者選到正確選項的情況。
      optionColor = `#d0f4de`; // 將選取的正確答案設定為淡綠色。
    } else if (hasAnswered && isSelected && !isCorrect) { // 判斷使用者選到錯誤選項的情況。
      optionColor = `#ffe0e0`; // 將選取的錯誤答案設定為淡紅色。
    } // 結束選項顏色判斷。
    drawOptionButton(x, y, w, h, i, item.options[i], optionColor); // 繪製目前的選項按鈕與文字。
  } // 結束四個選項的迴圈。
} // 結束目前的程式區塊。

function drawOptionButton(x, y, w, h, index, label, optionColor) { // 定義單一選項按鈕的繪製函式。
  fill(optionColor); // 設定選項按鈕背景顏色。
  rect(x, y, w, h, 12); // 繪製圓角選項按鈕。
  fill(`#183153`); // 設定選項文字顏色。
  textAlign(LEFT, CENTER); // 將選項文字設定為左側垂直置中對齊。
  textSize(constrain(min(width * 0.036, height * 0.03), 14, 20)); // 設定適合桌面與行動裝置的選項字級。
  text(`${String.fromCharCode(65 + index)}. ${label}`, x + 18, y, w - 36, h); // 繪製選項英文字母與選項內容。
} // 結束目前的程式區塊。

function drawButton(button, label, buttonColor) { // 定義一般操作按鈕的繪製函式。
  button.w = min(250, width - 36); // 設定按鈕寬度並避免小螢幕超出畫布。
  button.h = constrain(height * 0.065, 46, 58); // 設定按鈕高度。
  button.x = (width - button.w) / 2; // 將按鈕水平置中。
  fill(buttonColor); // 設定按鈕背景顏色。
  rect(button.x, button.y, button.w, button.h, 14); // 繪製圓角操作按鈕。
  fill(`#ffffff`); // 設定按鈕文字顏色。
  textAlign(CENTER, CENTER); // 將按鈕文字設定為水平與垂直置中。
  textSize(constrain(min(width * 0.04, height * 0.03), 16, 21)); // 設定按鈕文字大小。
  textStyle(BOLD); // 將按鈕文字設定為粗體。
  text(label, button.x, button.y, button.w, button.h); // 繪製按鈕文字。
  textStyle(NORMAL); // 將文字樣式恢復為一般字體。
} // 結束目前的程式區塊。

function drawResultScreen() { // 定義測驗完成後的結果畫面繪製函式。
  const centerX = width / 2; // 計算畫面中央的水平座標。
  const centerY = height / 2; // 計算畫面中央的垂直座標。
  const cardW = min(width - 36, 620); // 計算結果卡片寬度並適應行動裝置。
  const cardH = min(height - 48, 360); // 計算結果卡片高度並適應小螢幕。
  fill(`#ffffff`); // 設定結果卡片背景顏色。
  rect(centerX - cardW / 2, centerY - cardH / 2, cardW, cardH, 20); // 繪製置中的結果卡片。
  fill(`#183153`); // 設定結果標題顏色。
  textAlign(CENTER, CENTER); // 將結果文字設定為置中對齊。
  textSize(constrain(min(width * 0.075, height * 0.08), 26, 44)); // 設定結果標題字級。
  textStyle(BOLD); // 將結果標題設定為粗體。
  text(`測驗完成！`, centerX, centerY - 92); // 顯示測驗完成訊息。
  fill(`#3767d6`); // 設定分數文字顏色。
  textSize(constrain(min(width * 0.11, height * 0.12), 40, 68)); // 設定分數文字大小。
  text(`${score} / ${questions.length}`, centerX, centerY - 18); // 顯示答對題數與總題數。
  fill(`#58708f`); // 設定鼓勵文字顏色。
  textSize(constrain(min(width * 0.045, height * 0.04), 16, 23)); // 設定鼓勵文字大小。
  textStyle(NORMAL); // 將鼓勵文字設定為一般字體。
  text(`答對 ${score} 題，繼續練習 p5.js 指令吧！`, centerX, centerY + 52, cardW - 40, 50); // 顯示測驗結果說明。
  restartButton.w = min(250, width - 72); // 設定重新開始按鈕寬度。
  restartButton.h = constrain(height * 0.065, 46, 58); // 設定重新開始按鈕高度。
  restartButton.x = centerX - restartButton.w / 2; // 將重新開始按鈕水平置中。
  restartButton.y = centerY + 92; // 設定重新開始按鈕垂直位置。
  drawButton(restartButton, `重新開始`, `#3767d6`); // 繪製重新開始按鈕。
} // 結束目前的程式區塊。

function isInside(px, py, box) { // 定義判斷輸入座標是否位於按鈕範圍內的函式。
  return px >= box.x && px <= box.x + box.w && py >= box.y && py <= box.y + box.h; // 回傳座標是否位於指定矩形範圍內。
} // 結束目前的程式區塊。

function handlePointer(px, py) { // 定義處理滑鼠與觸控輸入的共用函式。
  if (finished) { // 判斷目前是否處於結果畫面。
    if (isInside(px, py, restartButton)) { // 判斷使用者是否點擊重新開始按鈕。
      resetQuiz(); // 重新設定測驗狀態。
    } // 結束重新開始按鈕判斷。
    return; // 結果畫面處理完畢後停止繼續判斷。
  } // 結束結果畫面判斷。
  if (!hasAnswered) { // 只有尚未作答時才允許選取選項。
    for (let i = 0; i < optionBounds.length; i += 1) { // 逐一檢查四個選項的點擊範圍。
      if (isInside(px, py, optionBounds[i])) { // 判斷輸入座標是否點中目前選項。
        selectedIndex = i; // 保存使用者選取的選項索引。
        hasAnswered = true; // 將目前題目標記為已作答。
        if (selectedIndex === questions[currentQuestion].answer) { // 判斷使用者是否答對。
          score += 1; // 答對時增加一分。
        } // 結束答對判斷。
        return; // 完成選項判斷後停止繼續檢查。
      } // 結束選項範圍判斷。
    } // 結束選項迴圈。
  } else if (isInside(px, py, nextButton)) { // 作答後判斷是否點擊下一題按鈕。
    goToNextQuestion(); // 前往下一題或結果畫面。
  } // 結束下一題按鈕判斷。
} // 結束目前的程式區塊。

function registerPointer(px, py) { // 定義避免滑鼠與觸控重複觸發的輸入註冊函式。
  const now = millis(); // 取得目前 p5.js 執行時間。
  if (now - lastPointerTime < 250) { // 判斷是否在短時間內重複收到相同輸入。
    return false; // 忽略重複輸入。
  } // 結束重複輸入判斷。
  lastPointerTime = now; // 更新最近一次輸入時間。
  handlePointer(px, py); // 將輸入座標交給共用處理函式。
  return false; // 阻止瀏覽器在行動裝置上進行預設頁面操作。
} // 結束目前的程式區塊。

function mousePressed() { // 定義 p5.js 滑鼠按下事件函式。
  return registerPointer(mouseX, mouseY); // 使用滑鼠座標處理桌面點擊。
} // 結束目前的程式區塊。

function touchStarted() { // 定義 p5.js 觸控開始事件函式。
  let px = mouseX; // 預設使用 p5.js 提供的滑鼠水平座標。
  let py = mouseY; // 預設使用 p5.js 提供的滑鼠垂直座標。
  if (touches.length > 0) { // 判斷是否取得行動裝置的觸控座標。
    px = touches[0].x; // 取得第一個觸控點的水平座標。
    py = touches[0].y; // 取得第一個觸控點的垂直座標。
  } // 結束觸控座標判斷。
  return registerPointer(px, py); // 使用觸控座標處理行動裝置點擊。
} // 結束目前的程式區塊。

function goToNextQuestion() { // 定義前往下一題或完成測驗的函式。
  if (currentQuestion < questions.length - 1) { // 判斷目前是否還有下一題。
    currentQuestion += 1; // 將題目編號增加一題。
    selectedIndex = -1; // 清除下一題的選項選取狀態。
    hasAnswered = false; // 將下一題設定為尚未作答。
  } else { // 如果目前已經是最後一題。
    finished = true; // 將畫面切換至測驗結果狀態。
  } // 結束下一題判斷。
} // 結束目前的程式區塊。

function resetQuiz() { // 定義重新開始整份測驗的函式。
  currentQuestion = 0; // 將題目編號重設為第一題。
  score = 0; // 將分數重設為零分。
  selectedIndex = -1; // 清除選項選取狀態。
  hasAnswered = false; // 將作答狀態重設為尚未作答。
  finished = false; // 將完成狀態重設為尚未完成。
} // 結束目前的程式區塊。

function windowResized() { // 定義視窗尺寸改變時的 p5.js 事件函式。
  resizeCanvas(windowWidth, windowHeight); // 讓畫布隨視窗或裝置方向改變而更新尺寸。
} // 結束目前的程式區塊。