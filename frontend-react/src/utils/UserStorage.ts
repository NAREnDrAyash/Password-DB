// Simple in-memory storage for demo purposes
// In a real app, this would be replaced with API calls to your backend

class UserStorage {
  private static instance: UserStorage;
  private users: Set<string> = new Set();

  private constructor() {
    // Add some demo users
    this.users.add('admin');
    this.users.add('demo');
    this.users.add('test');
  }

  static getInstance(): UserStorage {
    if (!UserStorage.instance) {
      UserStorage.instance = new UserStorage();
    }
    return UserStorage.instance;
  }

  addUser(username: string): boolean {
    if (this.users.has(username.toLowerCase())) {
      return false;
    }
    this.users.add(username.toLowerCase());
    return true;
  }

  isUsernameTaken(username: string): boolean {
    return this.users.has(username.toLowerCase());
  }

  removeUser(username: string): boolean {
    return this.users.delete(username.toLowerCase());
  }

  getAllUsers(): string[] {
    return Array.from(this.users);
  }
}

export default UserStorage;
