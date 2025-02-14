import { User, TimeSlot } from '../types';

const USERS_KEY = 'slot_booking_users';
const CURRENT_USER_KEY = 'slot_booking_current_user';

/**
 * Retrieve all users from localStorage
 */
export function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Save or update a user in localStorage
 */
export function saveUser(user: User) {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.username === user.username);

  if (existingIndex !== -1) {
    // Update existing user
    users[existingIndex] = user;
  } else {
    // Add new user
    users.push(user);
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Set the "current user" by username in localStorage
 */
export function setCurrentUser(username: string) {
  localStorage.setItem(CURRENT_USER_KEY, username);
}

/**
 * Return the current user object from localStorage,
 * or null if not found.
 */
export function getCurrentUser(): User | null {
  const username = localStorage.getItem(CURRENT_USER_KEY);
  if (!username) return null;

  const users = getUsers();
  return users.find(u => u.username === username) || null;
}

/**
 * Remove the current user from localStorage
 */
export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

/**
 * Update availability for a given user on a given date
 */
export function updateAvailability(username: string, date: string, slots: TimeSlot[]) {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) return;

  users[userIndex].availability = {
    ...users[userIndex].availability,
    [date]: slots
  };

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
