export interface SignInType {
  username: string,
  password: string,
  code?: string | null, // 验证码（可选，用于登录，为空时传null）
};

export interface SignUpType {
  nickName: string,
  username: string,
  password: string,
  code: string, // 验证码（必填，用于注册）
};

// 获取验证码请求类型
export interface FindCodeType {
  username: string,
}

// 重置密码请求类型（包含验证码）
export interface ResetPasswordType {
  username: string,
  password: string,
  code: string, // 验证码（必填）
}
