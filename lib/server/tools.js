/**
 * 解析querystring字符串
 * @param {*} str
 * @returns
 */
function extractQueryParams(str) {
  const queryParams = {};

  // 提取查询字符串部分
  const queryString = str.split('?')[1];

  // 如果存在查询字符串，则提取参数
  if (queryString) {
    const pairs = queryString.split('&');

    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      queryParams[key] = decodeURIComponent(value);
    });
  }

  return queryParams;
}
module.exports = {
  extractQueryParams
};
