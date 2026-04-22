/**
 * 格式化数字，每3位添加一个逗号分隔符
 * @param {number|string} num - 需要格式化的数字
 * @returns {string} 格式化后的数字字符串
 */
export function formatNumber(num) {
  // 转换为字符串并处理可能的非数字输入
  const numStr = String(num);

  // 分离整数部分和小数部分
  const parts = numStr.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1] || "";

  // 使用正则表达式在整数部分每3位添加逗号
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // 如果有小数部分，则拼接小数部分
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

/**
 * 格式化货币金额,添加千位分隔符
 * @param {number|string} amount - 金额
 * @param {string} currency - 货币符号,默认为'$'
 * @returns {string} 格式化后的货币字符串
 */
export function formatCurrency(amount, currency = "$") {
  return `${currency}${formatNumber(amount)}`;
}

/**
 * 跳转到划转页面
 * @param {Object} params - 可选参数
 * @param {string} params.fromWallet - 来源钱包类型
 * @param {string} params.toWallet - 目标钱包类型
 * @param {string} params.coin - 币种
 */
export function navigateToTransfer(params = {}) {
  let url = '/sub_package/transfer/transfer';
  
  // 如果有参数，拼接到url上
  const queryParams = [];
  if (params.fromWallet) {
    queryParams.push(`fromWallet=${params.fromWallet}`);
  }
  if (params.toWallet) {
    queryParams.push(`toWallet=${params.toWallet}`);
  }
  if (params.coin) {
    queryParams.push(`coin=${params.coin}`);
  }
  
  if (queryParams.length > 0) {
    url += '?' + queryParams.join('&');
  }
  
  uni.navigateTo({ url });
}

/**
 * 跳转到历史记录页面
 */
export function navigateToHistory() {
  uni.navigateTo({
    url: '/sub_package/asset/history'
  });
}

/**
 * 页面返回
 * @param {number} delta - 返回的层数，默认为1
 */
export function navigateBack(delta = 1) {
  uni.navigateBack({ delta });
}
