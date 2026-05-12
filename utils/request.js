
/**
 * uni-app 通用网络请求封装
 * 包含请求拦截、响应处理、错误处理、重试机制等
 * 支持多平台代理配置
 */

let baseURL = '';

//#ifdef WEB
baseURL = process.env.NODE_ENV === "development" ? "/api" : baseURL;
//#endif

// 请求配置
const config = {
  baseURL: baseURL, // 基础URL（支持代理）
  timeout: 10000, // 超时时间
  retryCount: 3, // 重试次数
  retryDelay: 1000, // 重试延迟
};

// 请求状态码
const HTTP_STATUS = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  NETWORK_ERROR: 0,
};

// 错误消息映射
const ERROR_MESSAGES = {
  [HTTP_STATUS.UNAUTHORIZED]: "登录已过期，请重新登录",
  [HTTP_STATUS.FORBIDDEN]: "没有权限访问",
  [HTTP_STATUS.NOT_FOUND]: "请求的资源不存在",
  [HTTP_STATUS.SERVER_ERROR]: "服务器内部错误",
  [HTTP_STATUS.NETWORK_ERROR]: "网络连接失败",
  timeout: "请求超时，请稍后重试",
  default: "请求失败，请稍后重试",
};

/**
 * 获取完整URL
 */
function getFullUrl(url) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return config.baseURL + url;
}

/**
 * 获取token
 */
function getToken() {
  return uni.getStorageSync("token") || "";
}

/**
 * 设置token
 */
function setToken(token) {
  uni.setStorageSync("token", token);
}

/**
 * 清除token
 */
function clearToken() {
  uni.removeStorageSync("token");
}

/**
 * 显示加载中
 */
function showLoading(title = "加载中...") {
  uni.showLoading({
    title,
    mask: true,
  });
}

/**
 * 隐藏加载中
 */
function hideLoading() {
  uni.hideLoading();
}

/**
 * 显示错误提示
 */
function showError(message) {
  uni.showToast({
    title: message,
    icon: "none",
    duration: 2000,
  });
}

/**
 * 处理响应数据
 */
function handleResponse(response) {
  const { statusCode, data } = response;
  // 如果是200状态码，但业务逻辑不是成功状态
  if (data.code !== 200) {
    // 对于业务逻辑错误，显示后台返回的错误信息
    const errorMsg = data.message || data.msg || ERROR_MESSAGES.default;

    // 如果业务逻辑返回401，也需要清除token并跳转到登录页面
    if (data.code === HTTP_STATUS.UNAUTHORIZED) {
      clearToken();
      // 延迟跳转到登录页面
/*      setTimeout(() => {
        uni.reLaunch({
          url: "/subPackages/login/login",
        });
      }, 1500);*/
      return Promise.reject(new Error(errorMsg));
    }else{
      showError(errorMsg);
      return Promise.reject(new Error(errorMsg));
    }


  }

  // 成功响应
  return Promise.resolve(data);
}

/**
 * 处理错误
 */
function handleError(error, options = {}) {
  console.error("Request Error:", error);

  let errorMessage = error.message || ERROR_MESSAGES.default;

  // 网络错误
  if (error.errMsg && error.errMsg.includes("timeout")) {
    errorMessage = ERROR_MESSAGES.timeout;
  } else if (error.errMsg && error.errMsg.includes("fail")) {
    errorMessage = ERROR_MESSAGES[HTTP_STATUS.NETWORK_ERROR];
  }

  // 显示错误提示
  if (!options.silent) {
    showError(errorMessage);
  }

  return Promise.reject(error);
}

/**
 * 请求重试
 */
function retryRequest(requestFn, retryCount = config.retryCount) {
  return requestFn().catch((error) => {
    if (retryCount > 0) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(retryRequest(requestFn, retryCount - 1));
        }, config.retryDelay);
      });
    }
    return Promise.reject(error);
  });
}

/**
 * 核心请求方法
 */
function request(options = {}) {
  const {
    url,
    method = "GET",
    data = {},
    header = {},
    loading = false, //默认不需要loading
    silent = false,
    retry = false,
    filePath, // 新增：文件上传路径
    name = "file", // 新增：文件字段名
    formData = {}, // 新增：表单数据
    ...restOptions
  } = options;

  // 如果是文件上传请求
  if (method.toUpperCase() === "UPLOAD" && filePath) {
    return upload(url, filePath, { name, formData, header, loading });
  }

  // 显示加载状态
  if (loading) {
    showLoading();
  }

  // 构建请求头
  const requestHeader = {
    "Content-Type": "application/json",
    ...header,
  };

  // 添加token
  const token = getToken();
  if (token) {
    requestHeader["Authorization"] = `Bearer ${token}`;
  }

  // 构建请求参数
  const requestOptions = {
    url: getFullUrl(url),
    method: method.toUpperCase(),
    data,
    header: requestHeader,
    timeout: config.timeout,
    ...restOptions,
  };

  // 执行请求
  const executeRequest = () => {
    return new Promise((resolve, reject) => {
      uni.request({
        ...requestOptions,
        success: (response) => {
          if (loading) {
            hideLoading();
          }
          handleResponse(response).then(resolve).catch(reject);
        },
        fail: (error) => {
          if (loading) {
            hideLoading();
          }
          handleError(error, { silent }).then(resolve).catch(reject);
        },
      });
    });
  };

  // 是否启用重试
  if (retry) {
    return retryRequest(executeRequest);
  }

  return executeRequest();
}

/**
 * GET 请求
 */
function get(url, params = {}, options = {}) {
  // 对于GET请求，将params作为查询参数附加到URL上
  let fullUrl = url;
  if (params && Object.keys(params).length > 0) {
    const queryString = Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");
    fullUrl = url.includes("?")
      ? `${url}&${queryString}`
      : `${url}?${queryString}`;
  }

  return request({
    url: fullUrl,
    method: "GET",
    ...options,
  });
}

/**
 * POST 请求
 */
function post(url, data = {}, options = {}) {
  return request({
    url,
    method: "POST",
    data,
    ...options,
  });
}

/**
 * PUT 请求
 */
function put(url, data = {}, options = {}) {
  return request({
    url,
    method: "PUT",
    data,
    ...options,
  });
}

/**
 * DELETE 请求
 */
function del(url, data = {}, options = {}) {
  return request({
    url,
    method: "DELETE",
    data,
    ...options,
  });
}

/**
 * 文件上传
 */
function upload(url, filePath, options = {}) {
  const { name = "file", formData = {}, header = {}, loading = true } = options;

  if (loading) {
    showLoading("上传中...");
  }

  // 构建请求头
  const uploadHeader = { ...header };
  const token = getToken();
  if (token) {
    uploadHeader["Authorization"] = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: getFullUrl(url),
      filePath,
      name,
      formData,
      header: uploadHeader,
      success: (response) => {
        if (loading) {
          hideLoading();
        }
        try {
          // 解析响应数据
          const data = JSON.parse(response.data);
          // 使用统一的响应处理逻辑
          if (data.code === 200) {
            resolve(data);
          } else {
            const errorMsg = data.message || data.msg || "上传失败";
            showError(errorMsg);
            reject(new Error(errorMsg));
          }
        } catch (error) {
          const errorMsg = "响应数据格式错误";
          showError(errorMsg);
          reject(new Error(errorMsg));
        }
      },
      fail: (error) => {
        if (loading) {
          hideLoading();
        }
        const errorMsg = error.errMsg || "上传失败";
        showError(errorMsg);
        reject(error);
      },
    });
  });
}

/**
 * 文件下载
 */
function download(url, options = {}) {
  const { header = {}, loading = true } = options;

  if (loading) {
    showLoading("下载中...");
  }

  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url: getFullUrl(url),
      header,
      success: (response) => {
        if (loading) {
          hideLoading();
        }
        if (response.statusCode === HTTP_STATUS.SUCCESS) {
          resolve(response);
        } else {
          reject(new Error("下载失败"));
        }
      },
      fail: (error) => {
        if (loading) {
          hideLoading();
        }
        handleError(error).catch(reject);
      },
    });
  });
}

// 导出
export default {
  config,
  request,
  get,
  post,
  put,
  delete: del,
  upload,
  download,
  setToken,
  getToken,
  clearToken,
};

// 单独导出方法
export {
  request,
  get,
  post,
  put,
  del as delete,
  upload,
  download,
  setToken,
  getToken,
  clearToken,
};
