/**
 * HTTP 错误提示工具类
 * 根据 HTTP 状态码返回用户友好的错误提示
 */

export class HttpErrorHelper {
  /**
   * 获取用户友好的错误提示信息
   * @param code HTTP 状态码（如 401, 403, 500 等）
   * @param msg 后端返回的原始错误消息（可选）
   * @returns 友好提示文本
   */
  static getFriendlyMessage(code: number, msg?: string): string {
    // 如果后端提供了明确的错误信息，且不是通用占位符，可优先使用
    // 但注意：有些 msg 是给开发者看的，不适合直接展示，这里做简单判断
    const isGenericMsg = !msg || ['error', 'failed', 'unknown'].some(k => msg.toLowerCase().includes(k));
    
    if (msg && !isGenericMsg) {
      return msg;
    }

    // 根据标准 HTTP 状态码返回友好提示
    switch (code) {
      // 4xx 客户端错误
      case 400:
        return '请求参数有误，请检查输入内容';
      case 401:
        return '登录已过期或未授权，请重新登录';
      case 403:
        return '您没有权限访问该资源';
      case 404:
        return '请求的资源不存在';
      case 405:
        return '请求方法不被允许';
      case 408:
        return '请求超时，请稍后重试';
      case 429:
        return '操作过于频繁，请稍后再试';

      // 5xx 服务端错误
      case 500:
        return '服务器内部错误，请稍后重试';
      case 502:
        return '网关错误，请稍后重试';
      case 503:
        return '服务暂时不可用，请稍后再试';
      case 504:
        return '网关超时，请检查网络或稍后重试';

      // 其他未知错误
      default:
        return code >= 400 && code < 500
          ? '请求失败，请检查网络或输入'
          : '服务异常，请稍后重试';
    }
  }

  /**
   * （可选）直接调用 UI 提示（需配合 message 组件）
   * 示例：HttpErrorHelper.showError(401);
   */
  static showError(code: number, msg?: string): void {
    // 注意：此处仅为示意，实际需引入你项目中的 message 组件
    // 例如 Ant Design: import { message } from 'antd';
    const friendlyMsg = this.getFriendlyMessage(code, msg);
    
    // 假设你有一个全局 message 工具，比如：
    // message.error(friendlyMsg);
    
    // 如果没有全局 message，可以抛出或 console，由调用方处理
    console.warn('[HttpError]', code, friendlyMsg);
  }
}