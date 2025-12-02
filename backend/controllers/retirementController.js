const { prisma } = require('../config/database');
const { supabase } = require('../config/supabase');

// Get retirement plans
exports.getRetirementPlans = async (req, res) => {
  try {
    if (process.env.USE_SUPABASE === '1' && supabase) {
      const result = await supabase
        .from('retirement_plans')
        .select('*')
        .eq('userId', req.userId)
        .order('createdAt', { ascending: false });
      if (result.error) return res.status(500).json({ error: 'Server error' });
      return res.json({ plans: result.data || [] });
    } else {
      const plans = await prisma.retirementPlan.findMany({ where: { userId: req.userId }, orderBy: { createdAt: 'desc' } });
      res.json({ plans });
    }
  } catch (error) {
    console.error('Get retirement plans error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create retirement plan
exports.createRetirementPlan = async (req, res) => {
  try {
    const {
      currentAge,
      retirementAge,
      currentSavings,
      monthlyContribution,
      expectedReturn,
      retirementGoal,
    } = req.body;

    if (process.env.USE_SUPABASE === '1' && supabase) {
      const ins = await supabase
        .from('retirement_plans')
        .insert({
          userId: req.userId,
          currentAge: parseInt(currentAge),
          retirementAge: parseInt(retirementAge),
          currentSavings: parseFloat(currentSavings),
          monthlyContribution: parseFloat(monthlyContribution),
          expectedReturn: parseFloat(expectedReturn),
          retirementGoal: parseFloat(retirementGoal),
        })
        .select('*')
        .single();
      if (ins.error) return res.status(500).json({ error: 'Server error' });
      await supabase.from('activities').insert({ userId: req.userId, type: 'retirement', description: 'Retirement plan created' });
      return res.status(201).json({ message: 'Retirement plan created successfully', plan: ins.data });
    } else {
      const plan = await prisma.retirementPlan.create({
        data: {
          userId: req.userId,
          currentAge: parseInt(currentAge),
          retirementAge: parseInt(retirementAge),
          currentSavings: parseFloat(currentSavings),
          monthlyContribution: parseFloat(monthlyContribution),
          expectedReturn: parseFloat(expectedReturn),
          retirementGoal: parseFloat(retirementGoal),
        },
      });
      await prisma.activity.create({ data: { userId: req.userId, type: 'retirement', description: 'Retirement plan created' } });
      res.status(201).json({ message: 'Retirement plan created successfully', plan });
    }
  } catch (error) {
    console.error('Create retirement plan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update retirement plan
exports.updateRetirementPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      currentAge,
      retirementAge,
      currentSavings,
      monthlyContribution,
      expectedReturn,
      retirementGoal,
    } = req.body;

    if (process.env.USE_SUPABASE === '1' && supabase) {
      const upd = await supabase
        .from('retirement_plans')
        .update({
          currentAge: parseInt(currentAge),
          retirementAge: parseInt(retirementAge),
          currentSavings: parseFloat(currentSavings),
          monthlyContribution: parseFloat(monthlyContribution),
          expectedReturn: parseFloat(expectedReturn),
          retirementGoal: parseFloat(retirementGoal),
        })
        .eq('id', id)
        .select('*')
        .single();
      if (upd.error) return res.status(500).json({ error: 'Server error' });
      return res.json({ message: 'Retirement plan updated successfully', plan: upd.data });
    } else {
      const plan = await prisma.retirementPlan.update({
        where: { id },
        data: {
          currentAge: parseInt(currentAge),
          retirementAge: parseInt(retirementAge),
          currentSavings: parseFloat(currentSavings),
          monthlyContribution: parseFloat(monthlyContribution),
          expectedReturn: parseFloat(expectedReturn),
          retirementGoal: parseFloat(retirementGoal),
        },
      });
      res.json({ message: 'Retirement plan updated successfully', plan });
    }
  } catch (error) {
    console.error('Update retirement plan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete retirement plan
exports.deleteRetirementPlan = async (req, res) => {
  try {
    const { id } = req.params;
    if (process.env.USE_SUPABASE === '1' && supabase) {
      const del = await supabase.from('retirement_plans').delete().eq('id', id);
      if (del.error) return res.status(500).json({ error: 'Server error' });
      return res.json({ message: 'Retirement plan deleted successfully' });
    } else {
      await prisma.retirementPlan.delete({ where: { id } });
      res.json({ message: 'Retirement plan deleted successfully' });
    }
  } catch (error) {
    console.error('Delete retirement plan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
