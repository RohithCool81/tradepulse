// Simple in-memory authentication for demo purposes
type User = {
  id: string;
  email: string;
  password: string;
};

// Mock user database
const users = new Map<string, User>();

export async function register(credentials: { email: string; password: string }) {
  const { email, password } = credentials;

  if (users.has(email)) {
    throw new Error('User already exists');
  }

  const id = Math.random().toString(36).substring(2, 11);
  const user: User = { id, email, password };
  users.set(email, user);

  return {
    user: {
      id,
      email,
      balance: 100000, // Starting balance of $100,000
      portfolio: {},
    },
  };
}

export async function login(credentials: { email: string; password: string }) {
  const { email, password } = credentials;

  const user = users.get(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (password !== user.password) {
    throw new Error('Invalid credentials');
  }

  return {
    user: {
      id: user.id,
      email,
      balance: 100000, // In a real app, this would come from the database
      portfolio: {},
    },
  };
}

// Simple mock verification for demo
export function verifyToken(token: string) {
  return { email: 'demo@example.com', id: 'demo-id' };
}
