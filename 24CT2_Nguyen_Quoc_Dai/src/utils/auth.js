// Lấy danh sách tài khoản đã lưu
export function getUsers() {
    const users = localStorage.getItem("skillhub_users");
  
    return users ? JSON.parse(users) : [];
  }
  
  // Đăng ký tài khoản mới
  export function registerUser(name, email, password) {
    const users = getUsers();
  
    // Kiểm tra email đã tồn tại chưa
    const existingUser = users.find(
      (user) => user.email === email
    );
  
    if (existingUser) {
      return {
        success: false,
        message: "Email đã được đăng ký!",
      };
    }
  
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: "customer",
    };
  
    users.push(newUser);
  
    localStorage.setItem(
      "skillhub_users",
      JSON.stringify(users)
    );
  
    return {
      success: true,
      user: newUser,
    };
  }
  
  // Đăng nhập
  export function loginUser(email, password) {
    const users = getUsers();
  
    const user = users.find(
      (user) =>
        user.email === email &&
        user.password === password
    );
  
    if (!user) {
      return {
        success: false,
        message: "Email hoặc mật khẩu không đúng!",
      };
    }
  
    // Lưu người đang đăng nhập
    localStorage.setItem(
      "skillhub_current_user",
      JSON.stringify(user)
    );
  
    return {
      success: true,
      user,
    };
  }
  
  // Lấy tài khoản đang đăng nhập
  export function getCurrentUser() {
    const user = localStorage.getItem(
      "skillhub_current_user"
    );
  
    return user ? JSON.parse(user) : null;
  }
  
  // Đăng xuất
  export function logoutUser() {
    localStorage.removeItem("skillhub_current_user");
  }