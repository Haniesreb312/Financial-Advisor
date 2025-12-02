const { prisma } = require('../config/database');
const { supabase } = require('../config/supabase');

// Get budgets
exports.getBudgets = async (req, res) => {
  try {
    if (process.env.USE_SUPABASE === '1' && supabase) {
      const result = await supabase
        .from('budgets')
        .select('*')
        .eq('userId', req.userId)
        .order('year', { ascending: false })
        .order('month', { ascending: false })
        .limit(12);
      if (result.error) return res.status(500).json({ error: 'Server error' });
      return res.json({ budgets: result.data || [] });
    } else {
      const budgets = await prisma.budget.findMany({
        where: { userId: req.userId },
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        take: 12,
      });
      res.json({ budgets });
    }
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get current month budget
exports.getCurrentBudget = async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    if (process.env.USE_SUPABASE === '1' && supabase) {
      const found = await supabase
        .from('budgets')
        .select('*')
        .eq('userId', req.userId)
        .eq('month', month)
        .eq('year', year)
        .limit(1)
        .maybeSingle();
      let budget = found.data || null;
      if (!budget) {
        const insert = await supabase
          .from('budgets')
          .insert({
            userId: req.userId,
            month,
            year,
            monthlyIncome: 5000,
            housing: 1500,
            utilities: 200,
            food: 400,
            transportation: 300,
            insurance: 200,
            entertainment: 150,
            other: 250,
          })
          .select('*')
          .single();
        if (insert.error) return res.status(500).json({ error: 'Server error' });
        budget = insert.data;
      }
      return res.json({ budget });
    } else {
      let budget = await prisma.budget.findUnique({
        where: {
          userId_month_year: { userId: req.userId, month, year },
        },
      });
      if (!budget) {
        budget = await prisma.budget.create({
          data: {
            userId: req.userId,
            month,
            year,
            monthlyIncome: 5000,
            housing: 1500,
            utilities: 200,
            food: 400,
            transportation: 300,
            insurance: 200,
            entertainment: 150,
            other: 250,
          },
        });
      }
      res.json({ budget });
    }
  } catch (error) {
    console.error('Get current budget error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create or update budget
exports.upsertBudget = async (req, res) => {
  try {
    const {
      monthlyIncome,
      housing,
      utilities,
      food,
      transportation,
      insurance,
      entertainment,
      other,
      month,
      year,
    } = req.body;

    if (process.env.USE_SUPABASE === '1' && supabase) {
      const m = parseInt(month);
      const y = parseInt(year);
      const values = {
        monthlyIncome: parseFloat(monthlyIncome),
        housing: parseFloat(housing) || 0,
        utilities: parseFloat(utilities) || 0,
        food: parseFloat(food) || 0,
        transportation: parseFloat(transportation) || 0,
        insurance: parseFloat(insurance) || 0,
        entertainment: parseFloat(entertainment) || 0,
        other: parseFloat(other) || 0,
      };
      const found = await supabase
        .from('budgets')
        .select('id')
        .eq('userId', req.userId)
        .eq('month', m)
        .eq('year', y)
        .limit(1)
        .maybeSingle();
      let budget;
      if (found.data) {
        const upd = await supabase
          .from('budgets')
          .update(values)
          .eq('userId', req.userId)
          .eq('month', m)
          .eq('year', y)
          .select('*')
          .single();
        if (upd.error) return res.status(500).json({ error: 'Server error' });
        budget = upd.data;
      } else {
        const ins = await supabase
          .from('budgets')
          .insert({ userId: req.userId, month: m, year: y, ...values })
          .select('*')
          .single();
        if (ins.error) return res.status(500).json({ error: 'Server error' });
        budget = ins.data;
      }
      await supabase.from('activities').insert({ userId: req.userId, type: 'budget', description: `Budget updated for ${month}/${year}` });
      return res.json({ message: 'Budget saved successfully', budget });
    } else {
      const budget = await prisma.budget.upsert({
        where: { userId_month_year: { userId: req.userId, month: parseInt(month), year: parseInt(year) } },
        update: {
          monthlyIncome: parseFloat(monthlyIncome),
          housing: parseFloat(housing) || 0,
          utilities: parseFloat(utilities) || 0,
          food: parseFloat(food) || 0,
          transportation: parseFloat(transportation) || 0,
          insurance: parseFloat(insurance) || 0,
          entertainment: parseFloat(entertainment) || 0,
          other: parseFloat(other) || 0,
        },
        create: {
          userId: req.userId,
          month: parseInt(month),
          year: parseInt(year),
          monthlyIncome: parseFloat(monthlyIncome),
          housing: parseFloat(housing) || 0,
          utilities: parseFloat(utilities) || 0,
          food: parseFloat(food) || 0,
          transportation: parseFloat(transportation) || 0,
          insurance: parseFloat(insurance) || 0,
          entertainment: parseFloat(entertainment) || 0,
          other: parseFloat(other) || 0,
        },
      });
      await prisma.activity.create({ data: { userId: req.userId, type: 'budget', description: `Budget updated for ${month}/${year}` } });
      res.json({ message: 'Budget saved successfully', budget });
    }
  } catch (error) {
    console.error('Upsert budget error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete budget
exports.deleteBudget = async (req, res) => {
  try {
    const { month, year } = req.params;
    if (process.env.USE_SUPABASE === '1' && supabase) {
      const del = await supabase
        .from('budgets')
        .delete()
        .eq('userId', req.userId)
        .eq('month', parseInt(month))
        .eq('year', parseInt(year));
      if (del.error) return res.status(500).json({ error: 'Server error' });
      return res.json({ message: 'Budget deleted successfully' });
    } else {
      await prisma.budget.delete({
        where: { userId_month_year: { userId: req.userId, month: parseInt(month), year: parseInt(year) } },
      });
      res.json({ message: 'Budget deleted successfully' });
    }
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
