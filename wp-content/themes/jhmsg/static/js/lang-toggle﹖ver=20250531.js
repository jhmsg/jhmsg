// 初始化转换器
const converter = OpenCC.Converter({ from: "cn", to: "tw" });
const reverseConverter = OpenCC.Converter({ from: "tw", to: "cn" });

// 状态存储
let isTraditional = localStorage.getItem("langMode") === "traditional";

// 文字转换函数
function convertText(element) {
  if (element.nodeType === Node.TEXT_NODE) {
    const convertFn = isTraditional ? reverseConverter : converter;
    element.nodeValue = convertFn(element.nodeValue);
  } else {
    Array.from(element.childNodes).forEach(convertText);
  }
}

// 执行转换
function toggleLanguage() {
  if (!document.body) {
    console.warn("DOM未完全加载，延迟执行转换");
    return setTimeout(toggleLanguage, 50);
  }

  const elementsToConvert = document.body.querySelectorAll(
    "*:not(script):not(style):not(noscript):not(code)"
  );

  elementsToConvert.forEach((element) => {
    convertText(element);
  });

  // 切换状态
  isTraditional = !isTraditional;
  localStorage.setItem(
    "langMode",
    isTraditional ? "traditional" : "simplified"
  );

  // 更新按钮文字
//   document.querySelector(".quick-opencc").textContent = isTraditional
//     ? "切換"
//     : "切换";
}

// 绑定点击事件
document.addEventListener("DOMContentLoaded", function () {
  const button = document.querySelector(".quick-opencc");

  if (button && document.body) {
    button.addEventListener("click", toggleLanguage);
    // button.textContent = isTraditional ? "切換" : "切换";

    // 延迟初始化状态应用
    if (localStorage.getItem("langMode") === "traditional") {
      setTimeout(toggleLanguage, 100);
    }
  } else {
    console.error("DOM元素未找到，请检查：", {
      buttonExists: !!button,
      bodyExists: !!document.body,
    });
  }
});

// 初始化时应用状态
if (localStorage.getItem("langMode") === "traditional") {
  toggleLanguage();
}
