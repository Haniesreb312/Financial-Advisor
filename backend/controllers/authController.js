const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const { supabase } = require('../config/supabase');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (process.env.USE_SUPABASE === '1') {
      const existing = await supabase.from('users').select('id').eq('email', email).maybeSingle();
      if (existing.data) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const insert = await supabase
        .from('users')
        .insert({ name, email, password: hashedPassword })
        .select('id,name,email,createdAt')
        .single();
      if (insert.error) {
        return res.status(500).json({ error: 'Server error during registration' });
      }
      await supabase.from('activities').insert({ userId: insert.data.id, type: 'account', description: 'Account created' });
      const token = generateToken(insert.data.id);
      return res.status(201).json({ message: 'User registered successfully', user: insert.data, token });
    } else {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
        select: { id: true, name: true, email: true, createdAt: true },
      });
      await prisma.activity.create({ data: { userId: user.id, type: 'account', description: 'Account created' } });
      const token = generateToken(user.id);
      res.status(201).json({ message: 'User registered successfully', user, token });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (process.env.USE_SUPABASE === '1') {
      const result = await supabase.from('users').select('*').eq('email', email).single();
      if (result.error || !result.data) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const isValid = await bcrypt.compare(password, result.data.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      await supabase.from('activities').insert({ userId: result.data.id, type: 'login', description: 'User logged in' });
      const token = generateToken(result.data.id);
      const { password: _, ...userWithoutPassword } = result.data;
      return res.json({ message: 'Login successful', user: userWithoutPassword, token });
    } else {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      await prisma.activity.create({ data: { userId: user.id, type: 'login', description: 'User logged in' } });
      const token = generateToken(user.id);
      const { password: _, ...userWithoutPassword } = user;
      res.json({ message: 'Login successful', user: userWithoutPassword, token });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    if (process.env.USE_SUPABASE === '1') {
      const result = await supabase
        .from('users')
        .select('id,name,email,phone,address,dateOfBirth,occupation,createdAt,updatedAt')
        .eq('id', req.userId)
        .single();
      if (result.error || !result.data) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json({ user: result.data });
    } else {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          dateOfBirth: true,
          occupation: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dateOfBirth, occupation } = req.body;
    if (process.env.USE_SUPABASE === '1') {
      const updates = {
        name,
        phone,
        address,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : undefined,
        occupation,
      };
      const result = await supabase
        .from('users')
        .update(updates)
        .eq('id', req.userId)
        .select('id,name,email,phone,address,dateOfBirth,occupation')
        .single();
      if (result.error || !result.data) {
        return res.status(500).json({ error: 'Server error' });
      }
      await supabase.from('activities').insert({ userId: req.userId, type: 'profile', description: 'Profile updated' });
      return res.json({ message: 'Profile updated successfully', user: result.data });
    } else {
      const user = await prisma.user.update({
        where: { id: req.userId },
        data: {
          name,
          phone,
          address,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          occupation,
        },
        select: { id: true, name: true, email: true, phone: true, address: true, dateOfBirth: true, occupation: true },
      });
      await prisma.activity.create({ data: { userId: req.userId, type: 'profile', description: 'Profile updated' } });
      res.json({ message: 'Profile updated successfully', user });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
