const { prisma } = require('../config/database');
const { supabase } = require('../config/supabase');

// Get user portfolio
exports.getPortfolio = async (req, res) => {
  try {
    if (process.env.USE_SUPABASE === '1' && supabase) {
      const found = await supabase
        .from('portfolios')
        .select('*')
        .eq('userId', req.userId)
        .limit(1)
        .maybeSingle();
      let portfolio = found.data || null;
      if (!portfolio) {
        const insert = await supabase
          .from('portfolios')
          .insert({
            userId: req.userId,
            stocks: 28125,
            bonds: 15625,
            realEstate: 12500,
            cash: 6250,
            totalInvested: 55000,
          })
          .select('*')
          .single();
        if (insert.error) return res.status(500).json({ error: 'Server error' });
        portfolio = insert.data;
      }
      return res.json({ portfolio });
    } else {
      let portfolio = await prisma.portfolio.findFirst({ where: { userId: req.userId } });
      if (!portfolio) {
        portfolio = await prisma.portfolio.create({
          data: { userId: req.userId, stocks: 28125, bonds: 15625, realEstate: 12500, cash: 6250, totalInvested: 55000 },
        });
      }
      res.json({ portfolio });
    }
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update portfolio
exports.updatePortfolio = async (req, res) => {
  try {
    const { stocks, bonds, realEstate, cash, totalInvested } = req.body;
    if (process.env.USE_SUPABASE === '1' && supabase) {
      const found = await supabase
        .from('portfolios')
        .select('id')
        .eq('userId', req.userId)
        .limit(1)
        .maybeSingle();
      const values = {
        stocks: parseFloat(stocks) || 0,
        bonds: parseFloat(bonds) || 0,
        realEstate: parseFloat(realEstate) || 0,
        cash: parseFloat(cash) || 0,
        totalInvested: parseFloat(totalInvested) || 0,
      };
      let portfolio;
      if (found.data) {
        const upd = await supabase
          .from('portfolios')
          .update(values)
          .eq('userId', req.userId)
          .select('*')
          .single();
        if (upd.error) return res.status(500).json({ error: 'Server error' });
        portfolio = upd.data;
      } else {
        const ins = await supabase
          .from('portfolios')
          .insert({ userId: req.userId, ...values })
          .select('*')
          .single();
        if (ins.error) return res.status(500).json({ error: 'Server error' });
        portfolio = ins.data;
      }
      await supabase.from('activities').insert({ userId: req.userId, type: 'portfolio', description: 'Portfolio updated' });
      return res.json({ message: 'Portfolio updated successfully', portfolio });
    } else {
      const portfolio = await prisma.portfolio.upsert({
        where: { userId: req.userId },
        update: {
          stocks: parseFloat(stocks) || 0,
          bonds: parseFloat(bonds) || 0,
          realEstate: parseFloat(realEstate) || 0,
          cash: parseFloat(cash) || 0,
          totalInvested: parseFloat(totalInvested) || 0,
        },
        create: {
          userId: req.userId,
          stocks: parseFloat(stocks) || 0,
          bonds: parseFloat(bonds) || 0,
          realEstate: parseFloat(realEstate) || 0,
          cash: parseFloat(cash) || 0,
          totalInvested: parseFloat(totalInvested) || 0,
        },
      });
      await prisma.activity.create({ data: { userId: req.userId, type: 'portfolio', description: 'Portfolio updated' } });
      res.json({ message: 'Portfolio updated successfully', portfolio });
    }
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
